/**
 * Agent 配置管理中心
 */

import { AgentConfig } from './types';
import { insureRecommandV3AgentConfig } from './insure-recommand-v3';

/**
 * Agent 配置注册表
 */
const agentConfigRegistry = new Map<string, AgentConfig>();

/**
 * 注册默认 Agent 配置
 */
export function registerDefaultAgentConfigs(): void {
  registerAgentConfig(insureRecommandV3AgentConfig);
}

/**
 * 注册单个 Agent 配置
 */
export function registerAgentConfig(config: AgentConfig): void {
  if (agentConfigRegistry.has(config.id)) {
    console.warn(`⚠️  Agent 配置 ${config.id} 已存在，将被覆盖`);
  }

  agentConfigRegistry.set(config.id, config);
  console.log(`✓ 注册 Agent 配置: ${config.name} (${config.id})`);
}

/**
 * 获取 Agent 配置
 */
export function getAgentConfig(id: string): AgentConfig | undefined {
  return agentConfigRegistry.get(id);
}

/**
 * 获取所有 Agent 配置
 */
export function getAllAgentConfigs(): AgentConfig[] {
  return Array.from(agentConfigRegistry.values());
}

/**
 * 检查 Agent 配置是否存在
 */
export function hasAgentConfig(id: string): boolean {
  return agentConfigRegistry.has(id);
}

// 导出配置
export * from './types';
export { insureRecommandV3AgentConfig } from './insure-recommand-v3';
