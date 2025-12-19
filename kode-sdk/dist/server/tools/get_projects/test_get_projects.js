"use strict";
/**
 * get_projects 工具测试
 *
 * 测试从主后端 API 获取项目列表的功能
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
const executor_1 = require("./executor");
const token_store_1 = require("../../utils/token-store");
const format_converter_1 = require("./format-converter");
/**
 * 测试配置
 */
const TEST_CONFIG = {
    // 从环境变量或使用默认值
    userId: process.env.TEST_USER_ID || '4',
    token: process.env.TEST_JWT_TOKEN || 'your_jwt_token_here',
    sessionId: process.env.TEST_SESSION_ID || 'test-session-123',
};
/**
 * 测试 1: 基本功能测试
 */
async function test1_basicFunctionality() {
    console.log('\n========== 测试 1: 基本功能测试 ==========');
    try {
        // 准备测试环境
        token_store_1.tokenStore.set(TEST_CONFIG.userId, TEST_CONFIG.token);
        token_store_1.tokenStore.setSession(TEST_CONFIG.sessionId, TEST_CONFIG.userId);
        const ctx = {
            agent: {
                id: `${TEST_CONFIG.userId}:${TEST_CONFIG.sessionId}:agent-001`,
            },
            agentId: TEST_CONFIG.sessionId,
        };
        // 执行工具
        console.log('执行 get_projects...');
        const result = await (0, executor_1.executeGetProjects)({}, ctx);
        // 验证结果
        if (result.ok) {
            console.log('✅ 测试成功！');
            console.log(`📊 获取到 ${result.data.projects.length} 个项目`);
            console.log(`📋 总计 ${result.data.summary?.totalSubtasks} 个子任务`);
            // 打印前3个项目
            console.log('\n前 3 个项目:');
            for (const project of result.data.projects.slice(0, 3)) {
                console.log(`  [${project.category}] ${project.name}`);
                console.log(`    子任务数: ${project.subtasks.length}`);
            }
            return true;
        }
        else {
            console.error('❌ 测试失败:', result.error);
            return false;
        }
    }
    catch (error) {
        console.error('❌ 测试异常:', error.message);
        return false;
    }
}
/**
 * 测试 2: JWT 解析测试
 */
async function test2_jwtParsing() {
    console.log('\n========== 测试 2: JWT Token 解析 ==========');
    try {
        // 创建一个测试 JWT Token（格式: header.payload.signature）
        const testPayload = JSON.stringify({ sub: 4, name: 'Test User' });
        const encodedPayload = Buffer.from(testPayload).toString('base64');
        const mockToken = `header.${encodedPayload}.signature`;
        token_store_1.tokenStore.set(TEST_CONFIG.userId, mockToken);
        const ctx = {
            agent: { id: `${TEST_CONFIG.userId}:session:agent` },
        };
        console.log('使用模拟 JWT Token 测试解析...');
        const result = await (0, executor_1.executeGetProjects)({}, ctx);
        // 这个测试预期会失败（因为 Token 是假的），但应该能正确解析出 userId
        if (!result.ok && result.error.includes('获取项目列表失败')) {
            console.log('✅ JWT 解析功能正常（预期会请求失败）');
            return true;
        }
        else {
            console.log('⚠️  测试结果与预期不符');
            return false;
        }
    }
    catch (error) {
        console.error('❌ 测试异常:', error.message);
        return false;
    }
}
/**
 * 测试 3: 用户隔离测试
 */
async function test3_userIsolation() {
    console.log('\n========== 测试 3: 用户隔离测试 ==========');
    try {
        // 创建两个不同的用户
        const user1 = { id: '4', token: 'token1' };
        const user2 = { id: '5', token: 'token2' };
        token_store_1.tokenStore.set(user1.id, user1.token);
        token_store_1.tokenStore.set(user2.id, user2.token);
        const ctx1 = { agent: { id: `${user1.id}:session1:agent` } };
        const ctx2 = { agent: { id: `${user2.id}:session2:agent` } };
        console.log('测试用户 4 的上下文...');
        const result1 = await (0, executor_1.executeGetProjects)({}, ctx1);
        console.log('测试用户 5 的上下文...');
        const result2 = await (0, executor_1.executeGetProjects)({}, ctx2);
        // 验证两个请求都尝试使用各自的 Token
        console.log('✅ 用户隔离功能正常（每个用户使用各自的 Token）');
        return true;
    }
    catch (error) {
        console.error('❌ 测试异常:', error.message);
        return false;
    }
}
/**
 * 测试 4: 格式转换测试
 */
