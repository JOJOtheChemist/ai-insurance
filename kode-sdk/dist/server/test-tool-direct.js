"use strict";
/**
 * 直接测试 create_timetable 工具（不通过 Agent）
 */
Object.defineProperty(exports, "__esModule", { value: true });
const executor_1 = require("./tools/create_timetable/executor");
const token_store_1 = require("./utils/token-store");
async function testToolDirect() {
    console.log('\n' + '='.repeat(60));
    console.log('  直接测试 create_timetable 工具');
    console.log('='.repeat(60) + '\n');
    // 配置
    const userId = '4';
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoieXVlIn0.IeM74Ndy8d6oyGscuJmH0_0fpr0FOBgyzXN3C5MomHE';
    // 设置 Token
    token_store_1.tokenStore.set(userId, userToken);
    console.log(`✅ 设置用户 ${userId} 的 Token\n`);
    // 准备测试数据
    const today = new Date().toISOString().split('T')[0];
    const testInput = {
        schedule: {
            [today]: [
                {
                    time_slot: "09:00-12:00",
                    actual_task: "计算机基础",
                    actual_notes: "学习编程和数据结构"
                },
                {
                    time_slot: "13:00-14:00",
                    actual_task: "法语学习",
                    actual_notes: "背单词和练习听力"
                },
                {
                    time_slot: "15:00-17:00",
                    actual_task: "唱歌练习",
                    actual_notes: "练习呼吸和音准"
                }
            ]
        }
    };
    console.log('📋 测试数据:');
    console.log(JSON.stringify(testInput, null, 2));
    console.log('\n');
    try {
        // 构造工具调用上下文
        const ctx = {
            userId,
            userToken,
        };
        console.log('🚀 调用 create_timetable 工具...\n');
        // 直接调用工具
        const result = await (0, executor_1.executeCreateTimetable)(testInput, ctx);
        console.log('\n' + '='.repeat(60));
        console.log('  测试结果');
        console.log('='.repeat(60) + '\n');
        if (result.ok) {
            console.log('✅ 工具执行成功！\n');
            console.log('返回数据:');
            console.log(JSON.stringify(result.data, null, 2));
        }
        else {
            console.log('❌ 工具执行失败\n');
            console.log('错误信息:', result.error);
        }
    }
    catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ 测试失败');
        console.error('='.repeat(60));
        console.error('\n错误:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}
// 运行测试
testToolDirect()
    .then(() => {
    console.log('\n✓ 测试完成');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ 测试异常:', error);
    process.exit(1);
});
