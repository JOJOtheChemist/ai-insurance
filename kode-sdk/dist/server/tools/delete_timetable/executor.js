"use strict";
/**
 * Delete timetable tool execution logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDeleteTimetable = executeDeleteTimetable;
const converter_1 = require("./converter");
const token_store_1 = require("../../utils/token-store");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
/**
 * 提取用户ID和Token
 */
function extractUserInfo(ctx) {
    let userId;
    let token;
    // 方法1: 直接从 ctx 获取（Agent 传递的，优先使用）
    if (ctx?.userId && ctx?.userToken) {
        userId = ctx.userId;
        token = ctx.userToken;
        console.log(`[delete_timetable] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[delete_timetable] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[delete_timetable] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 从主后端 API 获取指定日期的所有时间段记录
 */
async function getScheduleRecords(token, userId, dates) {
    const allRecords = [];
    try {
        // 对每个日期发起查询
        for (const date of dates) {
            const url = (0, config_1.getApiUrl)(`/api/v1/schedule/time-slots?user_id=${userId}&date=${date}`);
            console.log(`[delete_timetable] 查询日期 ${date} 的记录: ${url}`);
            const response = await axios_1.default.get(url, {
                headers: (0, config_1.getRequestHeaders)(token),
            });
            const records = response.data.time_slots || response.data || [];
            console.log(`[delete_timetable] 日期 ${date} 找到 ${records.length} 条记录`);
            allRecords.push(...records);
        }
        console.log(`[delete_timetable] 总共获取到 ${allRecords.length} 条时间段记录`);
        return allRecords;
    }
    catch (error) {
        console.error('[delete_timetable] 获取时间段记录失败:', error.message);
        throw new Error(`获取时间段记录失败: ${error.message}`);
    }
}
/**
 * 调用后端批量删除API
 */
async function batchDeleteTimeSlots(token, userId, slotIds) {
    try {
        const url = (0, config_1.getApiUrl)(`/api/v1/schedule/time-slots/batch-delete?user_id=${userId}`);
        console.log(`[delete_timetable] 调用批量删除API: ${url}`);
        console.log(`[delete_timetable] 删除ID列表: [${slotIds.join(', ')}]`);
        // 发送纯数组格式，不包装在对象中
        const response = await axios_1.default.post(url, slotIds, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        console.log('[delete_timetable] 批量删除成功:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('[delete_timetable] 批量删除失败:', error.message);
        // 提取详细错误信息
        if (error.response?.data) {
            const errorDetail = error.response.data.detail || error.response.data.message || error.message;
            throw new Error(`批量删除失败: ${errorDetail}`);
        }
        throw new Error(`批量删除失败: ${error.message}`);
    }
}
/**
 * 执行删除时间表操作
 */
async function executeDeleteTimetable(args, ctx) {
    console.log('[delete_timetable] ========== 开始执行删除时间表 ==========');
    try {
        // 1. 提取用户信息
        const { userId, token: userToken } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[delete_timetable] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!userToken) {
            console.error('[delete_timetable] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[delete_timetable] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token解析数字userId
        const numericUserId = (0, config_1.parseUserIdFromToken)(userToken);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 转换AI格式为时间块范围
        const blockRanges = (0, converter_1.convertAIToBlockRanges)(args.schedule);
        if (blockRanges.length === 0) {
            return {
                ok: false,
                error: '没有找到有效的时间段'
            };
        }
        // 4. 提取需要查询的日期列表
        const dates = (0, converter_1.extractUniqueDates)(blockRanges);
        console.log(`[delete_timetable] 需要查询的日期: [${dates.join(', ')}]`);
        // 5. 查询这些日期的所有时间段记录
        const records = await getScheduleRecords(userToken, numericUserId, dates);
        if (records.length === 0) {
            return {
                ok: true,
                data: {
                    deleted_count: 0,
                    requested_count: 0,
                    deleted_ids: [],
                    message: '指定时间段内没有找到任何记录'
                }
            };
        }
        // 6. 根据时间块范围过滤出要删除的记录ID
        const idsToDelete = (0, converter_1.filterRecordsByBlockRanges)(records, blockRanges);
        if (idsToDelete.length === 0) {
            return {
                ok: true,
                data: {
                    deleted_count: 0,
                    requested_count: 0,
                    deleted_ids: [],
                    message: '指定时间段内没有找到匹配的记录'
                }
            };
        }
        // 7. 调用批量删除API
        const deleteResult = await batchDeleteTimeSlots(userToken, numericUserId, idsToDelete);
        // 8. 解析返回结果
        const deletedCount = deleteResult.data?.deleted_count || deleteResult.deleted_count || 0;
        const deletedIds = deleteResult.data?.deleted_ids || deleteResult.deleted_ids || [];
        const message = deleteResult.message || deleteResult.data?.message || `成功删除 ${deletedCount} 个时间段`;
        console.log('[delete_timetable] ========== 删除完成 ==========');
        console.log(`[delete_timetable] 删除数量: ${deletedCount}/${idsToDelete.length}`);
        return {
            ok: true,
            data: {
                deleted_count: deletedCount,
                requested_count: idsToDelete.length,
                deleted_ids: deletedIds,
                message
            }
        };
    }
    catch (error) {
        console.error('[delete_timetable] ❌ 执行失败:', error.message);
        console.error('[delete_timetable] 错误堆栈:', error.stack);
        return {
            ok: false,
            error: error.message || '删除时间表失败'
        };
    }
}
