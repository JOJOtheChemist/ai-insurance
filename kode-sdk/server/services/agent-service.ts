/**
 * Agent 服务层 - 管理 Agent 生命周期
 */

import { Agent, AnthropicProvider, AgentDependencies, AgentTemplateRegistry, JSONStore, ToolRegistry, SandboxFactory } from '../../src';
import { AgentConfig } from '../agents/types';
import { getTool } from '../tools';
import { config } from '../config';

/**
 * Agent 实例管理器
 */
class AgentManager {
  private agents = new Map<string, Agent>();
  private processingLocks = new Map<string, boolean>(); // key: userId:sessionId
  private agentLastUsed = new Map<string, number>(); // 记录Agent最后使用时间
  private cleanupInterval: NodeJS.Timeout | null = null; // 定期清理定时器
  private readonly AGENT_TIMEOUT_MS = 30 * 60 * 1000; // 30分钟超时
  private readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5分钟清理一次

  /**
   * 获取或创建 Agent
   */
  async getOrCreateAgent(agentConfig: AgentConfig): Promise<Agent> {
    const agentId = agentConfig.id;

    // 如果 Agent 已存在，更新使用时间并返回
    if (this.agents.has(agentId)) {
      this.agentLastUsed.set(agentId, Date.now());
      console.log(`📋 [复用] Agent: ${agentId}`);
      return this.agents.get(agentId)!;
    }

    console.log(`🆕 [创建] 初始化 Agent: ${agentId}`);

    // 🔥 优化存储结构：userId/sessionId/（扁平化，避免多层嵌套）
    // agentId 格式: userId:sessionId:agentType (例如: user1:concurrent_test_1:schedule-assistant)
    // JSONStore 会在 baseDir 后自动添加 agentId 作为子目录
    // 所以：baseDir=.kode/userId, agentId=sessionId
    // 最终路径：.kode/userId/sessionId/runtime/ 和 .kode/userId/sessionId/events/
    const parts = agentId.split(':');
    let storePath: string;
    let storeAgentId: string;

    if (parts.length === 3) {
      // 多用户多会话模式: user1:session1:agent-type
      const [userId, sessionId, agentType] = parts;
      storePath = `./.kode/${userId}`;  // baseDir 只到用户层
      storeAgentId = sessionId;  // sessionId 作为 agentId，JSONStore 会自动添加这一层
      console.log(`📁 [存储] 用户: ${userId}, 会话: ${sessionId}, 最终路径: ${storePath}/${storeAgentId}/`);
    } else {
      // 兼容模式: 原始单层 agentId
      storePath = `./.kode`;
      storeAgentId = agentId;
      console.log(`📁 [存储] 兼容模式，Agent: ${agentId}, 最终路径: ${storePath}/${agentId}/`);
    }

    const store = new JSONStore(storePath);
    const templates = new AgentTemplateRegistry();
    const tools = new ToolRegistry();
    const sandboxFactory = new SandboxFactory();

    // 注册工具
    agentConfig.tools.forEach((toolName) => {
      const toolReg = getTool(toolName);
      if (!toolReg) {
        throw new Error(`工具 ${toolName} 未注册`);
      }
      tools.register(toolName, () => toolReg.tool);
    });

    // 注册模板
    templates.register({
      id: agentConfig.templateId,
      systemPrompt: agentConfig.systemPrompt,
      tools: agentConfig.tools,
      model: agentConfig.modelId || config.ai.modelId,
    });

    // 创建 Anthropic Provider
    const modelFactory = () => new AnthropicProvider(
      config.ai.apiKey!,
      config.ai.modelId,
      config.ai.baseUrl || 'https://api.z.ai/api/paas/v4/'
    );

    const deps: AgentDependencies = {
      store,
      templateRegistry: templates,
      sandboxFactory,
      toolRegistry: tools,
      modelFactory,
    };

    // 检查是否存在历史数据（使用内部存储ID）
    const exists = await deps.store.exists(storeAgentId);
    let agent: Agent;

    if (exists) {
      console.log(`📂 [恢复] 从 Store 恢复 Agent: ${agentId} (存储ID: ${storeAgentId})`);
      try {
        agent = await Agent.resumeFromStore(storeAgentId, deps);
        console.log(`✅ [恢复] Agent 恢复成功，消息历史已加载`);
      } catch (resumeError: any) {
        console.error(`[错误] Agent 恢复失败: ${resumeError.message}`);
        console.log(`🔧 [回退] 创建新 Agent 替代损坏的会话`);
        // 如果恢复失败（例如metadata损坏），创建新的Agent
        agent = await Agent.create(
          {
            agentId: storeAgentId, // 使用简化的存储ID
            templateId: agentConfig.templateId,
            sandbox: { kind: 'local', workDir: config.agent.workDir },
            exposeThinking: false, // 🤔 关闭思考内容显示
            metadata: {
              toolTimeoutMs: config.agent.toolTimeoutMs,
              maxToolConcurrency: config.agent.maxToolConcurrency,
            },
          },
          deps
        );
        console.log(`✅ [创建] 新 Agent 创建完成（恢复失败后的回退）`);
      }
    } else {
      console.log(`🔧 [创建] 创建新 Agent: ${agentId} (存储ID: ${storeAgentId})`);
      agent = await Agent.create(
        {
          agentId: storeAgentId, // 使用简化的存储ID
          templateId: agentConfig.templateId,
          sandbox: { kind: 'local', workDir: config.agent.workDir },
          exposeThinking: true, // 🤔 开启思考内容显示
          metadata: {
            toolTimeoutMs: config.agent.toolTimeoutMs,
            maxToolConcurrency: config.agent.maxToolConcurrency,
          },
        },
        deps
      );
      console.log(`✅ [创建] Agent 创建完成`);
    }

    // 缓存 Agent 实例并记录创建时间
    this.agents.set(agentId, agent);
    this.processingLocks.set(agentId, false);
    this.agentLastUsed.set(agentId, Date.now());

    return agent;
  }

