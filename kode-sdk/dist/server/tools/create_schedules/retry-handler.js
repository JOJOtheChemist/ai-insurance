"use strict";
/**
 * 重试处理器 - 处理日程创建重试逻辑
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
exports.createRetryContext = createRetryContext;
exports.retryFailedSchedules = retryFailedSchedules;
exports.generateRetryMessage = generateRetryMessage;
/**
 * 创建重试上下文
 */
function createRetryContext(originalData, unmatchedTasks, createdSubtasks) {
    // 收集未匹配的任务名
    const unmatchedTaskNames = new Set();
    for (const task of unmatchedTasks) {
        unmatchedTaskNames.add(task.task_name.toLowerCase().trim());
    }
    // 创建子任务映射
    const createdSubtasksMap = new Map();
    for (const subtask of createdSubtasks) {
        if (subtask.ok && subtask.subtaskId) {
            createdSubtasksMap.set(subtask.taskName.toLowerCase().trim(), subtask.subtaskId);
        }
    }
    return {
        originalData,
        unmatchedTaskNames,
        createdSubtasks: createdSubtasksMap,
    };
}
/**
 * 筛选需要重试的日程
 * - 只保留之前因缺少子任务而失败的日程
 * - 将新创建的子任务映射到日程中
 */
function filterSchedulesForRetry(context, tasks) {
    const retryData = {};
    for (const [date, items] of Object.entries(context.originalData)) {
        // 跳过说明字段
        if (date.startsWith('_') || date.startsWith('===')) {
            continue;
        }
        const retryItems = [];
        for (const item of items) {
            let shouldRetry = false;
            const newItem = { ...item };
            // 检查 planned_task 是否需要重试
            if (item.planned_task) {
                const taskKey = item.planned_task.toLowerCase().trim();
                // 如果这个任务之前未匹配，且现在已创建
                if (context.unmatchedTaskNames.has(taskKey)) {
                    if (context.createdSubtasks.has(taskKey)) {
                        shouldRetry = true;
                        // 不需要修改 task_name，converter 会自动匹配
                    }
                    else {
                        // 如果还是没有创建成功，跳过这个任务
                        newItem.planned_task = undefined;
                        newItem.planned_notes = undefined;
                    }
                }
            }
            // 检查 actual_task 是否需要重试
            if (item.actual_task) {
                const taskKey = item.actual_task.toLowerCase().trim();
                if (context.unmatchedTaskNames.has(taskKey)) {
                    if (context.createdSubtasks.has(taskKey)) {
                        shouldRetry = true;
                    }
                    else {
                        newItem.actual_task = undefined;
                        newItem.actual_notes = undefined;
                    }
                }
            }
            // 如果有任何任务需要重试，添加到重试列表
            if (shouldRetry && (newItem.planned_task || newItem.actual_task)) {
                retryItems.push(newItem);
            }
        }
        if (retryItems.length > 0) {
            retryData[date] = retryItems;
        }
    }
    return retryData;
}
/**
 * 执行重试逻辑
 */
async function retryFailedSchedules(context, mainAPIClient, userToken) {
    console.log('\n========== 🔄 日程创建重试 ==========');
    try {
        // 获取最新的任务列表（包含新创建的子任务）
        console.log('[Step 1] 从主后端获取最新任务列表（包含新创建的子任务）...');
        const { getFlattenedTasks } = await Promise.resolve().then(() => __importStar(require('./main-api-client')));
        const tasksData = await getFlattenedTasks(mainAPIClient);
        const tasks = tasksData.map(t => ({
            id: t.id,
            name: t.name,
        }));
        console.log(`✓ 获取到 ${tasks.length} 个任务\n`);
        // 筛选需要重试的日程
        console.log('[Step 2] 筛选需要重试的日程...');
        const retryData = filterSchedulesForRetry(context, tasks);
        // 计算日程数量
        let retriedCount = 0;
        for (const items of Object.values(retryData)) {
            retriedCount += items.length;
        }
        if (retriedCount === 0) {
            console.log('⚠️  没有需要重试的日程');
            console.log('=====================================\n');
            return {
                ok: true,
                retriedCount: 0,
                successCount: 0,
                skippedCount: 0,
            };
        }
        console.log(`✓ 找到 ${retriedCount} 个需要重试的日程\n`);
        // 转换格式（使用主后端 API 格式）
        console.log('[Step 3] 转换为主后端 API 格式...');
        const { examToMainAPI, printConversionSummary } = await Promise.resolve().then(() => __importStar(require('./format-converter-main-api')));
        const conversionResult = await examToMainAPI(retryData, {
            slot_interval: 30,
            fuzzyMatch: true,
            userToken,
            tasks: tasksData,
        });
        printConversionSummary(conversionResult);
        if (!conversionResult.ok || !conversionResult.data) {
            return {
                ok: false,
                retriedCount,
                successCount: 0,
                skippedCount: 0,
                error: conversionResult.error || '格式转换失败',
            };
        }
        // 保存到数据库（调用主后端 API）
        console.log('[Step 4] 保存到主后端数据库...');
        const saveResult = await mainAPIClient.batchCreateTimeSlots(conversionResult.data);
        const successCount = conversionResult.data.time_slots.length;
        console.log('\n========== 重试结果摘要 ==========');
        console.log(`✅ 成功重试: ${successCount}/${retriedCount} 个日程`);
        console.log('=====================================\n');
        return {
            ok: true,
            retriedCount,
            successCount,
            skippedCount: 0,
            saveResult,
        };
    }
    catch (error) {
        console.error('\n❌ 重试失败:', error.message);
        console.log('=====================================\n');
        return {
            ok: false,
            retriedCount: 0,
            successCount: 0,
            skippedCount: 0,
            error: error.message || String(error),
        };
    }
}
/**
 * 生成重试结果的友好消息
 */
function generateRetryMessage(result) {
    if (!result.ok) {
        return `❌ 重试失败: ${result.error}`;
    }
    if (result.retriedCount === 0) {
        return `ℹ️ 没有需要重试的日程（所有日程都已创建）`;
    }
    if (result.successCount === result.retriedCount) {
        return `✅ 重试成功！已创建 ${result.successCount} 个之前失败的日程`;
    }
    return `⚠️ 部分重试成功：${result.successCount}/${result.retriedCount} 个日程已创建`;
}
