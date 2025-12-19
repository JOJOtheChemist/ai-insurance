/**
 * Batch Edit Tool Template - Types
 *
 * 批量编辑工具的类型定义模板
 * 需要根据具体业务修改
 */
export type BatchOperation = 'create' | 'update' | 'delete';
/**
 * 编辑操作数据结构（需要根据业务修改）
 */
export interface EditData {
    /** 唯一标识 */
    id: string;
    /** 其他字段... */
    [key: string]: any;
}
/**
 * 批量编辑输入参数
 */
export interface BatchEditInput {
    /** 编辑操作列表 */
    edits: Array<{
        /** 文件路径或资源标识 */
        path: string;
        /** 操作类型 */
        operation: BatchOperation;
        /** 操作数据 */
        data: EditData;
    }>;
    /** 预览模式：只计算差异，不执行 */
    preview?: boolean;
    /** 批准的操作索引（用于预览后的执行） */
    approvedIndices?: number[];
}
/**
 * 操作结果
 */
export interface OperationResult {
    /** 操作索引 */
    index: number;
    /** 文件路径 */
    path: string;
    /** 操作类型 */
    operation: BatchOperation;
    /** 状态 */
    status: 'ok' | 'skipped' | 'error';
    /** 消息 */
    message?: string;
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
 * 批量编辑返回结果
 */
export interface BatchEditResult {
    /** 是否全部成功 */
    ok: boolean;
    /** 是否为预览模式 */
    preview?: boolean;
    /** 操作结果列表 */
    results: OperationResult[];
    /** 备份文件路径（执行模式） */
    backups?: Array<{
        path: string;
        backupPath: string;
    }>;
}
