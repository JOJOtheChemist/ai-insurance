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
export { insureRecommandV3AgentConfig } from './insure-recommand-v3';