  /**
   * 获取 Agent（不创建）
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * 检查会话是否正在处理
   * @param lockKey - 锁的键，格式: "userId:sessionId"
   */
  isProcessing(lockKey: string): boolean {
    return this.processingLocks.get(lockKey) || false;
  }

  /**
   * 设置会话处理锁
   * @param lockKey - 锁的键，格式: "userId:sessionId"
   * @param processing - 是否正在处理
   */
  setProcessing(lockKey: string, processing: boolean): void {
    this.processingLocks.set(lockKey, processing);
    if (processing) {
      console.log(`🔒 [锁定] 会话 ${lockKey} 开始处理`);
    } else {
      console.log(`🔓 [解锁] 会话 ${lockKey} 处理完成`);
    }
  }

  /**
   * 获取所有 Agent ID
   */
  getAllAgentIds(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * 清理 Agent
   */
  async cleanup(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      console.log(`🧹 [清理] Agent: ${agentId}`);
      this.agents.delete(agentId);
      this.processingLocks.delete(agentId);
      this.agentLastUsed.delete(agentId);
    }
  }

  /**
   * 启动定期清理
   */
  startCleanup(): void {
    if (this.cleanupInterval) {
      console.log('⚠️ [清理] 定时器已启动');
      return;
    }

    console.log(`🔄 [清理] 启动定期清理，间隔: ${this.CLEANUP_INTERVAL_MS / 1000}秒`);
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveAgents();
    }, this.CLEANUP_INTERVAL_MS);
  }

  /**
   * 停止定期清理
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('🛑 [清理] 停止定期清理');
    }
  }

  /**
   * 清理不活跃的 Agent
   */
  private cleanupInactiveAgents(): void {
    const now = Date.now();
    const inactiveAgents: string[] = [];

    for (const [agentId, lastUsed] of this.agentLastUsed) {
      if (now - lastUsed > this.AGENT_TIMEOUT_MS) {
        inactiveAgents.push(agentId);
      }
    }

    if (inactiveAgents.length > 0) {
      console.log(`🧹 [清理] 发现 ${inactiveAgents.length} 个不活跃的Agent:`, inactiveAgents);

      for (const agentId of inactiveAgents) {
        this.cleanup(agentId);
      }
    }

    // 打印当前状态
    console.log(`📊 [清理] 当前活跃Agent数: ${this.agents.size}`);
  }

  /**
   * 获取Agent统计信息
   */
  getStats(): { total: number; active: number; inactive: number } {
    const now = Date.now();
    let inactive = 0;

    for (const lastUsed of this.agentLastUsed.values()) {
      if (now - lastUsed > this.AGENT_TIMEOUT_MS) {
        inactive++;
      }
    }

    return {
      total: this.agents.size,
      active: this.agents.size - inactive,
      inactive
    };
  }
}

/**
 * 全局 Agent 管理器实例
 */
export const agentManager = new AgentManager();

// 启动定期清理
agentManager.startCleanup();

