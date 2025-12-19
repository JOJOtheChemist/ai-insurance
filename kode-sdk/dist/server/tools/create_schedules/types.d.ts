/**
 * 批量创建日程的类型定义
 */
export interface ScheduleInput {
    time_slot: string;
    planned_task?: string;
    planned_notes?: string;
    actual_task?: string;
    actual_notes?: string;
    mood?: string;
}
export interface BatchCreateInput {
    date: string;
    natural_language: string;
    slot_interval?: number;
}
export interface Task {
    id: number;
    name: string;
}
export type MatchMethod = 'exact' | 'algorithm' | 'llm' | 'failed';
export interface MatchResult {
    input: ScheduleInput;
    plannedTaskId: number | null;
    plannedTaskName?: string;
    actualTaskId: number | null;
    actualTaskName?: string;
    method: MatchMethod;
    confidence?: number;
}
export interface CreateResult {
    id: number;
    time_slot: string;
    matched_task?: string;
    match_method?: string;
}
export interface PendingItem {
    task_name: string;
    time_slot: string;
    reason: string;
}
export interface BatchCreateResult {
    ok: boolean;
    data?: {
        created: number;
        total: number;
        results: CreateResult[];
        pending?: PendingItem[];
        unmatchedTasks?: Array<{
            time_slot: string;
            task_name: string;
            notes: string;
            type: 'planned' | 'actual';
        }>;
        invalidTasks?: Array<{
            time_slot: string;
            invalid_task: string;
            type: 'planned' | 'actual';
        }>;
        suggestion?: string;
        summary: string;
    };
    error?: string;
}
