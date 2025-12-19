"use strict";
/**
 * 测试 API 连接
 * 用于诊断 AI 模型调用问题
 */
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../src/infra/provider");
async function testApiConnection() {
    console.log('\n' + '='.repeat(60));
    console.log('  测试 AI API 连接');
    console.log('='.repeat(60) + '\n');
    // 从环境变量读取配置
    const apiKey = process.env.ANTHROPIC_API_KEY || '';
    const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.z.ai/api/paas/v4/';
    const modelId = process.env.ANTHROPIC_MODEL_ID || 'glm-4.6';
    console.log('📋 配置信息:');
    console.log(`  API Key: ${apiKey.substring(0, 20)}...`);
    console.log(`  Base URL: ${baseUrl}`);
    console.log(`  Model ID: ${modelId}`);
    console.log('');
    if (!apiKey) {
        console.error('❌ 未设置 ANTHROPIC_API_KEY');
        process.exit(1);
    }
    try {
        // 创建 provider
        const provider = new provider_1.AnthropicProvider(apiKey, modelId, baseUrl);
        console.log('✅ Provider 创建成功\n');
        // 测试简单的完成请求
        console.log('🧪 测试 1: 简单的 complete 请求...');
        const testMessages = [
            { role: 'user', content: [{ type: 'text', text: '你好，请回复"测试成功"' }] }
        ];
        const response = await provider.complete(testMessages, {
            maxTokens: 100,
            temperature: 0.7,
        });
        console.log('✅ Complete 请求成功');
        console.log('  响应:', JSON.stringify(response, null, 2));
        console.log('');
        // 测试流式请求
        console.log('🧪 测试 2: 流式 stream 请求...');
        const stream = provider.stream(testMessages, {
            maxTokens: 100,
            temperature: 0.7,
        });
        let chunkCount = 0;
        for await (const chunk of stream) {
            chunkCount++;
            console.log(`  Chunk ${chunkCount}:`, chunk.type);
            if (chunkCount > 5) {
                console.log('  （省略后续chunks...）');
                break;
            }
        }
        console.log('✅ Stream 请求成功');
        console.log(`  收到 ${chunkCount} 个 chunks\n`);
        console.log('='.repeat(60));
        console.log('✅ 所有测试通过！API 连接正常');
        console.log('='.repeat(60) + '\n');
    }
    catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ API 连接测试失败');
        console.error('='.repeat(60));
        console.error('\n错误类型:', error?.constructor?.name || typeof error);
        console.error('错误信息:', error?.message || String(error));
        console.error('\n完整错误:');
        console.error(error);
        console.error('\n堆栈跟踪:');
        console.error(error?.stack);
        console.error('\n');
        // 诊断建议
        console.log('💡 诊断建议:');
        console.log('  1. 检查 API Key 是否有效');
        console.log('  2. 检查 Base URL 是否正确');
        console.log('  3. 检查网络连接');
        console.log('  4. 检查模型ID是否支持');
        console.log('  5. 查看完整的错误响应\n');
        process.exit(1);
    }
}
// 运行测试
testApiConnection()
    .then(() => {
    console.log('✓ 测试脚本执行完毕');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ 测试脚本异常:', error);
    process.exit(1);
});
