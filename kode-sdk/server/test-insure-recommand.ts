/**
 * 测试 保险推荐 Agent（insure-recommand-v1）
 * 运行方式: npx ts-node server/test-insure-recommand.ts
 */

import { Agent, AnthropicProvider, AgentDependencies, AgentTemplateRegistry, JSONStore, ToolRegistry, SandboxFactory } from '../src';
import { config, validateConfig } from './config';
import { insureRecommandV1AgentConfig } from './agents/insure-recommand-v1';

async function createTestAgent(): Promise<Agent> {
  console.log('\n🔧 初始化 保险推荐 Agent 测试环境...\n');

  const validation = validateConfig();
  if (!validation.valid) {
    console.error('❌ 配置验证失败:');
    validation.errors.forEach((err) => console.error(`  - ${err}`));
    throw new Error('配置错误');
  }

  const storePath = `./.kode/insure-recommand-v1-${Date.now()}`;
  const store = new JSONStore(storePath);
  const templates = new AgentTemplateRegistry();
  const tools = new ToolRegistry();
  const sandboxFactory = new SandboxFactory();

  // 本 Agent 暂无工具

  // 注册模板
  templates.register({
    id: insureRecommandV1AgentConfig.templateId,
    systemPrompt: insureRecommandV1AgentConfig.systemPrompt,
    tools: insureRecommandV1AgentConfig.tools,
    model: config.ai.modelId,
  });

  // 创建 Provider
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

  const agent = await Agent.create(
    {
      agentId: 'insure-recommand-v1-test',
      templateId: insureRecommandV1AgentConfig.templateId,
      exposeThinking: true,
    },
    deps
  );

  console.log('✅ 保险推荐 Agent 创建成功');
  return agent;
}

async function runTest() {
  console.log('\n' + '='.repeat(60));
  console.log('  🧪 保险推荐 Agent 测试');
  console.log('='.repeat(60) + '\n');

  try {
    const agent = await createTestAgent();

    // 监听错误
    agent.on('error', (event: any) => {
      console.error('\n❌ [错误]', event.error);
    });

    const testMessage = `我：35岁，已婚有两个孩子，预算每年5000-8000，主要想配置重疾险，是否需要附加住院医疗？请结合常见责任与等待期说明。`;

    console.log('💬 发送测试消息:');
    console.log(testMessage);

    await agent.send(testMessage);

    // 简单轮询等待
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
      const status = await agent.status();
      console.log(`⏳ 状态: state=${status.state}, step=${status.stepCount}`);
      if (status.state === 'READY') {
        console.log('\n✅ Agent 处理完成');
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.warn('\n⚠️  等待超时，Agent 可能仍在处理中');
    }

    console.log('\n📝 测试完成，请在上方日志查看模型输出（应为合法 JSON）。');
  } catch (err: any) {
    console.error('\n❌ 测试失败:', err.message);
    process.exit(1);
  }
}

runTest()
  .then(() => {
    console.log('✓ 测试脚本执行完毕');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ 测试脚本执行失败', e);
    process.exit(1);
  });
