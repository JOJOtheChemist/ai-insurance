/**
 * Batch Edit Timetable Tool - Types
 *
 * 批量编辑时间表工具的类型定义
 */
export type TimetableOperation = 'create' | 'update' | 'delete';
/**
 * 时间槽数据结构
 */
export interface TimeSlotData {
    /** 时间槽ID（update/delete时需要） */
    id?: number;
    /** 日期 YYYY-MM-DD */
    date: string;
    /** 时间块 0-47 */
    time_block: number;
    /** 计划项目ID */
    planned_project_id?: number;
    /** 计划子任务ID */
    planned_subtask_id?: number;
    /** 计划备注 */
    planned_note?: string;
    /** 实际项目ID */
    actual_project_id?: number;
    /** 实际子任务ID */
    actual_subtask_id?: number;
    /** 实际备注 */
    actual_note?: string;
    /** 心情 */
    mood?: string;
}
/**
 * 批量编辑时间表输入参数
 */
export interface BatchEditTimetableInput {
    /** 编辑操作列表 */
    edits: Array<{
        /** 操作类型 */
        operation: TimetableOperation;
        /** 时间槽数据 */
        data: TimeSlotData;
    }>;
    /** 预览模式：只计算差异，不执行 */
    preview?: boolean;
    /** 批准的操作索引（用于预览后的执行） */
    approvedIndices?: number[];
}
/**
 * 操作结果
 */
export interface TimetableOperationResult {
    /** 操作索引 */
    index: number;
    /** 操作类型 */
    operation: TimetableOperation;
    /** 状态 */
    status: 'ok' | 'skipped' | 'error';
    /** 消息 */
    message?: string;
    /** 时间槽ID（创建/更新后） */
    timeSlotId?: number;
    /** 差异数据（预览模式） */
    diff?: any[];
    /** 统计信息 */
    stats?: {
        added: number;
        removed: number;
        unchanged: number;
        totalChanges: number;
    };
}
/**
 * 批量编辑时间表返回结果
 */
export interface BatchEditTimetableResult {
    /** 是否全部成功 */
    ok: boolean;
    /** 是否为预览模式 */
    preview?: boolean;
    /** 操作结果列表 */
    results: TimetableOperationResult[];
    /** 备份信息（执行模式） */
    backups?: Array<{
        operationIndex: number;
        timeSlotId: number;
        backupData: TimeSlotData;
    }>;
}
