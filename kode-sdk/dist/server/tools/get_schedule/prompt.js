"use strict";
/**
 * Get schedule tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '获取指定日期的日程数据，返回当天的所有计划和实际执行情况';
exports.PROMPT = `使用此工具获取指定日期的完整日程数据。

参数说明:
- date: 日期，格式为 YYYY-MM-DD（例如：2024-09-14）

返回结果包含:
- ok: 操作是否成功
- data: 日程数据对象
  - date: 请求的日期
  - schedules: 日程记录数组
    - id: 日程ID
    - time_slot: 时间段
    - planned_subtask_id: 计划任务ID
    - planned_notes: 计划备注
    - actual_subtask_id: 实际完成任务ID
    - actual_notes: 实际完成备注
    - mood: 心情记录
  - summary: 当天日程统计信息
- error: 错误信息（如果失败）

使用示例:
- get_schedule({ date: '2024-09-14' }) // 获取9月14日的所有日程

注意事项:
- 日期格式必须是 YYYY-MM-DD
- 如果指定日期没有日程，将返回空数组
- 此工具为只读操作，不会修改任何数据`;
