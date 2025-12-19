/**
 * AI时间表格式转换器
 *
 * 功能：将AI返回的forAI.json格式（纯文字任务名）转换为API需要的fromAPI.json格式（带ID）
 *
 * 流程：
 * 1. AI接收：当前时间 + 用户所有项目/子任务列表
 * 2. AI返回：forAI.json格式（纯文字任务名，支持时间段）
 * 3. 转换函数：将任务名匹配到ID，时间段拆分成time_block
 */
import { AIScheduleResponse, APIBatchRequest, UserProject } from './types';
/**
 * 将AI返回的格式转换为API需要的格式
 *
 * forAI.json格式（AI返回）：
 * {
 *   "2025-11-01": [
 *     {
 *       "time_slot": "09:00-17:00",
 *       "actual_task": "学习数据结构",
 *       "actual_notes": "看源码学习tools",
 *       "mood": "专注"
 *     }
 *   ]
 * }
 *
 * fromAPI.json格式（API需要）：
 * {
 *   "time_slots": [
 *     {
 *       "date": "2025-11-01",
 *       "time_block": 18,
 *       "actual_project_id": 52,
 *       "actual_subtask_id": 118,
 *       "actual_note": "看源码学习tools",
 *       "mood": "focused"
 *     }
 *   ]
 * }
 *
 * @param aiResponse AI返回的时间表（forAI.json格式）
 * @param userProjects 用户的所有项目列表（从API获取）
 * @returns API批量创建请求格式（fromAPI.json格式）
 */
export declare function convertAIToAPI(aiResponse: AIScheduleResponse, userProjects: UserProject[]): APIBatchRequest;
/**
 * 生成发送给AI的完整Prompt
 * @param userInput 用户输入的原始文本
 * @param currentTime 当前时间
 * @param userProjects 用户的所有项目列表
 * @returns 完整的Prompt
 */
export declare function generateAIPrompt(userInput: string, currentTime: Date, userProjects: UserProject[]): string;
