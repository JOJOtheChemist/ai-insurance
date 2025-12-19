"use strict";
/**
 * 服务器主入口文件
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const tools_1 = require("./tools");
const agents_1 = require("./agents");
/**
 * 初始化系统
 */
function initialize() {
    console.log('\n' + '='.repeat(60));
    console.log('  Kode Agent Server - 初始化');
    console.log('='.repeat(60));
    // 验证配置
    const validation = (0, config_1.validateConfig)();
    if (!validation.valid) {
        console.error('\n❌ 配置验证失败:');
        validation.errors.forEach((err) => console.error(`  - ${err}`));
        console.error('\n');
        process.exit(1);
    }
    console.log('\n✓ 配置验证通过');
    // 注册工具
    console.log('\n📦 注册工具...');
    (0, tools_1.registerDefaultTools)();
    // 注册 Agent 配置
    console.log('\n🤖 注册 Agent 配置...');
    (0, agents_1.registerDefaultAgentConfigs)();
    console.log('\n✅ 系统初始化完成');
}
/**
 * 启动服务器
 */
async function start() {
    // 初始化
    initialize();
    // 创建应用
    const app = (0, app_1.createApp)();
    // 启动监听（支持HOST环境变量，默认只监听localhost）
    app.listen(config_1.config.port, config_1.config.host, () => {
        console.log('\n' + '='.repeat(60));
        console.log('  服务器已启动');
        console.log('='.repeat(60));
        console.log(`\n✓ 服务器地址: http://${config_1.config.host}:${config_1.config.port}`);
        console.log(`✓ API Key: ${config_1.config.ai.apiKey ? '已配置' : '⚠️  未配置'}`);
        console.log(`✓ 模型: ${config_1.config.ai.modelId}`);
        console.log(`✓ 环境: ${config_1.config.isDevelopment ? '开发' : '生产'}`);
        console.log(`✓ 监听地址: ${config_1.config.host === '0.0.0.0' ? '所有接口（公网可访问）' : '仅本地接口（127.0.0.1）'}`);
        console.log('\n💡 打开浏览器访问: http://' + config_1.config.host + ':' + config_1.config.port);
        console.log('='.repeat(60) + '\n');
    });
}
// 启动服务器
start().catch((error) => {
    console.error('\n❌ 服务器启动失败:', error);
    process.exit(1);
});
