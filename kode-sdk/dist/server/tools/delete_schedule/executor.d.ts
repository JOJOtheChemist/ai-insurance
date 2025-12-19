/**
 * Delete schedule tool execution logic
 * 批量删除时间段工具执行逻辑
 */
import { DeleteScheduleInput, DeleteScheduleResult } from './types';
/**
 * 执行批量删除时间段操作
 * 直接调用后端批量删除API
 */
export declare function executeDeleteSchedule(args: DeleteScheduleInput, ctx?: any): Promise<DeleteScheduleResult>;
