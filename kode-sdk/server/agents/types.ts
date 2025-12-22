/**
 * Agent 相关类型定义
 */

/**
 * Agent 配置
 */
export interface AgentConfig {
  id: string;
  templateId: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[];
  exposeThinking?: boolean;
  modelId?: string;
}

/**
 * Agent 状态
 */
export interface AgentState {
  id: string;
  isProcessing: boolean;
  messageCount: number;
  lastActivity?: Date;
}

