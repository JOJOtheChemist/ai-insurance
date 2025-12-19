"use strict";
/**
 * Delete subtasks tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '删除项目或子任务（支持批量删除）';
exports.PROMPT = `使用此工具删除指定的项目或子任务。支持单个删除或批量删除。

参数说明:
- items: 要删除的项目列表（必需）
  - 类型: Array<{project_id: number, subtask_id: string}>
  - project_id: 项目ID（数字）
  - subtask_id: 子任务ID或"all"
    - "all": 删除整个项目（包含所有子任务）⚠️ 危险操作
    - "数字": 删除指定的子任务（如 "3", "5"）

返回结果包含:
- ok: 操作是否成功
- data: 删除结果对象
  - success: 删除操作是否成功
  - message: 操作消息
  - deleted_count: 成功删除的数量
  - failed_count: 失败的数量
  - results: 每一项的详细结果
    - project_id: 项目ID
    - subtask_id: 子任务ID
    - success: 是否成功
    - message: 结果消息
- error: 错误信息（如果失败）

使用示例:
1. 删除单个子任务:
   delete_subtasks({ 
     items: [{ project_id: 10, subtask_id: "20" }] 
   })

2. 批量删除多个子任务:
   delete_subtasks({ 
     items: [
       { project_id: 10, subtask_id: "20" },
       { project_id: 10, subtask_id: "21" },
       { project_id: 10, subtask_id: "22" }
     ] 
   })

3. 删除整个项目（危险）:
   delete_subtasks({ 
     items: [{ project_id: 1, subtask_id: "all" }] 
   })

4. 混合删除:
   delete_subtasks({ 
     items: [
       { project_id: 1, subtask_id: "all" },  // 删除整个项目1
       { project_id: 2, subtask_id: "5" },    // 删除项目2的子任务5
       { project_id: 2, subtask_id: "6" }     // 删除项目2的子任务6
     ] 
   })

注意事项:
- ⚠️ 此操作不可逆，删除后无法恢复
- subtask_id="all" 会删除整个项目及其所有子任务，请谨慎使用
- 只能删除属于当前用户的项目和子任务（用户隔离）
- 如果某项不存在或无权限，该项会标记为失败，但其他项仍会继续删除
- deleted_count 字段表示实际成功删除的数量

应用场景:
- 清理已完成的任务
- 删除不再需要的子任务
- 批量整理任务列表
- 移除错误创建的任务
- 删除废弃的项目

安全保护:
- 自动应用用户认证和授权
- 防止删除其他用户的任务
- 支持事务保证，确保数据一致性
- 明确要求传入 "all" 才能删除整个项目，避免误删`;
