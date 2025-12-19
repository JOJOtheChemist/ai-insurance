/**
 * Get projects tool execution logic
 *
 * 从主后端 API 获取项目列表，而不是通过 MCP
 */
import { GetProjectsInput, GetProjectsResult } from './types';
/**
 * 执行获取项目列表操作
 */
export declare function executeGetProjects(args: GetProjectsInput, ctx?: any): Promise<GetProjectsResult>;
