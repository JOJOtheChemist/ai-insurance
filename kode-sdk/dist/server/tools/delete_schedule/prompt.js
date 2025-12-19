"use strict";
/**
 * Delete schedule tool prompts and descriptions
 * 批量删除时间段工具提示和描述
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '批量删除时间段，支持一次删除多个时间段记录（直接调用后端API）';
exports.PROMPT = `使用此工具批量删除不需要的时间段记录。此工具直接调用后端批量删除API。

参数说明:
- slot_ids (必需): 要删除的时间段ID数组
  - 类型: number[]
  - 必须是有效的正整数数组
  - 至少需要包含一个ID
  - 示例: [123, 456, 789]
  - ⚠️ 注意：传入格式是 { slot_ids: [数字数组] }，工具会自动转换为后端期望的纯数组格式

返回结果:
- ok: 操作是否成功
- data (成功时):
  - deleted_count: 成功删除的数量
  - requested_count: 请求删除的数量
  - deleted_ids: 已删除的ID列表
  - message: 操作结果消息
- error (失败时): 错误信息

使用示例:

1. 删除单个时间段:
   delete_schedule({ slot_ids: [123] })

2. 批量删除多个时间段:
   delete_schedule({ slot_ids: [123, 456, 789] })

3. 删除今天所有时间段（需先用 list_schedule 获取ID）:
   // 第一步：获取今天的时间段列表
   const todaySchedules = list_schedule({ date: "2025-10-31" })
   // 第二步：提取所有ID并批量删除
   const ids = todaySchedules.map(s => s.id)
   delete_schedule({ slot_ids: ids })

推荐使用方式:
1. 在删除前，先使用 list_schedule 获取要删除的时间段信息
2. 确认ID正确后，调用此工具进行批量删除
3. 检查返回的 deleted_count 和 requested_count 是否一致

注意事项:
- ⚠️ 删除操作不可逆，请谨慎使用
- 必须提供有效的时间段ID，工具会验证所有ID的有效性
- 只能删除属于当前用户的时间段
- 如果某些ID不存在或不属于当前用户，这些ID会被跳过
- 建议删除前先用 list_schedule 确认时间段列表`;
