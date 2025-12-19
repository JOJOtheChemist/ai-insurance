/**
 * 子任务验证器
 * 验证AI填写的子任务名称是否真的属于对应项目的子任务列表
 */
import { UserProject } from './types';
import { CreateTimetableInput } from './types';
/**
 * 验证子任务名称
 * @param args 创建时间表的输入参数
 * @param userProjects 用户的所有项目列表
 * @returns 验证结果
 */
export declare function validateSubtasks(args: CreateTimetableInput, userProjects: UserProject[]): {
    valid: true;
} | {
    valid: false;
    error: string;
};
