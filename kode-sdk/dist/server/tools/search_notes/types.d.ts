/**
 * 搜索备注工具类型定义
 */
export interface SearchNotesInput {
    /** 搜索关键词（必填） */
    query: string;
    /** 项目ID筛选（可选，匹配 planned_project_id 或 actual_project_id） */
    project_id?: number;
    /** 子任务ID筛选（可选，匹配 planned_subtask_id 或 actual_subtask_id） */
    subtask_id?: number;
    /** 心情筛选（可选）*/
    mood?: string;
    /** 开始日期 YYYY-MM-DD（可选） */
    start_date?: string;
    /** 结束日期 YYYY-MM-DD（可选） */
    end_date?: string;
    /** 返回结果数量（默认 20，最大 100） */
    limit?: number;
}
export interface SearchNoteResultItem {
    /** 时间槽 ID */
    id: number;
    /** 用户 ID */
    user_id: number;
    /** 日期 YYYY-MM-DD */
    date: string;
    /** 时间块（0-47） */
    time_block: number;
    /** 计划备注 */
    planned_note?: string;
    /** 实际备注 */
    actual_note?: string;
    /** 计划项目ID */
    planned_project_id?: number;
    /** 计划项目名称 */
    planned_project_name?: string;
    /** 实际项目ID */
    actual_project_id?: number;
    /** 实际项目名称 */
    actual_project_name?: string;
    /** 计划子任务ID */
    planned_subtask_id?: number;
    /** 计划子任务名称 */
    planned_subtask_name?: string;
    /** 实际子任务ID */
    actual_subtask_id?: number;
    /** 实际子任务名称 */
    actual_subtask_name?: string;
    /** 心情 */
    mood?: string;
    /** 相关度评分（0-1） */
    relevance_score: number;
}
export interface SearchNotesResult {
    /** 是否成功 */
    ok: boolean;
    /** 搜索关键词 */
    query?: string;
    /** 结果总数 */
    total?: number;
    /** 搜索结果列表 */
    results?: SearchNoteResultItem[];
    /** 应用的过滤条件 */
    filters?: {
        project_id?: number;
        subtask_id?: number;
        mood?: string;
        start_date?: string;
        end_date?: string;
    };
    /** 错误信息（失败时） */
    error?: string;
}
