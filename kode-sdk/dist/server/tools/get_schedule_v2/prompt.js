"use strict";
/**
 * Get schedule tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '使用 v2 合并接口获取指定日期的整天时间表，包含连续时间段（segments）、计划/实际信息以及统一备注详情。';
exports.PROMPT = `使用此工具获取指定日期的 **v2 合并时间表数据**。

参数说明:
- date: 日期，格式为 YYYY-MM-DD（例如：2024-09-14）

返回结果结构（GetScheduleResult）:
- ok: 操作是否成功
- data: 日程数据对象（仅在 ok=true 时存在）
  - date: 实际返回的日期字符串
  - segments: 合并后的时间段数组（每一项对应后端的 V2MergedSlotItem）
    - date: 段落所属日期（YYYY-MM-DD）
    - time_range: 人类可读的时间范围，例如 "09:00-10:30"
    - time_blocks: 覆盖的 time_block 列表（整数数组，0-47）
    - mood: 该时间段整体的心情（通常来自实际轨道）
    - planned_project_id / planned_subtask_id: 计划任务的项目/子任务 ID
    - planned_note_id: 计划备注 note_id（可用来在 notes 字典中查详情）
    - planned_note_content / planned_note_tags / planned_note_attachments: 计划备注的简要信息
    - actual_project_id / actual_subtask_id: 实际任务的项目/子任务 ID
    - actual_note_id: 实际备注 note_id
    - actual_note_content / actual_note_tags / actual_note_attachments: 实际备注的简要信息
  - notes: 备注详情字典（统一备注视图）
    - key: 备注 ID（字符串或数字）
    - value: 备注详情对象
      - id: 备注 ID
      - type: 'planned' 或 'actual'
      - content: 备注正文
      - tags: 标签数组
      - attachments: 附件对象（自由结构）
- error: 错误信息（仅在 ok=false 时存在）

使用建议（给大模型）:
- 如果你只关心时间轴，可以主要阅读 data.segments 中的 time_range + planned_*/actual_* 字段。
- 如果你需要完整备注内容（包括标签/附件），先从 segment 上拿到 planned_note_id / actual_note_id，再去 data.notes[note_id] 里取详情。
- segments 已经按照时间顺序合并连续且内容一致的 time_blocks，避免了逐 30 分钟处理的碎片化问题，更适合总结和推理。

使用示例:
- get_schedule_v2({ date: '2024-09-14' }) // 获取 9 月 14 日的 v2 合并时间表

注意事项:
- 日期格式必须是 YYYY-MM-DD
- 如果指定日期没有任何时间槽，data.segments 将是空数组，data.notes 可能为空字典
- 此工具为只读操作，不会修改任何数据`;
