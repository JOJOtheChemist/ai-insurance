"use strict";
/**
 * 自然语言转换工具 - 使用 tool 方法定义
 *
 * 功能：将用户的自然语言描述转换为结构化的时间槽格式（exam.json）
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalLanguageToStructuredTool = exports.processAIParsedSchedule = exports.printConversionSummary = exports.examToMainAPI = exports.buildRetryPrompt = exports.buildSystemPrompt = exports.validateScheduleData = exports.createScheduleTool = void 0;
exports.getAvailableTasks = getAvailableTasks;
exports.parseWithGLMAndValidate = parseWithGLMAndValidate;
const tool_1 = require("../../../src/tools/tool");
const zod_1 = require("zod");
const glm_client_1 = require("../../utils/glm-client");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const config_1 = require("../config");
const token_store_1 = require("../../utils/token-store");
const dotenv = __importStar(require("dotenv"));
// 加载环境变量
dotenv.config();
/**
 * 参数验证 Schema
 */
const createScheduleSchema = zod_1.z.object({
    user_input: zod_1.z.string().describe('用户关于日程的自然语言描述，例如："我三点睡到早上八点就起来了，心情很好"'),
    current_date: zod_1.z.string().optional().describe('当前日期 (YYYY-MM-DD)，用于解析相对时间，默认使用系统时间'),
    max_retry: zod_1.z.number().optional().default(3).describe('最大重试次数，默认3次'),
});
/**
 * 提取用户ID和Token
 */