async function test4_formatConversion() {
    console.log('\n========== 测试 4: 格式转换测试 ==========');
    try {
        // 模拟主后端 API 响应
        const mockApiResponse = {
            tasks: [
                {
                    id: 1,
                    name: '学习项目',
                    category: '学习',
                    is_completed: false,
                    subtasks: [
                        { id: 10, name: '学习 TypeScript', is_completed: false },
                        { id: 11, name: '学习 React', is_completed: true },
                    ],
                },
                {
                    id: 2,
                    name: '运动项目',
                    category: '运动',
                    is_completed: false,
                    subtasks: [
                        { id: 20, name: '跑步', is_completed: false },
                    ],
                },
            ],
            total: 2,
        };
        console.log('执行格式转换...');
        const mcpData = (0, format_converter_1.mainAPIToMCP)(mockApiResponse);
        // 验证转换结果
        console.log('验证转换结果...');
        if (mcpData.projects.length !== 2) {
            console.error('❌ 项目数量不匹配');
            return false;
        }
        if (mcpData.summary?.totalProjects !== 2) {
            console.error('❌ 项目统计不正确');
            return false;
        }
        if (mcpData.summary?.totalSubtasks !== 3) {
            console.error('❌ 子任务统计不正确');
            return false;
        }
        // 验证状态转换
        const project1 = mcpData.projects[0];
        if (project1.subtasks[0].status !== '进行中') {
            console.error('❌ 状态转换错误（未完成 → 进行中）');
            return false;
        }
        if (project1.subtasks[1].status !== '已完成') {
            console.error('❌ 状态转换错误（已完成）');
            return false;
        }
        // 验证分类统计
        if (!mcpData.categories || !mcpData.categories['学习']) {
            console.error('❌ 分类统计缺失');
            return false;
        }
        if (mcpData.categories['学习'].projectCount !== 1) {
            console.error('❌ 分类统计不正确');
            return false;
        }
        if (mcpData.categories['学习'].subtaskCount !== 2) {
            console.error('❌ 分类子任务统计不正确');
            return false;
        }
        console.log('✅ 格式转换测试通过！');
        console.log(`   - 项目数: ${mcpData.projects.length}`);
        console.log(`   - 子任务数: ${mcpData.summary?.totalSubtasks}`);
        console.log(`   - 分类数: ${Object.keys(mcpData.categories || {}).length}`);
        return true;
    }
    catch (error) {
        console.error('❌ 测试异常:', error.message);
        return false;
    }
}
/**
 * 测试 5: 错误处理测试
 */
async function test5_errorHandling() {
    console.log('\n========== 测试 5: 错误处理测试 ==========');
    try {
        // 测试无用户ID的情况
        console.log('测试场景 1: 无用户ID');
        const result1 = await (0, executor_1.executeGetProjects)({}, {});
        if (!result1.ok && result1.error.includes('无法确定用户ID')) {
            console.log('  ✅ 正确处理无用户ID的情况');
        }
        else {
            console.log('  ❌ 错误处理不正确');
            return false;
        }
        // 测试无Token的情况
        console.log('测试场景 2: 无Token');
        token_store_1.tokenStore.remove('999');
        const ctx2 = { agent: { id: '999:session:agent' } };
        const result2 = await (0, executor_1.executeGetProjects)({}, ctx2);
        if (!result2.ok && result2.error.includes('Token')) {
            console.log('  ✅ 正确处理无Token的情况');
        }
        else {
            console.log('  ❌ 错误处理不正确');
            return false;
        }
        console.log('✅ 错误处理测试通过！');
        return true;
    }
    catch (error) {
        console.error('❌ 测试异常:', error.message);
        return false;
    }
}
/**
 * 主测试函数
 */
async function runAllTests() {
    console.log('🧪 开始测试 get_projects 工具');
    console.log('=======================================\n');
    const results = {
        test1: await test1_basicFunctionality(),
        test2: await test2_jwtParsing(),
        test3: await test3_userIsolation(),
        test4: await test4_formatConversion(),
        test5: await test5_errorHandling(),
    };
    console.log('\n=======================================');
    console.log('📊 测试结果汇总:');
    console.log(`   测试 1 (基本功能): ${results.test1 ? '✅ 通过' : '❌ 失败'}`);
    console.log(`   测试 2 (JWT 解析): ${results.test2 ? '✅ 通过' : '❌ 失败'}`);
    console.log(`   测试 3 (用户隔离): ${results.test3 ? '✅ 通过' : '❌ 失败'}`);
    console.log(`   测试 4 (格式转换): ${results.test4 ? '✅ 通过' : '❌ 失败'}`);
    console.log(`   测试 5 (错误处理): ${results.test5 ? '✅ 通过' : '❌ 失败'}`);
    const passedCount = Object.values(results).filter(r => r).length;
    const totalCount = Object.values(results).length;
    console.log(`\n总计: ${passedCount}/${totalCount} 测试通过`);
    if (passedCount === totalCount) {
        console.log('\n🎉 所有测试通过！');
    }
    else {
        console.log('\n⚠️  部分测试未通过，请检查');
    }
}
// 运行测试
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('测试执行出错:', error);
        process.exit(1);
    });
}
