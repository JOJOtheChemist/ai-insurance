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
import { AIDeleteScheduleResponse, DateBlockRange, TimeSlotRecord } from './types';
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
export declare function convertAIToBlockRanges(aiResponse: AIDeleteScheduleResponse): DateBlockRange[];
/**
 * 根据时间块范围过滤时间段记录，提取要删除的ID列表
 *
 * @param records 从get_schedule API获取的所有时间段记录
 * @param blockRanges 目标时间块范围列表
 * @returns 要删除的ID列表
 */
export declare function filterRecordsByBlockRanges(records: TimeSlotRecord[], blockRanges: DateBlockRange[]): number[];
/**
 * 将时间块编号转换为可读的时间字符串（用于日志）
 * @param block time_block编号 (0-47)
 * @returns 时间字符串 "HH:MM"
 */
export declare function blockToTime(block: number): string;
/**
 * 从记录列表中提取唯一的日期列表（用于查询）
 * @param blockRanges 时间块范围列表
 * @returns 唯一日期列表
 */
export declare function extractUniqueDates(blockRanges: DateBlockRange[]): string[];
