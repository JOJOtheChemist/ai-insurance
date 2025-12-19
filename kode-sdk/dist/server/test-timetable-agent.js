"use strict";
/**
 * 测试 create_timetable 工具的脚本
 * 运行方式: npx ts-node server/test-timetable-agent.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const tools_1 = require("./tools");
const timetable_agent_1 = require("./agents/timetable-agent");
const config_1 = require("./config");
const token_store_1 = require("./utils/token-store");
const axios_1 = __importDefault(require("axios"));
// 测试配置 - 从环境变量读取或使用默认值
const TEST_CONFIG = {
    userId: process.env.TEST_USER_ID || '4',
    // 使用 yue 用户的默认 token (user_id=4)
    token: process.env.TEST_USER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoieXVlIn0.IeM74Ndy8d6oyGscuJmH0_0fpr0FOBgyzXN3C5MomHE',
};
/**
 * 获取用户的项目和子任务列表（不包含ID）
 */
async function getUserProjectsWithSubtasks(token, userId) {
    try {
        const response = await axios_1.default.get(`http://localhost:8000/api/v1/tasks?user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        });
        if (!response || !response.data) {
            console.error('获取项目列表失败: 响应数据为空');
            return [];
        }
        const data = response.data;
        const tasks = data.tasks || [];
        if (!Array.isArray(tasks)) {
            console.error('获取项目列表失败: tasks 不是数组');
            return [];
        }
        return tasks.map((task) => ({
            name: task.name,
            subtasks: (task.subtasks || []).map((sub) => sub.name).filter((name) => name)
        })).filter((project) => project.name);
    }
    catch (error) {
        console.error('获取项目列表失败:', error.response?.data || error.message);
        return [];
    }
}
/**
 * 生成自然语言测试消息
 */
async function generateNaturalLanguageMessage(userToken) {
    // 获取当前时间
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    // 根据当前时间判断应该使用actual还是planned
    // 如果当前时间很晚（比如晚上），之前的时间段应该是actual（实际发生的）
    // 如果当前时间是上午，下午和晚上的时间段可能是planned（计划）或actual（如果用户说的是已经发生的）
    // 使用简单的自然语言创建日程，强调是"已经做了"的事情
    return `【当前时间】
现在是 ${today} ${currentTimeStr}

【任务】
请帮我创建今天（${today}）的时间表，这些都是我今天已经完成的事情：
- 上午10点到12点学习了计算机基础-数据结构与算法
- 下午2点到4点练习了法语学习-词汇记忆
- 晚上8点到10点练习了唱歌-声乐基础

请根据当前时间判断这些时间段是否已经过去，然后选择合适的字段（planned_task 或 actual_task）来记录。`;
}
/**
 * 创建测试 Agent
 */
async function createTestAgent() {
    console.log('\n🔧 初始化测试环境...\n');
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
    const storePath = `./.kode/test-${Date.now()}`;
    const store = new src_1.JSONStore(storePath);
    const templates = new src_1.AgentTemplateRegistry();
    const tools = new src_1.ToolRegistry();
    const sandboxFactory = new src_1.SandboxFactory();
    // 注册工具
    timetable_agent_1.timetableAgentConfig.tools.forEach((toolName) => {
        const toolReg = (0, tools_1.getTool)(toolName);
        if (!toolReg) {
            throw new Error(`工具 ${toolName} 未注册`);
        }
        tools.register(toolName, () => toolReg.tool);
    });
    // 注册模板
    templates.register({
        id: timetable_agent_1.timetableAgentConfig.templateId,
        systemPrompt: timetable_agent_1.timetableAgentConfig.systemPrompt,
        tools: timetable_agent_1.timetableAgentConfig.tools,
        model: config_1.config.ai.modelId,
    });
    // 创建 Anthropic Provider
    const modelFactory = () => new src_1.AnthropicProvider(config_1.config.ai.apiKey, config_1.config.ai.modelId, config_1.config.ai.baseUrl || 'https://open.bigmodel.cn/api/anthropic/v1/messages');
    const deps = {
        store,
        templateRegistry: templates,
        sandboxFactory,
        toolRegistry: tools,
        modelFactory,
    };
    // 创建新的 Agent
    const agent = await src_1.Agent.create({
        agentId: 'test-agent',
        templateId: timetable_agent_1.timetableAgentConfig.templateId,
    }, deps);
    // 设置用户认证
    if (TEST_CONFIG.token) {
        agent.setUserAuth(TEST_CONFIG.userId, TEST_CONFIG.token);
    }
    console.log('✅ Agent 创建成功\n');
    return agent;
}
/**
 * 运行测试
 */
async function runTest() {
    console.log('\n' + '='.repeat(60));
    console.log('  🧪 时间表Agent测试 - 自然语言创建日程');
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
            console.log(`  执行结果: ${JSON.stringify(event.call.result, null, 2)}`);
        });
        // 监听错误
        agent.on('error', (event) => {
            console.error('\n❌ [错误详情]');
            console.error('  错误类型:', typeof event.error);
            console.error('  错误信息:', event.error);
            console.error('  完整事件:', JSON.stringify(event, null, 2));
        });
        // 生成自然语言测试消息
        console.log('📝 生成自然语言测试消息...\n');
        const testMessage = await generateNaturalLanguageMessage(TEST_CONFIG.token);
        console.log('💬 测试消息内容:');
        console.log('─'.repeat(60));
        console.log(testMessage);
        console.log('─'.repeat(60));
        console.log('\n💬 发送测试消息到 Agent...\n');
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
        console.log('\n💡 提示：请检查后端日志和 PostgreSQL 数据库验证数据是否创建成功\n');
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
