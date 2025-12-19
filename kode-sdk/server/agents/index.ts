/**
 * Agent 配置管理中心
 */

import { AgentConfig } from './types';
import { calculatorAgentConfig } from './calculator-agent';
import { scheduleAssistantConfig } from './schedule-assistant';
import { timetableAgentConfig } from './timetable-agent';
import { timetableV2AgentConfig } from './timetable-v2-agent';
import { careerGoalAgentConfig } from './career-goal-agent';
import { reviewAgentConfig } from './review-agent';
import { searchAgentConfig } from './search-agent';
import { insureRecommandV1AgentConfig } from './insure-recommand-v1';
import { insureRecommandV3AgentConfig } from './insure-recommand-v3';


/**
 * Agent 配置注册表
 */
const agentConfigRegistry = new Map<string, AgentConfig>();

/**
 * 注册默认 Agent 配置
 */
export function registerDefaultAgentConfigs(): void {
  registerAgentConfig(calculatorAgentConfig);
  registerAgentConfig(scheduleAssistantConfig);
  registerAgentConfig(timetableAgentConfig);
  registerAgentConfig(timetableV2AgentConfig);
  registerAgentConfig(careerGoalAgentConfig);
  registerAgentConfig(reviewAgentConfig);
  registerAgentConfig(searchAgentConfig);
  registerAgentConfig(insureRecommandV1AgentConfig);
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
export { calculatorAgentConfig } from './calculator-agent';
export { scheduleAssistantConfig } from './schedule-assistant';
export { timetableAgentConfig } from './timetable-agent';
export { timetableV2AgentConfig } from './timetable-v2-agent';
export { careerGoalAgentConfig } from './career-goal-agent';
export { reviewAgentConfig } from './review-agent';
export { searchAgentConfig } from './search-agent';
export { insureRecommandV1AgentConfig } from './insure-recommand-v1';
export { insureRecommandV3AgentConfig } from './insure-recommand-v3';


