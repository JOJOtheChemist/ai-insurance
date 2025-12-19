"use strict";
/**
 * Create subtask tool validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
/**
 * 允许的项目分类（中文）
 */
const ALLOWED_CATEGORIES = ['学习', '生活', '工作', '娱乐'];
/**
 * 验证输入参数
 */
function validateInput(args) {
    // 验证 project（必填，可以是字符串或数字）
    if (args.project === undefined || args.project === null) {
        return { valid: false, error: 'project 是必填项' };
    }
    // 如果是字符串，不能为空
    if (typeof args.project === 'string' && args.project.trim() === '') {
        return { valid: false, error: 'project 不能为空字符串' };
    }
    // 如果是数字，必须是正整数
    if (typeof args.project === 'number' && args.project <= 0) {
        return { valid: false, error: 'project ID 必须是正整数' };
    }
    // 必须是字符串或数字
    if (typeof args.project !== 'string' && typeof args.project !== 'number') {
        return { valid: false, error: 'project 必须是字符串（项目名称）或数字（项目ID）' };
    }
    // 验证 category（必填，必须是四种之一）
    if (!args.category) {
        return { valid: false, error: 'category 是必填项，必须是以下之一：学习、生活、工作、娱乐' };
    }
    if (typeof args.category !== 'string') {
        return { valid: false, error: 'category 必须是字符串类型' };
    }
    const trimmedCategory = args.category.trim();
    if (!ALLOWED_CATEGORIES.includes(trimmedCategory)) {
        return {
            valid: false,
            error: `category 必须是以下之一：${ALLOWED_CATEGORIES.join('、')}。你提供的是："${args.category}"`
        };
    }
    // 验证 name（必填）
    if (!args.name) {
        return { valid: false, error: 'name 是必填项' };
    }
    if (typeof args.name !== 'string' || args.name.trim() === '') {
        return { valid: false, error: 'name 不能为空字符串' };
    }
    // 可选字段类型验证
    if (args.priority !== undefined && typeof args.priority !== 'string') {
        return { valid: false, error: 'priority 必须是字符串类型' };
    }
    if (args.urgency_importance !== undefined && typeof args.urgency_importance !== 'string') {
        return { valid: false, error: 'urgency_importance 必须是字符串类型' };
    }
    if (args.difficulty !== undefined && typeof args.difficulty !== 'string') {
        return { valid: false, error: 'difficulty 必须是字符串类型' };
    }
    if (args.color !== undefined && typeof args.color !== 'string') {
        return { valid: false, error: 'color 必须是字符串类型' };
    }
    return { valid: true };
}
