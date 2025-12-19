"use strict";
/**
 * Delete timetable tool definition
 * 批量删除时间表工具定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimetableTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 批量删除时间表工具定义
 * 根据日期和时间段批量删除时间表记录
 */
exports.deleteTimetableTool = (0, src_1.defineTool)({
    name: 'delete_timetable',
    description: prompt_1.DESCRIPTION,
    params: {
        schedule: {
            type: 'object',
            description: '要删除的时间表数据（日期作为key，时间槽数组作为value）',
            required: true,
        },
    },
    attributes: { readonly: false },
    async exec(args, ctx) {
        // 验证输入
        const validation = (0, validator_1.validateInput)(args);
        if (!validation.valid) {
            return { ok: false, error: validation.error };
        }
        // 执行删除操作
        return (0, executor_1.executeDeleteTimetable)(args, ctx);
    },
});
// 附加提示信息
exports.deleteTimetableTool.prompt = prompt_1.PROMPT;
