/**
 * 聊天路由
 */

import { Router, Request } from 'express';
import { agentManager } from '../services/agent-service';
import { getAgentConfig } from '../agents';
import { SSEEmitter, setupSSE } from '../utils/sse';
import { authenticateToken } from '../middleware/auth';
import { tokenStore } from '../utils/token-store';
const router = Router();

/**
 * POST /api/chat
 * 处理聊天消息，使用 SSE 流式返回
 */
router.post('/chat', authenticateToken, async (req, res) => {
  const { message, agentId = 'schedule-assistant', sessionId } = req.body;
  const userId = req.user?.userId || req.body.userId; // 从JWT token获取用户ID

  // 🔥 提取用户的Token（用于调用MCP API）
  const authHeader = req.headers['authorization'];
  const userToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // 存储用户Token到全局store（供工具执行时使用）
  if (userToken && userId) {
    tokenStore.set(userId, userToken);
    console.log(`[Token Store] 已存储用户 ${userId} 的Token`);
  }

  // 存储sessionId -> userId映射（供工具根据sessionId查找userId）
  if (sessionId && userId) {
    tokenStore.setSession(sessionId, userId);
  }

  if (!message) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  // 获取 Agent 配置
  console.log(`[Chat] 请求 agentId: ${agentId}`);
  const agentConfig = getAgentConfig(agentId);
  console.log(`[Chat] getAgentConfig 结果:`, agentConfig ? `找到 ${agentConfig.name}` : '未找到');
  if (!agentConfig) {
    return res.status(404).json({ error: `Agent ${agentId} 不存在` });
  }

  // 使用 sessionId 或 agentId 作为会话标识
  const actualSessionId = sessionId || agentId;

  // 🔥 创建会话级别的锁键（userId:sessionId），而不是 agentId
  // 这样不同会话可以并发处理，互不干扰
  const lockKey = `${userId}:${actualSessionId}`;

  // 检查是否有其他请求正在处理这个特定会话
  if (agentManager.isProcessing(lockKey)) {
    console.log(`\n[排队] 会话 ${lockKey} 正在处理中，消息: ${message}`);
    return res.status(429).json({ error: '该会话正在处理中，请稍后再试' });
  }

  agentManager.setProcessing(lockKey, true);
  console.log(`\n[用户 → ${agentConfig.name}] 会话: ${actualSessionId}, 消息: ${message}`);


  // 设置 SSE（传入sessionId，所有事件都会自动携带）
  setupSSE(res);
  const emitter = new SSEEmitter(res, actualSessionId);

  let statusCheck: NodeJS.Timeout | undefined;
  let assistantResponse = ''; // 收集AI回复

  try {
    // 🔥 改进的Agent管理策略
    // - 如果有sessionId，使用 userId:sessionId:agentId 创建独立实例（带用户归属）
    // - 否则使用原始agentId（兼容性）
    const agentIdForSession = sessionId ? `${userId}:${sessionId}:${agentId}` : agentId;
    const sessionAgentConfig = { ...agentConfig, id: agentIdForSession };

    console.log(`🎯 [Agent策略] 原始ID: ${agentId}, 会话ID: ${sessionId || 'none'}, 最终ID: ${agentIdForSession}`);

    const agent = await agentManager.getOrCreateAgent(sessionAgentConfig);

    // 🔥 设置用户认证信息到Agent（传递给工具）
    if (userToken && userId) {
      agent.setUserAuth(userId, userToken);
      console.log(`[Agent] ✅ 已设置用户认证: ${userId}`);
    }

    // 🔥 设置会话信息（传递给工具）
    agent.setSessionInfo(actualSessionId);

    let toolCount = 0;
    let isCompleted = false;

    // 监听工具执行
    const toolHandler = (event: any) => {
      toolCount++;
      console.log(
        `[工具执行 ${toolCount}] ${event.call.name}: ${event.call.inputPreview} → ${JSON.stringify(event.call.result)}`
      );
      emitter.sendTool({
        index: toolCount,
        name: event.call.name,
        input: event.call.inputPreview,
        output: event.call.result,
        duration: event.call.durationMs,
        state: event.call.state,
      });
    };

    agent.on('tool_executed', toolHandler);

    // 监听状态变化
    agent.on('state_changed', (event: any) => {
      console.log(`[Agent 状态变化] ${event.from} → ${event.to}`);
    });

    // 监听错误
    agent.on('error', (event: any) => {
      console.error(`[Agent 错误] phase=${event.phase}, message=${event.message}`);
    });

    // 订阅 Progress 事件流
    console.log('[订阅] 开始 Progress 事件流监听...');

    const progressSubscription = (async () => {
      try {
        for await (const envelope of agent.subscribe(['progress'])) {
          const event = envelope.event;

          switch (event.type) {
            case 'think_chunk_start':
              console.log('[think_chunk_start] 思考开始');
              emitter.send('think_start', {});
              break;

            case 'think_chunk':
              // 🔥 发送 thinking 事件，让前端显示思考过程
              console.log('[think_chunk] 发送思考内容，长度:', event.delta?.length || 0);
              emitter.send('thinking', { delta: event.delta });
              break;

            case 'think_chunk_end':
              console.log('[think_chunk_end] 思考结束');
              emitter.send('think_end', {});
              break;

            case 'text_chunk':
              assistantResponse += event.delta; // 收集AI回复
              emitter.sendText(event.delta);
              break;

            case 'text_chunk_start':
              console.log('[text_chunk_start] 正式回复开始');
              emitter.send('start', {});
              break;

            case 'text_chunk_end':
              console.log('[text_chunk_end] 正式回复结束');
              emitter.send('end', {});
              break;

            case 'tool:start':
              console.log(`[工具开始] ${event.call.name}`);
              emitter.sendToolStart(event.call.name, event.call.inputPreview);
              break;

            case 'tool:end':
              console.log(`[工具结束] ${event.call.name} (${event.call.durationMs}ms)`);
              emitter.sendToolEnd(event.call.name, event.call.durationMs ?? 0);
              break;

            case 'tool:error':
              console.log(`[工具错误] ${event.error}`);
              emitter.send('tool_error', { error: event.error });
              break;

            case 'done':
              console.log(
                `[对话完成] 工具调用次数: ${toolCount}, 原因: ${event.reason}, bookmark: ${JSON.stringify(envelope.bookmark)}`
              );


              emitter.sendComplete({
                reason: event.reason,
                toolCount,
                bookmark: envelope.bookmark,
              });
              isCompleted = true;
              if (statusCheck) clearInterval(statusCheck);
              // 🔥 关键修复：done事件时立即释放锁，允许新消息进入
              // 参考：学习笔记/03-Progress事件流与历史持久化完整指南.md
              agentManager.setProcessing(lockKey, false);
              console.log('[锁已释放] ✅ 可以接收新消息了');
              emitter.end();
              return;
          }
        }
      } catch (error: any) {
        console.error('[订阅流错误]', error.message);
        if (!isCompleted) {
          emitter.sendError(error.message);
          // 🔥 错误时也要释放锁
          agentManager.setProcessing(lockKey, false);
          console.log('[锁已释放] ❌ 因错误释放');
          emitter.end();
        }
      }
    })();

    progressSubscription.catch((error) => {
      console.error('[订阅异常]', error);
      if (!isCompleted) {
        emitter.sendError(error.message || '订阅流异常');
        // 🔥 异常时也要释放锁
        agentManager.setProcessing(lockKey, false);
        console.log('[锁已释放] ⚠️ 因异常释放');
        emitter.end();
      }
    });

    // 检查 Agent 状态
    const statusBefore = await agent.status();
    console.log(
      `[发送前状态] state=${statusBefore.state}, breakpoint=${statusBefore.breakpoint}, step=${statusBefore.stepCount}, messages=${statusBefore.lastSfpIndex + 1}`
    );

    // 发送用户消息
    console.log('[发送消息] 触发处理...');
    console.log(`[消息内容] ${message}`);

    await agent.send(message);

    console.log('[消息已入队] Agent 正在异步处理，事件会通过订阅流返回');

    // 立即检查状态
    const statusAfter = await agent.status();
    console.log(
      `[发送后状态] state=${statusAfter.state}, breakpoint=${statusAfter.breakpoint}, step=${statusAfter.stepCount}`
    );

    // 每2秒检查一次状态（调试用）
    statusCheck = setInterval(async () => {
      const status = await agent.status();
      console.log(
        `[状态] state=${status.state}, breakpoint=${status.breakpoint}, step=${status.stepCount}`
      );
    }, 2000);

    // 客户端断开时清理
    req.on('close', () => {
      console.log('[连接关闭] 客户端断开');
      if (statusCheck) clearInterval(statusCheck);
    });
  } catch (error: any) {
    console.error('[错误]', error.message);
    if (!res.headersSent) {
      emitter.sendError(error.message);
      // 🔥 外层错误也要释放锁
      agentManager.setProcessing(lockKey, false);
      console.log('[锁已释放] ❌ 因外层错误释放');
      emitter.end();
    }
  } finally {
    if (statusCheck) clearInterval(statusCheck);
    // 🔥 finally中确保锁被释放（防止某些情况下锁没被释放）
    // 注意：如果已经在done/error/catch中释放了，这里再调用一次也是安全的
    agentManager.setProcessing(lockKey, false);
  }
});

export default router;

