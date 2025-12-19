"use strict";
/**
 * 搜索备注工具提示和描述
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = `搜索时间表备注的工具。支持按关键词搜索 planned_note 和 actual_note 字段，可按项目ID、子任务ID、心情、日期范围筛选。结果按相关度排序。`;
exports.PROMPT = `
## 工具名称
search_notes - 搜索时间表备注

## 功能说明
全文搜索用户时间表中的备注内容（planned_note 和 actual_note），支持多种筛选条件。

## 使用场景
1. **关键词搜索**：查找包含特定关键词的所有时间槽
   - 例如：搜索 "关老师" 查看所有与关老师相关的记录
   - 例如：搜索 "买香肠" 查看所有购物相关记录

2. **项目关联搜索**：在特定项目中搜索关键词
   - 例如：在游泳课项目中搜索 "关老师"
   - 例如：在工作项目中搜索会议记录

3. **心情分析**：查找特定心情下的记录
   - 例如：查找"开心"时的所有活动
   - 例如：查找"焦虑"时的记录

4. **时间范围搜索**：限定搜索的时间范围
   - 例如：搜索本月所有包含 "健身" 的记录
   - 例如：搜索上周的工作记录

5. **复盘分析**：回顾和分析历史活动
   - 例如：查看某个项目的所有相关记录
   - 例如：分析特定时期的工作模式

## 参数说明
- **query** (必填): 搜索关键词，1-100个字符
  - 同时搜索 planned_note 和 actual_note 字段
  - 支持中文关键词

- **project_id** (可选): 项目ID筛选
  - 匹配 planned_project_id 或 actual_project_id
  - 用于在特定项目中搜索

- **subtask_id** (可选): 子任务ID筛选
  - 匹配 planned_subtask_id 或 actual_subtask_id
  - 用于在特定子任务中搜索

- **mood** (可选): 心情筛选
  - 可选值: happy, focused, tired, stressed, excited, neutral, anxious, relaxed
  - 用于分析特定心情下的活动

- **start_date** (可选): 开始日期 (YYYY-MM-DD)
  - 限定搜索的起始日期

- **end_date** (可选): 结束日期 (YYYY-MM-DD)
  - 限定搜索的结束日期

- **limit** (可选): 返回结果数量 (默认 20, 最大 100)
  - 控制返回的记录数量

## 返回结果
返回符合条件的时间槽列表，每个结果包含：
- 基本信息：日期、时间块
- 备注内容：planned_note、actual_note
- 项目信息：planned_project_id/name、actual_project_id/name
- 子任务信息：planned_subtask_id/name、actual_subtask_id/name
- 心情：mood
- 相关度评分：relevance_score（用于排序）

## 使用示例

### 示例 1: 简单关键词搜索
\`\`\`typescript
{
  "query": "关老师"
}
\`\`\`
**场景**: 查找所有提到 "关老师" 的时间槽，无论是在计划还是实际记录中。

### 示例 2: 项目内搜索
\`\`\`typescript
{
  "query": "关老师",
  "project_id": 789
}
\`\`\`
**场景**: 在游泳课项目（ID: 789）中搜索与 "关老师" 相关的记录。

### 示例 3: 心情过滤搜索
\`\`\`typescript
{
  "query": "关老师",
  "mood": "happy"
}
\`\`\`
**场景**: 查找心情为"开心"时与 "关老师" 相关的所有记录。

### 示例 4: 时间范围搜索
\`\`\`typescript
{
  "query": "买香肠",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
\`\`\`
**场景**: 搜索 2024 年内所有包含 "买香肠" 的记录。

### 示例 5: 综合搜索
\`\`\`typescript
{
  "query": "关老师",
  "project_id": 789,
  "mood": "happy",
  "start_date": "2024-10-01",
  "end_date": "2024-10-31",
  "limit": 10
}
\`\`\`
**场景**: 在游泳课项目中，搜索 10 月份心情"开心"时与 "关老师" 相关的最多 10 条记录。

## 注意事项
1. **query 必填**：至少提供一个搜索关键词
2. **日期格式**：必须使用 YYYY-MM-DD 格式
3. **项目/子任务匹配**：同时匹配 planned 和 actual 字段
4. **备注搜索**：同时搜索 planned_note 和 actual_note
5. **排序规则**：按相关度评分排序，相关度相同时按日期和时间块倒序
6. **性能优化**：使用数据库索引（B-tree + GIN），响应快速（10-50ms）

## 常见用法
- 回顾项目：\`search_notes({ query: "会议", project_id: 123 })\`
- 心情分析：\`search_notes({ query: "运动", mood: "happy" })\`
- 时间统计：\`search_notes({ query: "学习", start_date: "2024-10-01", end_date: "2024-10-31" })\`
- 快速查找：\`search_notes({ query: "重要事项" })\`

## 技术实现
- 后端使用 PostgreSQL 全文搜索（tsvector + tsquery）
- B-tree 索引优化过滤条件（user_id、project_id、date）
- GIN 索引优化全文搜索（planned_note + actual_note）
- 预期响应时间：10-50ms（100 万行数据）
`;