function extractUserInfo(ctx) {
    let userId;
    let token;
    // 方法1: 直接从 ctx 获取（Agent 传递的）
    if (ctx?.userId && ctx?.userToken) {
        userId = ctx.userId;
        token = ctx.userToken;
        console.log(`[create_schedule] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[create_schedule] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[create_schedule] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 获取用户已有的任务列表（从主后端 API）
 */
async function getAvailableTasks(userToken) {
    try {
        if (!userToken) {
            console.warn('[获取任务列表] 缺少用户 token，跳过获取');
            return [];
        }
        // 导入主后端 API 客户端
        const { createMainAPIClient, getFlattenedTasks } = await Promise.resolve().then(() => __importStar(require('./main-api-client')));
        // 创建客户端并获取任务
        const mainAPIClient = createMainAPIClient(userToken);
        const tasks = await getFlattenedTasks(mainAPIClient);
        // 转换为原来的格式（保持兼容性）
        return tasks.map(t => ({
            id: t.id,
            name: t.name,
            project: t.project_name,
            category: t.category,
        }));
    }
    catch (error) {
        console.error('[获取任务列表失败]:', error);
        return [];
    }
}
/**
 * 调用 GLM 解析自然语言（单次调用）
 */
async function callGLMOnce(systemPrompt, userInput, glmClient) {
    const response = await glmClient.completeStream({
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userInput
            }
        ],
        temperature: 0.7,
        max_tokens: 1000,
    });
    // 智能提取 JSON
    let jsonStr = response.trim();
    // 方法1：提取 markdown 代码块中的内容
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
    }
    else {
        // 方法2：查找第一个 { 到最后一个 } 之间的内容
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }
    }
    // 解析 JSON
    const parsed = JSON.parse(jsonStr);
    return parsed;
}
/**
 * 调用 GLM 解析并验证（带自动重试）
 */
async function parseWithGLMAndValidate(userInput, systemPrompt, availableTaskNames, maxRetry, glmClient) {
    console.log('[解析] 调用 GLM-4.5-air 模型解析用户输入...');
    console.log(`[解析] 用户输入: "${userInput}"\n`);
    let lastError;
    // 重试循环
    for (let attempt = 1; attempt <= maxRetry; attempt++) {
        try {
            console.log(`[解析] 尝试 ${attempt}/${maxRetry}`);
            // 第一次使用原始 prompt，后续使用包含错误信息的 prompt
            let currentSystemPrompt = systemPrompt;
            if (attempt > 1 && lastError) {
                currentSystemPrompt = systemPrompt + '\n\n' + lastError;
                console.log('[解析] 添加错误反馈到 prompt');
            }
            // 调用 GLM
            const parsed = await callGLMOnce(currentSystemPrompt, userInput, glmClient);
            console.log('[解析] JSON 解析成功');
            console.log(JSON.stringify(parsed, null, 2));
            console.log('\n');
            // 验证数据
            console.log('[验证] 验证任务名和格式...\n');
            const validation = (0, validator_1.validateScheduleData)(parsed, availableTaskNames);
            if (validation.valid) {
                console.log('✅ 验证通过！\n');
                return validation.data;
            }
            else {
                console.log('❌ 验证失败\n');
                console.log(validation.errorMessage);
                console.log('\n');
                lastError = validation.errorMessage;
                if (attempt < maxRetry) {
                    console.log(`⚠️  将在下一次尝试中包含错误信息\n`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
                }
            }
        }
        catch (error) {
            console.error(`[解析] 尝试 ${attempt} 失败:`, error.message);
            if (attempt < maxRetry) {
                console.log('⚠️  将重试...\n');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else {
                throw new Error(`GLM 解析失败（${maxRetry} 次尝试后）: ${error.message}`);
            }
        }
    }
    // 所有尝试都失败
    throw new Error(`验证失败（${maxRetry} 次尝试后）\n最后的错误:\n${lastError}`);
}
/**
 * 创建日程工具 - 从自然语言创建日程记录
 *
 * 使用 tool 方法定义，将用户关于日程的自然语言描述解析为时间槽格式，
 * 包括任务、心情、随想等信息，并最终创建到日程系统中。
 */
exports.createScheduleTool = (0, tool_1.tool)({
    name: 'create_schedule',
    description: `从用户的自然语言描述创建日程记录，支持记录任务、心情、随想。

这个工具能够理解口语化的时间表达，并将其转换为结构化的日程记录。

支持的自然语言示例：
- "我三点睡到早上八点就起来了，因为奶奶把我叫醒了，心情不错"
- "今天上午九点到十二点都在开会，感觉很累"
- "明天下午两点有个会议，大概一小时，有点紧张"
- "本来计划写代码，结果一整天都在开会，好烦"

功能特点：
- ✅ 智能解析时间表达（支持相对时间、时间段）
- ✅ 自动匹配系统中的任务
- ✅ 智能创建缺失的子任务（NEW! 如果任务不存在会自动创建）
- ✅ 自动重试失败的日程（NEW! 创建子任务后自动重试）
- ✅ 记录心情和随想
- ✅ 区分计划和实际
- ✅ 自动验证和重试

智能子任务处理：
- 🤖 检测到未匹配的任务时，自动尝试创建新的子任务
- 🤖 自动推断项目名称（例如："工作-写代码" → 项目"工作"，子任务"工作-写代码"）
- 🤖 创建子任务成功后，自动重试创建之前失败的日程
- 🤖 返回详细的创建摘要，包含初次创建、子任务创建、重试创建的统计信息

输出格式（exam.json）：
{
  "YYYY-MM-DD": [
    {
      "time_slot": "HH:MM" 或 "HH:MM-HH:MM",
      "actual_task": "任务名",
      "actual_notes": "详细备注/随想",
      "planned_task": "计划任务名（可选）",
      "planned_notes": "计划备注（可选）",
      "mood": "心情（可选）"
    }
  ]
}`,
    parameters: createScheduleSchema,
    async execute(args, ctx) {
        try {
            console.log('\n' + '='.repeat(70));
            console.log('📅 创建日程 - 从自然语言生成时间槽记录');
            console.log('='.repeat(70) + '\n');
            const { user_input, current_date, max_retry = 3 } = args;
            // 🔥 提取用户信息
            const { userId, token: userToken } = extractUserInfo(ctx);
            if (!userId) {
                console.error('[create_schedule] ❌ 无法确定用户ID');
                throw new Error('无法确定用户ID，请确保已登录');
            }
            if (!userToken) {
                console.error('[create_schedule] ❌ 未找到用户Token');
                throw new Error(`未找到用户 ${userId} 的认证Token`);
            }
            console.log(`[create_schedule] ✅ 使用用户 ${userId} 的Token\n`);
            // Step 1: 获取任务列表（从主后端 API）
            console.log('[Step 1] 从主后端获取用户的任务列表...');
            const tasks = await getAvailableTasks(userToken);
            console.log(`✓ 获取到 ${tasks.length} 个任务\n`);
            if (tasks.length === 0) {
                console.log('⚠️  警告：未获取到任务列表，将使用用户描述的任务名\n');
            }
            // Step 2: 构建系统提示词
            console.log('[Step 2] 构建系统提示词...');
            const { systemPrompt, availableTaskNames } = (0, prompt_1.buildSystemPrompt)(tasks, current_date);
            console.log(`✓ 系统提示词已准备（包含 ${availableTaskNames.length} 个可用任务）\n`);
            // Step 3: 创建 GLM 客户端（使用统一配置）
            const glmClient = new glm_client_1.GLMClient({
                apiKey: config_1.GLM_CONFIG.API_KEY,
                baseURL: config_1.GLM_CONFIG.BASE_URL,
                model: config_1.GLM_CONFIG.MODEL
            });
            // Step 4: 调用 GLM 解析并验证（带自动重试）
            console.log('[Step 3] 调用 GLM 解析并验证（带自动重试）...\n');
            const validatedData = await parseWithGLMAndValidate(user_input, systemPrompt, availableTaskNames, max_retry, glmClient);
            console.log('\n' + '='.repeat(70));
            console.log('✅ 日程数据解析成功！');
            console.log('='.repeat(70) + '\n');
            // Step 5: 转换格式并保存到数据库
            console.log('[Step 4] 转换为主后端 API 格式并保存到数据库...\n');
            // 🔥 使用主后端 API 客户端（不再使用 MCP）
            // userToken 已在前面获取（第 227 行）
            // 导入转换函数
            const { examToMainAPI, printConversionSummary } = await Promise.resolve().then(() => __importStar(require('./format-converter-main-api')));
            const { createMainAPIClient } = await Promise.resolve().then(() => __importStar(require('./main-api-client')));
            // 创建主后端 API 客户端
            const mainAPIClient = createMainAPIClient(userToken);
            // 转换格式
            const conversionResult = await examToMainAPI(validatedData, {
                slot_interval: 30,
                fuzzyMatch: true,
                userToken,
            });
            printConversionSummary(conversionResult);
            if (!conversionResult.ok || !conversionResult.data) {
                return {
                    ok: false,
                    error: conversionResult.error || '格式转换失败',
                };
            }
            // 调用主后端 API 保存数据
            console.log('[Step 5] 正在保存 ' + conversionResult.data.time_slots.length + ' 个时间槽到数据库...\n');
            const saveResult = await mainAPIClient.batchCreateTimeSlots(conversionResult.data);
            console.log('\n' + '='.repeat(70));
            console.log('✅ 日程记录创建成功！已保存到数据库');
            console.log('='.repeat(70) + '\n');
            // 🔥 收集所有涉及的日期（用于触发前端刷新）
            const affectedDates = new Set();
            conversionResult.data.time_slots.forEach(slot => {
                if (slot.date) {
                    affectedDates.add(slot.date);
                }
            });
            // 🔥 处理未匹配的子任务
            let subtaskCreationResult;
            let retryResult;
            let finalMessage;
            let totalCreatedCount = conversionResult.data.time_slots.length;
            if (conversionResult.unmatchedTasks && conversionResult.unmatchedTasks.length > 0) {
                console.log('\n⚠️  发现未匹配的子任务，尝试自动创建...\n');
                // 导入处理器
                const { createMissingSubtasks, generateUserPrompt } = await Promise.resolve().then(() => __importStar(require('./subtask-handler')));
                const { createRetryContext, retryFailedSchedules, generateRetryMessage } = await Promise.resolve().then(() => __importStar(require('./retry-handler')));
                // 🔥 尝试自动创建缺失的子任务（使用主后端 API）
                subtaskCreationResult = await createMissingSubtasks(conversionResult.unmatchedTasks, mainAPIClient);
                // 如果成功创建了子任务，自动重试创建日程
                if (subtaskCreationResult.successCount > 0) {
                    console.log('\n✅ 子任务创建成功，自动重试创建日程...\n');
                    // 创建重试上下文
                    const retryContext = createRetryContext(validatedData, conversionResult.unmatchedTasks.map(t => ({ task_name: t.task_name, type: t.type })), subtaskCreationResult.success);
                    // 执行重试（使用主后端 API）
                    retryResult = await retryFailedSchedules(retryContext, mainAPIClient, userToken);
                    if (retryResult.ok && retryResult.successCount > 0) {
                        totalCreatedCount += retryResult.successCount;
                        finalMessage = `✅ 日程创建完成！\n\n` +
                            `📊 创建摘要:\n` +
                            `  • 初次创建: ${conversionResult.data.time_slots.length} 个时间槽\n` +
                            `  • 自动创建子任务: ${subtaskCreationResult.successCount} 个\n` +
                            `  • 重试创建日程: ${retryResult.successCount} 个\n` +
                            `  • 总计创建: ${totalCreatedCount} 个时间槽\n\n` +
                            (subtaskCreationResult.failedCount > 0
                                ? `⚠️ ${subtaskCreationResult.failedCount} 个子任务创建失败，对应的日程未能创建。`
                                : `🎉 所有日程都已成功创建！`);
                    }
                    else {
                        finalMessage = `⚠️ 日程部分创建成功\n\n` +
                            `📊 创建摘要:\n` +
                            `  • 初次创建: ${conversionResult.data.time_slots.length} 个时间槽\n` +
                            `  • 自动创建子任务: ${subtaskCreationResult.successCount} 个\n` +
                            `  • 重试失败: ${retryResult.error || '未知原因'}\n\n` +
                            generateUserPrompt(subtaskCreationResult);
                    }
                }
                else {
                    // 没有成功创建子任务
                    finalMessage = `⚠️ 日程部分创建成功\n\n` +
                        `📊 创建摘要:\n` +
                        `  • 已创建: ${conversionResult.data.time_slots.length} 个时间槽\n` +
                        `  • 子任务创建失败: ${subtaskCreationResult.failedCount} 个\n\n` +
                        generateUserPrompt(subtaskCreationResult);
                }
            }
            else {
                // 没有未匹配的任务，一切正常
                finalMessage = `✅ 日程记录创建成功 - 已保存 ${conversionResult.data.time_slots.length} 个时间槽到数据库`;
            }
            // 🔥 在消息末尾添加刷新指令（不显示给用户，仅供前端解析）
            // 格式：<!--REFRESH_CACHE:date1,date2,date3-->
            const refreshInstruction = Array.from(affectedDates).length > 0
                ? `\n\n<!--REFRESH_CACHE:${Array.from(affectedDates).join(',')}-->`
                : '';
            finalMessage += refreshInstruction;
            // 返回结构化数据
            return {
                ok: true,
                data: validatedData,
                format: 'exam.json',
                tasks_count: tasks.length,
                available_tasks: availableTaskNames,
                created_count: totalCreatedCount, // 🔥 更新为总创建数
                initial_created: conversionResult.data.time_slots.length, // 🔥 初次创建数
                retry_created: retryResult?.successCount || 0, // 🔥 重试创建数
                save_result: saveResult,
                unmatchedTasks: conversionResult.unmatchedTasks,
                warnings: conversionResult.warnings,
                subtaskCreation: subtaskCreationResult, // 🔥 子任务创建结果
                retryResult, // 🔥 重试结果
                message: finalMessage,
            };
        }
        catch (error) {
            console.error('\n' + '='.repeat(70));
            console.error('❌ 日程创建失败:', error.message);
            console.error('='.repeat(70) + '\n');
            return {
                ok: false,
                error: error.message || String(error),
            };
        }
    },
    metadata: {
        version: '1.0.0',
        tags: ['schedule', 'create', 'natural-language', 'time-slot', 'mood', 'diary'],
        readonly: false,
        timeout: 30000, // 30秒超时
    },
});
// 附加提示词（用于 AI Agent）
exports.createScheduleTool.prompt = `
# 创建日程工具

此工具用于从用户的自然语言描述创建日程记录，包括任务、时间槽、心情和随想。

## 使用场景

当用户说：
- "帮我记录今天的活动"
- "我三点睡到八点，心情不错"
- "今天上午九点到十二点都在开会，感觉很累"
- "记录一下：本来计划写代码，结果一整天都在开会"

使用此工具创建日程记录，支持：
- 📅 智能解析时间和日期
- 📝 记录任务和备注
- 😊 记录心情
- 💭 记录随想和感受
- 📊 区分计划和实际
- 🤖 **智能创建缺失的子任务**（NEW!）
- 🔄 **自动重试失败的日程**（NEW!）

## 调用示例

\`\`\`json
{
  "user_input": "我三点睡到早上八点就起来了，因为奶奶把我叫醒了，心情还不错"
}
\`\`\`

## 输出示例

### 成功案例（所有任务都匹配）
\`\`\`json
{
  "ok": true,
  "data": {...},
  "created_count": 10,
  "message": "✅ 日程记录创建成功 - 已保存 10 个日程到数据库"
}
\`\`\`

### 智能处理案例（自动创建子任务并重试）
\`\`\`json
{
  "ok": true,
  "data": {...},
  "created_count": 15,
  "initial_created": 10,
  "retry_created": 5,
  "subtaskCreation": {
    "successCount": 3,
    "failedCount": 0
  },
  "message": "✅ 日程创建完成！\n\n📊 创建摘要:\n  • 初次创建: 10 个日程\n  • 自动创建子任务: 3 个\n  • 重试创建日程: 5 个\n  • 总计创建: 15 个日程\n\n🎉 所有日程都已成功创建！"
}
\`\`\`

## 功能特点

1. 📅 **智能时间解析** - 理解"今天"、"明天"、"上午"等相对时间
2. 📝 **任务匹配** - 自动匹配系统中已有的任务
3. 🤖 **智能子任务创建** - 检测到未匹配任务时自动创建（NEW!）
4. 🔄 **自动重试** - 创建子任务后自动重试失败的日程（NEW!）
5. 😊 **心情记录** - 识别和记录用户的心情状态
6. 💭 **随想记录** - 保存用户的感受和想法
7. ✅ **数据验证** - 确保生成的数据格式正确

## 智能处理流程

1. 解析用户自然语言 → exam.json 格式
2. 匹配系统中的子任务
3. 如果有未匹配的子任务：
   a. 自动推断项目名称
   b. 调用 create_subtask 工具创建新子任务
   c. 创建成功后，自动重试创建之前失败的日程
4. 返回详细的创建摘要
`;
var validator_2 = require("./validator");
Object.defineProperty(exports, "validateScheduleData", { enumerable: true, get: function () { return validator_2.validateScheduleData; } });
var prompt_2 = require("./prompt");
Object.defineProperty(exports, "buildSystemPrompt", { enumerable: true, get: function () { return prompt_2.buildSystemPrompt; } });
Object.defineProperty(exports, "buildRetryPrompt", { enumerable: true, get: function () { return prompt_2.buildRetryPrompt; } });
var format_converter_main_api_1 = require("./format-converter-main-api");
Object.defineProperty(exports, "examToMainAPI", { enumerable: true, get: function () { return format_converter_main_api_1.examToMainAPI; } });
Object.defineProperty(exports, "printConversionSummary", { enumerable: true, get: function () { return format_converter_main_api_1.printConversionSummary; } });
var natural_language_tool_1 = require("./natural-language-tool");
Object.defineProperty(exports, "processAIParsedSchedule", { enumerable: true, get: function () { return natural_language_tool_1.processAIParsedSchedule; } });
// 导出工具实例
exports.naturalLanguageToStructuredTool = exports.createScheduleTool; // 向后兼容的别名
