"use strict";
/**
 * 测试日程助手 Agent（使用 create_timetable 工具）
 * 运行方式: npx ts-node server/test-schedule-assistant.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const tools_1 = require("./tools");
const schedule_assistant_1 = require("./agents/schedule-assistant");
const config_1 = require("./config");
const token_store_1 = require("./utils/token-store");
// 测试配置 - 从环境变量读取或使用默认值
const TEST_CONFIG = {
    userId: process.env.TEST_USER_ID || '4',
    token: process.env.TEST_USER_TOKEN || '',
};
/**
 * 创建测试 Agent
 */
async function createTestAgent() {
    console.log('\n🔧 初始化日程助手测试环境...\n');
    // 验证配置
    const validation = (0, config_1.validateConfig)();
    if (!validation.valid) {
        console.error('❌ 配置验证失败:');
        validation.errors.forEach((err) => console.error(`  - ${err}`));
        throw new Error('配置错误');
    }
    // 注册所有工具
    (0, tools_1.registerDefaultTools)();
    console.log('✓ 工具已注册\n');
    // 设置用户Token
    if (TEST_CONFIG.token) {
        token_store_1.tokenStore.set(TEST_CONFIG.userId, TEST_CONFIG.token);
        console.log(`✓ 用户Token已设置 (userId: ${TEST_CONFIG.userId})\n`);
    }
    else {
        console.warn('⚠️  未设置Token，请通过环境变量 TEST_USER_TOKEN 设置\n');
    }
    // 创建 Agent 依赖
    const storePath = `./.kode/schedule-assistant-${Date.now()}`;
    const store = new src_1.JSONStore(storePath);
    const templates = new src_1.AgentTemplateRegistry();
    const tools = new src_1.ToolRegistry();
    const sandboxFactory = new src_1.SandboxFactory();
    // 注册工具
    schedule_assistant_1.scheduleAssistantConfig.tools.forEach((toolName) => {
        const toolReg = (0, tools_1.getTool)(toolName);
        if (!toolReg) {
            throw new Error(`工具 ${toolName} 未注册`);
        }
        tools.register(toolName, () => toolReg.tool);
    });
    // 注册模板
    templates.register({
        id: schedule_assistant_1.scheduleAssistantConfig.templateId,
        systemPrompt: schedule_assistant_1.scheduleAssistantConfig.systemPrompt,
        tools: schedule_assistant_1.scheduleAssistantConfig.tools,
        model: config_1.config.ai.modelId,
    });
    // 创建 Anthropic Provider
    const modelFactory = () => new src_1.AnthropicProvider(config_1.config.ai.apiKey, config_1.config.ai.modelId, config_1.config.ai.baseUrl || 'https://api.z.ai/api/paas/v4/');
    const deps = {
        store,
        templateRegistry: templates,
        sandboxFactory,
        toolRegistry: tools,
        modelFactory,
    };
    // 创建新的 Agent
    const agent = await src_1.Agent.create({
        agentId: 'schedule-test-agent',
        templateId: schedule_assistant_1.scheduleAssistantConfig.templateId,
    }, deps);
    // 设置用户认证
    if (TEST_CONFIG.token) {
        agent.setUserAuth(TEST_CONFIG.userId, TEST_CONFIG.token);
    }
    console.log('✅ 日程助手 Agent 创建成功\n');
    return agent;
}
/**
 * 运行测试
 */
async function runTest() {
    console.log('\n' + '='.repeat(60));
    console.log('  日程助手 (Schedule Assistant) 测试');
    console.log('  使用 create_timetable 工具');
    console.log('='.repeat(60) + '\n');
    try {
        // 创建 Agent
        const agent = await createTestAgent();
        // 监听工具执行
        agent.on('tool_executed', (event) => {
            console.log('\n📦 [工具执行]');
            console.log(`  工具名称: ${event.call.name}`);
            console.log(`  输入预览: ${event.call.inputPreview}`);
            console.log(`  执行耗时: ${event.call.durationMs}ms`);
            console.log(`  执行状态: ${event.call.state}`);
            if (event.call.result) {
                console.log(`  执行结果: ${JSON.stringify(event.call.result, null, 2)}`);
            }
        });
        // 监听错误
        agent.on('error', (event) => {
            console.error('\n❌ [错误]', event.error);
        });
        // 测试消息
        const today = new Date().toISOString().split('T')[0];
        const testMessage = `帮我创建今天（${today}）的时间表：
- 9点到12点写代码
- 12点半吃饭
- 下午2点到4点开会`;
        console.log('📋 测试消息:');
        console.log(testMessage);
        console.log('\n');
        console.log('💬 发送测试消息...\n');
        // 发送消息并等待响应
        await agent.send(testMessage);
        // 等待 Agent 处理完成
        let attempts = 0;
        const maxAttempts = 30;
        while (attempts < maxAttempts) {
            const status = await agent.status();
            console.log(`⏳ 状态检查 (${attempts + 1}/${maxAttempts}): state=${status.state}, step=${status.stepCount}`);
            if (status.state === 'READY') {
                console.log('\n✅ Agent 处理完成！\n');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        if (attempts >= maxAttempts) {
            console.warn('\n⚠️  等待超时，Agent 可能仍在处理中\n');
        }
        // 获取最终响应
        const finalStatus = await agent.status();
        console.log('\n' + '='.repeat(60));
        console.log('  测试完成');
        console.log('='.repeat(60));
        console.log(`\n最终状态: ${finalStatus.state}`);
        console.log(`执行步数: ${finalStatus.stepCount}`);
        console.log('\n💡 提示：请检查后端日志和数据库验证数据是否创建成功\n');
    }
    catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}
// 运行测试
runTest().then(() => {
    console.log('✓ 测试脚本执行完毕');
    process.exit(0);
}).catch((error) => {
    console.error('❌ 测试脚本执行失败:', error);
    process.exit(1);
});
