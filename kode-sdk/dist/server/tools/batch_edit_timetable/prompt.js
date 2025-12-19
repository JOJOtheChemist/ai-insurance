"use strict";
/**
 * Batch Edit Timetable Tool - Prompt
 *
 * 批量编辑时间表工具的提示词
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '批量编辑时间表（创建/更新/删除），支持预览、备份和差异计算';
exports.PROMPT = `批量编辑时间表工具，支持创建、更新、删除操作。

功能特性：
- 预览模式：计算差异但不执行
- 自动备份：执行前自动备份（update/delete操作）
- 差异计算：显示每个操作的变更
- 权限检查：验证用户权限
- 操作级别确认：可以单独批准/拒绝每个操作

使用方法：
1. 预览模式：设置 preview=true 查看变更但不执行
2. 查看差异：检查每个操作的 diff 和统计信息
3. 批准操作：使用 approvedIndices 指定要执行的操作
4. 执行：再次调用，设置 preview=false 和 approvedIndices

操作类型：
- create: 创建新的时间槽
- update: 更新现有时间槽（需要 id）
- delete: 删除时间槽（需要 id）

数据格式：
- date: 日期 YYYY-MM-DD
- time_block: 时间块 0-47（30分钟块）
- planned_project_id: 计划项目ID
- planned_subtask_id: 计划子任务ID
- planned_note: 计划备注
- actual_project_id: 实际项目ID
- actual_subtask_id: 实际子任务ID
- actual_note: 实际备注
- mood: 心情

安全特性：
- 所有操作都有权限检查
- update/delete 操作自动备份
- 预览模式允许在变更前审核
- 失败的操作会记录详细错误信息

注意事项：
- update 和 delete 操作必须提供 id
- 每个操作都会调用批量操作 API
- 预览模式不会实际修改数据
- 执行模式会根据 approvedIndices 只执行批准的操作`;
