"use strict";
/**
 * 前端刷新触发器
 * 用于在AI对话工具调用完成后，通知前端立即刷新缓存
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshInstruction = createRefreshInstruction;
exports.extractRefreshInstruction = extractRefreshInstruction;
exports.removeRefreshInstruction = removeRefreshInstruction;
/**
 * 触发前端刷新（通过在响应中添加特殊标记）
 *
 * 使用方式：在工具返回时，在消息中添加刷新指令
 * 前端解析消息时会检测到这个指令并立即刷新
 *
 * @param dates - 需要刷新的日期列表
 * @returns 刷新指令字符串
 */
function createRefreshInstruction(dates) {
    return `\n\n<!--REFRESH_CACHE:${dates.join(',')}-->`;
}
/**
 * 从消息中提取刷新指令
 *
 * @param message - AI响应消息
 * @returns 需要刷新的日期列表，如果没有刷新指令则返回空数组
 */
function extractRefreshInstruction(message) {
    const match = message.match(/<!--REFRESH_CACHE:([^>]+)-->/);
    if (!match)
        return [];
    return match[1].split(',').filter(date => date.trim());
}
/**
 * 移除消息中的刷新指令（用于显示给用户）
 *
 * @param message - AI响应消息
 * @returns 移除刷新指令后的消息
 */
function removeRefreshInstruction(message) {
    return message.replace(/<!--REFRESH_CACHE:[^>]+-->/g, '').trim();
}
/**
 * 使用示例：
 *
 * // 在工具返回时添加刷新指令
 * const message = `✅ 日程记录创建成功！已保存 10 个日程到数据库`;
 * const dates = ['2025-11-08', '2025-11-09'];
 * const messageWithInstruction = message + createRefreshInstruction(dates);
 *
 * // 前端解析时提取刷新指令
 * const datesToRefresh = extractRefreshInstruction(messageWithInstruction);
 * if (datesToRefresh.length > 0) {
 *   // 立即刷新这些日期的缓存
 *   datesToRefresh.forEach(date => {
 *     scheduleCacheManager.loadFromAPI(userId, date);
 *   });
 * }
 *
 * // 显示给用户时移除指令
 * const displayMessage = removeRefreshInstruction(messageWithInstruction);
 */
