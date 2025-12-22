
import { Agent, AnthropicProvider, AgentDependencies, AgentTemplateRegistry, JSONStore, ToolRegistry, SandboxFactory } from '../src';
import { config, validateConfig } from './config';
import { insureRecommandV3AgentConfig } from './agents/insure-recommand-v3';
// 导入工具注册信息
import { insuranceFilterToolRegistration } from './tools/insurance_filter/registration';
import { insuranceSearchToolRegistration } from './tools/insurance_search/registration';
import { insuranceInspectToolRegistration } from './tools/insurance_inspect/registration';
import { updateClientIntelligenceToolRegistration } from './tools/update_client_intelligence/registration';

async function createTestAgent(): Promise<Agent> {
    console.log('\n🔧 初始化 保险推荐 Agent V3 测试环境...\n');

    const validation = validateConfig();
    if (!validation.valid) {
        console.error('❌ 配置验证失败:');
        validation.errors.forEach((err) => console.error(`  - ${err}`));
        throw new Error('配置错误');
    }

    const storePath = `./.kode/insure-recommand-v3-tool-test-${Date.now()}`;
    const store = new JSONStore(storePath);
    const templates = new AgentTemplateRegistry();
    const tools = new ToolRegistry();
    const sandboxFactory = new SandboxFactory();

    // 注册所有相关工具
    tools.register(insuranceFilterToolRegistration);
    tools.register(insuranceSearchToolRegistration);
    tools.register(insuranceInspectToolRegistration);
    tools.register(updateClientIntelligenceToolRegistration);

    // 注册模板
    templates.register({
        id: insureRecommandV3AgentConfig.templateId,
        systemPrompt: insureRecommandV3AgentConfig.systemPrompt,
        tools: insureRecommandV3AgentConfig.tools,
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
            agentId: 'insure-recommand-v3-test',
            templateId: insureRecommandV3AgentConfig.templateId,
            exposeThinking: true,
        },
        deps
    );

    console.log('✅ 保险推荐 Agent V3 创建成功');
    return agent;
}

async function runTest() {
    console.log('\n' + '='.repeat(60));
    console.log('  🧪 保险推荐 Agent V3 工具调用测试');
    console.log('='.repeat(60) + '\n');

    try {
        const agent = await createTestAgent();

        agent.on('tool_call', (event: any) => {
            console.log(`\n⛏️  [工具调用] ${event.tool} (params: ${JSON.stringify(event.params)})`);
        });

        agent.on('tool_result', (event: any) => {
            console.log(`\n📦 [工具结果] ${JSON.stringify(event.result)}`);
        });

        // 构造一个必定触发更新及多主体的消息
        const testMessage = `您好，我是做互联网开发的，叫张伟，今年32岁。最近我想给全家买点保险。我老婆叫刘英，28岁，还是家庭主妇。我儿子小张刚满3岁。我们预算大概一年3万左右。`;

        console.log('💬 发送测试消息:');
        console.log(testMessage);

        await agent.send(testMessage);

        // 简单轮询等待
        let attempts = 0;
        const maxAttempts = 60;
        while (attempts < maxAttempts) {
            const status = await agent.status();
            process.stdout.write('.'); // 进度条
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

        // 打印最后的回复（通常在 message_stream 中，这里简化无法直接获取 stream，但日志中会有 Tool Call）

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
