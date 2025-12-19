"use strict";
/**
 * Get projects tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '从主后端获取所有项目、子任务的完整列表，包括工作、学习、生活、社交、运动、娱乐等分类';
exports.PROMPT = `使用此工具获取完整的项目和子任务列表。

⚙️ 数据来源:
- 直接从主后端 API 获取数据（/api/v1/tasks）
- 使用当前用户的 JWT Token 进行认证
- 自动过滤当前用户的项目和任务

📥 参数说明:
- 无需任何参数（自动使用当前用户的认证信息）

📤 返回结果包含:
- ok: 操作是否成功（true/false）
- data: 项目数据对象
  - projects: 项目列表数组
    - id: 项目ID
    - name: 项目名称
    - category: 项目分类（工作、学习、生活、社交、运动、娱乐等）
    - description: 项目描述（可选）
    - subtasks: 子任务列表
      - id: 子任务ID
      - name: 子任务名称
      - description: 子任务描述（可选）
      - status: 任务状态（已完成/进行中）
      - project_id: 所属项目ID
  - categories: 分类统计（可选）
    - [分类名]: { projectCount: 数量, subtaskCount: 数量 }
  - summary: 项目和任务统计信息（可选）
    - totalProjects: 总项目数
    - totalSubtasks: 总子任务数
    - categoriesCount: 分类数量
- error: 错误信息（如果失败）

💡 使用示例:
\`\`\`
get_projects()  // 获取当前用户的所有项目和子任务
\`\`\`

⚠️ 注意事项:
- 此工具为只读操作，不会修改任何数据
- 自动使用当前登录用户的认证信息
- 返回的数据包含完整的项目层级结构
- 可用于日程规划时查找可用的任务ID
- 如果用户未登录或Token无效，将返回错误

🎯 应用场景:
1. 创建日程前查看可用的子任务
2. 了解项目和任务的组织结构
3. 获取任务ID用于日程记录
4. 查看用户的项目分类统计
5. AI 规划任务时参考现有项目结构

🔐 认证说明:
- 工具会自动从上下文中提取用户ID
- 从 TokenStore 中获取用户的 JWT Token
- 使用 Token 向主后端 API 发起认证请求
- 只能访问当前用户自己的项目数据`;
