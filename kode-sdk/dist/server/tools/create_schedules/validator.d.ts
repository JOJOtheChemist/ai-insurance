/**
 * 数据验证层
 *
 * 负责：
 * - 使用 Zod 定义 GLM 输出的数据结构
 * - 验证任务名是否在可用列表中
 * - 生成详细的错误信息供大模型重试
 */
import { z } from 'zod';
/**
 * 单个时间槽的 Schema
 */
export declare const TimeSlotSchema: z.ZodObject<{
    time_slot: z.ZodString;
    planned_task: z.ZodOptional<z.ZodString>;
    planned_notes: z.ZodOptional<z.ZodString>;
    actual_task: z.ZodOptional<z.ZodString>;
    actual_notes: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    time_slot: string;
    planned_task?: string | undefined;
    planned_notes?: string | undefined;
    actual_task?: string | undefined;
    actual_notes?: string | undefined;
    mood?: string | undefined;
}, {
    time_slot: string;
    planned_task?: string | undefined;
    planned_notes?: string | undefined;
    actual_task?: string | undefined;
    actual_notes?: string | undefined;
    mood?: string | undefined;
}>;
/**
 * 完整的日程数据 Schema
 * 格式：{ "YYYY-MM-DD": [TimeSlot, TimeSlot, ...] }
 */
export declare const ScheduleDataSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    time_slot: z.ZodString;
    planned_task: z.ZodOptional<z.ZodString>;
    planned_notes: z.ZodOptional<z.ZodString>;
    actual_task: z.ZodOptional<z.ZodString>;
    actual_notes: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    time_slot: string;
    planned_task?: string | undefined;
    planned_notes?: string | undefined;
    actual_task?: string | undefined;
    actual_notes?: string | undefined;
    mood?: string | undefined;
}, {
    time_slot: string;
    planned_task?: string | undefined;
    planned_notes?: string | undefined;
    actual_task?: string | undefined;
    actual_notes?: string | undefined;
    mood?: string | undefined;
}>, "many">>;
export type TimeSlot = z.infer<typeof TimeSlotSchema>;
export type ScheduleData = z.infer<typeof ScheduleDataSchema>;
/**
 * 验证错误详情
 */
export interface ValidationError {
    date: string;
    time_slot: string;
    task: string;
    field: 'planned_task' | 'actual_task';
    reason: string;
}
/**
 * 验证结果
 */
export interface ValidationResult {
    /** 是否验证成功 */
    valid: boolean;
    /** 验证后的数据（如果成功） */
    data?: ScheduleData;
    /** 错误列表（如果失败） */
    errors?: ValidationError[];
    /** 格式化的错误信息（供大模型重试） */
    errorMessage?: string;
}
/**
 * 验证 GLM 输出的数据
 *
 * @param rawData - GLM 输出的原始数据
 * @param availableTaskNames - 可用的任务名列表
 * @returns 验证结果
 */
export declare function validateScheduleData(rawData: any, availableTaskNames: string[]): ValidationResult;
/**
 * 快速验证（只检查任务名，不使用 Zod）
 * 用于需要快速验证的场景
 */
export declare function quickValidateTaskNames(data: any, availableTaskNames: string[]): {
    valid: boolean;
    errors: ValidationError[];
};
