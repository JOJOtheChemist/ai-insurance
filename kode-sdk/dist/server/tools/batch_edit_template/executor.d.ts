/**
 * Batch Edit Tool Template - Executor
 *
 * 批量编辑工具的执行逻辑模板
 */
import { BatchEditInput, BatchEditResult } from './types';
/**
 * 执行批量编辑操作
 */
export declare function executeBatchEdit<TData = any>(input: BatchEditInput, ctx?: any): Promise<BatchEditResult>;
