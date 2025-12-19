/**
 * 服务器主入口文件
 */

import { createApp } from './app';
import { config, validateConfig } from './config';
import { registerDefaultTools } from './tools';
import { registerDefaultAgentConfigs } from './agents';

/**
 * 初始化系统
 */
function initialize(): void {
  console.log('\n' + '='.repeat(60));
  console.log('  Kode Agent Server - 初始化');
  console.log('='.repeat(60));

  // 验证配置
  const validation = validateConfig();
  if (!validation.valid) {
    console.error('\n❌ 配置验证失败:');
    validation.errors.forEach((err) => console.error(`  - ${err}`));
    console.error('\n');
    process.exit(1);
  }

  console.log('\n✓ 配置验证通过');

  // 注册工具
  console.log('\n📦 注册工具...');
  registerDefaultTools();

  // 注册 Agent 配置
  console.log('\n🤖 注册 Agent 配置...');
  registerDefaultAgentConfigs();

  console.log('\n✅ 系统初始化完成');
}

/**
 * 启动服务器
 */
async function start(): Promise<void> {
  // 初始化
  initialize();

  // 创建应用
  const app = createApp();

  // 启动监听（支持HOST环境变量，默认只监听localhost）
  app.listen(config.port, config.host, () => {
    console.log('\n' + '='.repeat(60));
    console.log('  服务器已启动');
    console.log('='.repeat(60));
    console.log(`\n✓ 服务器地址: http://${config.host}:${config.port}`);
    console.log(`✓ API Key: ${config.ai.apiKey ? '已配置' : '⚠️  未配置'}`);
    console.log(`✓ 模型: ${config.ai.modelId}`);
    console.log(`✓ 环境: ${config.isDevelopment ? '开发' : '生产'}`);
    console.log(`✓ 监听地址: ${config.host === '0.0.0.0' ? '所有接口（公网可访问）' : '仅本地接口（127.0.0.1）'}`);
    console.log('\n💡 打开浏览器访问: http://' + config.host + ':' + config.port);
    console.log('='.repeat(60) + '\n');
  });
}

// 启动服务器
start().catch((error) => {
  console.error('\n❌ 服务器启动失败:', error);
  process.exit(1);
});

