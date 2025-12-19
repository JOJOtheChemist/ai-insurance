"use strict";
/**
 * AI删除时间表格式转换器
 *
 * 功能：将AI返回的forAI.json格式（日期+时间段）转换为API需要的ID列表
 *
 * 流程：
 * 1. AI接收：自然语言删除请求（如"删除今天上午9点到12点的记录"）
 * 2. AI返回：forAI.json格式（日期+时间段）
 * 3. 转换函数：将时间段转换为time_block范围，查询获取ID列表
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAIToBlockRanges = convertAIToBlockRanges;
exports.filterRecordsByBlockRanges = filterRecordsByBlockRanges;
exports.blockToTime = blockToTime;
exports.extractUniqueDates = extractUniqueDates;
// ==================== 工具函数 ====================
/**
 * 将时间字符串转换为time_block编号
 * @param timeStr 时间字符串，格式："09:00" 或 "9:00"
 * @returns time_block编号 (0-47)
 */
function timeToBlock(timeStr) {
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    // 每个block是30分钟，计算公式：hour * 2 + (minute >= 30 ? 1 : 0)
    return hour * 2 + (minute >= 30 ? 1 : 0);
}
/**
 * 解析时间段，返回起始和结束block
 * @param timeSlot 时间段字符串："09:00-17:00" 或 "09:00"
 * @returns [startBlock, endBlock]
 */
function parseTimeSlot(timeSlot) {
    if (timeSlot.includes('-')) {
        // 时间段格式 "09:00-17:00"
        const [start, end] = timeSlot.split('-');
        return [timeToBlock(start.trim()), timeToBlock(end.trim())];
    }
    else {
        // 单点格式 "09:00"
        const block = timeToBlock(timeSlot.trim());
        return [block, block];
    }
}
// ==================== 主转换函数 ====================
/**
 * 将AI返回的删除格式转换为日期和时间块范围列表
 *
 * forAI.json格式（AI返回）：
 * {
 *   "2025-10-19": [
 *     { "time_slot": "09:00-12:00" },
 *     { "time_slot": "14:00" }
 *   ]
 * }
 *
 * 转换为：
 * [
 *   { date: "2025-10-19", startBlock: 18, endBlock: 23 },  // 09:00-12:00
 *   { date: "2025-10-19", startBlock: 28, endBlock: 28 }   // 14:00
 * ]
 *
 * @param aiResponse AI返回的删除时间表（forAI.json格式）
 * @returns 日期和时间块范围列表
 */
function convertAIToBlockRanges(aiResponse) {
    const blockRanges = [];
    console.log('[delete_converter] 开始转换AI格式到时间块范围');
    // 遍历每一天
    for (const [dateStr, aiSlots] of Object.entries(aiResponse)) {
        // 跳过以下划线或等号开头的字段（说明字段）
        if (dateStr.startsWith('_') || dateStr.startsWith('===')) {
            continue;
        }
        // 验证日期格式
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.warn(`[delete_converter] 跳过无效日期格式: ${dateStr}`);
            continue;
        }
        console.log(`[delete_converter] 处理日期 ${dateStr}，包含 ${aiSlots.length} 个时间槽`);
        // 遍历该日期的所有时间槽
        for (const aiSlot of aiSlots) {
            // 解析时间段
            const [startBlock, endBlock] = parseTimeSlot(aiSlot.time_slot);
            console.log(`[delete_converter] 时间段 "${aiSlot.time_slot}" 转换为 block ${startBlock}-${endBlock}`);
            blockRanges.push({
                date: dateStr,
                startBlock,
                endBlock,
            });
        }
    }
    console.log(`[delete_converter] 转换完成，生成 ${blockRanges.length} 个时间块范围`);
    return blockRanges;
}
/**
 * 根据时间块范围过滤时间段记录，提取要删除的ID列表
 *
 * @param records 从get_schedule API获取的所有时间段记录
 * @param blockRanges 目标时间块范围列表
 * @returns 要删除的ID列表
 */
function filterRecordsByBlockRanges(records, blockRanges) {
    const idsToDelete = new Set();
    console.log(`[delete_converter] 开始过滤记录，总记录数: ${records.length}，目标范围数: ${blockRanges.length}`);
    // 遍历所有记录
    for (const record of records) {
        // 检查该记录是否在任何一个目标范围内
        for (const range of blockRanges) {
            if (record.date === range.date &&
                record.time_block >= range.startBlock &&
                record.time_block <= range.endBlock) {
                idsToDelete.add(record.id);
                console.log(`[delete_converter] 匹配记录: ID=${record.id}, date=${record.date}, block=${record.time_block}`);
                break; // 找到匹配就跳出内层循环
            }
        }
    }
    const result = Array.from(idsToDelete);
    console.log(`[delete_converter] 过滤完成，找到 ${result.length} 个要删除的ID: [${result.join(', ')}]`);
    return result;
}
/**
 * 将时间块编号转换为可读的时间字符串（用于日志）
 * @param block time_block编号 (0-47)
 * @returns 时间字符串 "HH:MM"
 */
function blockToTime(block) {
    const hour = Math.floor(block / 2);
    const minute = (block % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
/**
 * 从记录列表中提取唯一的日期列表（用于查询）
 * @param blockRanges 时间块范围列表
 * @returns 唯一日期列表
 */
function extractUniqueDates(blockRanges) {
    const dates = new Set();
    for (const range of blockRanges) {
        dates.add(range.date);
    }
    return Array.from(dates);
}
