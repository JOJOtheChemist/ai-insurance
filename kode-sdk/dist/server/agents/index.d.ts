/**
 * Agent 配置管理中心
 */
import { AgentConfig } from './types';
/**
 * 注册默认 Agent 配置
 */
export declare function registerDefaultAgentConfigs(): void;
/**
 * 注册单个 Agent 配置
 */
export declare function registerAgentConfig(config: AgentConfig): void;
/**
 * 获取 Agent 配置
 */
export declare function getAgentConfig(id: string): AgentConfig | undefined;
/**
 * 获取所有 Agent 配置
 */
export declare function getAllAgentConfigs(): AgentConfig[];
/**
 * 检查 Agent 配置是否存在
 */
export declare function hasAgentConfig(id: string): boolean;
export * from './types';
export { calculatorAgentConfig } from './calculator-agent';
export { scheduleAssistantConfig } from './schedule-assistant';
export { timetableAgentConfig } from './timetable-agent';
export { timetableV2AgentConfig } from './timetable-v2-agent';
export { careerGoalAgentConfig } from './career-goal-agent';
export { reviewAgentConfig } from './review-agent';
export { searchAgentConfig } from './search-agent';
export { insureRecommandV1AgentConfig } from './insure-recommand-v1';
export { insureRecommandV3AgentConfig } from './insure-recommand-v3';
export { insuranceSalesAssistantConfig } from './insurance-sales-assistant';
