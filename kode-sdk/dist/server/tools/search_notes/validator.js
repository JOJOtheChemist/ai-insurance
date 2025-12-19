"use strict";
/**
 * 搜索工具参数验证
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
function validateInput(args) {
    // 验证关键词
    if (!args.query || typeof args.query !== 'string') {
        return { valid: false, error: 'query 参数必填且必须是字符串' };
    }
    const query = args.query.trim();
    if (query.length === 0) {
        return { valid: false, error: 'query 不能为空' };
    }
    if (query.length > 100) {
        return { valid: false, error: 'query 长度不能超过 100 个字符' };
    }
    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (args.start_date && !dateRegex.test(args.start_date)) {
        return { valid: false, error: 'start_date 格式错误，应为 YYYY-MM-DD' };
    }
    if (args.end_date && !dateRegex.test(args.end_date)) {
        return { valid: false, error: 'end_date 格式错误，应为 YYYY-MM-DD' };
    }
    // 验证日期范围
    if (args.start_date && args.end_date) {
        const startDate = new Date(args.start_date);
        const endDate = new Date(args.end_date);
        if (endDate < startDate) {
            return { valid: false, error: 'end_date 不能早于 start_date' };
        }
    }
    // 验证 limit
    if (args.limit !== undefined) {
        if (typeof args.limit !== 'number' || args.limit < 1 || args.limit > 100) {
            return { valid: false, error: 'limit 必须是 1-100 之间的整数' };
        }
    }
    // 验证项目ID
    if (args.project_id !== undefined) {
        if (typeof args.project_id !== 'number' || args.project_id < 1) {
            return { valid: false, error: 'project_id 必须是正整数' };
        }
    }
    // 验证子任务ID
    if (args.subtask_id !== undefined) {
        if (typeof args.subtask_id !== 'number' || args.subtask_id < 1) {
            return { valid: false, error: 'subtask_id 必须是正整数' };
        }
    }
    // 验证心情
    if (args.mood !== undefined) {
        const allowed_moods = ['happy', 'focused', 'tired', 'stressed', 'excited', 'neutral', 'anxious', 'relaxed'];
        if (typeof args.mood !== 'string' || !allowed_moods.includes(args.mood.toLowerCase())) {
            return { valid: false, error: `mood 必须是以下之一: ${allowed_moods.join(', ')}` };
        }
    }
    return { valid: true };
}
