/**
 * 工具相关类型定义
 */

/**
 * 工具分类枚举
 */
export enum ToolCategory {
  /** 数学计算 */
  MATH = 'math',
  /** 文件操作 */
  FILE = 'file',
  /** 网络请求 */
  NETWORK = 'network',
  /** 数据库操作 */
  DATABASE = 'database',
  /** 实用工具 */
  UTILITY = 'utility',
  /** 日程管理 */
  SCHEDULE = 'schedule',
  /** 项目管理 */
  PROJECT = 'project',
  /** AI 工具 */
  AI = 'ai',
}

/**
 * 工具元数据
 */
export interface ToolMetadata {
  /** 工具名称 */
  name: string;
  /** 工具分类 */
  category: ToolCategory;
  /** 工具描述 */
  description: string;
  /** 工具版本 */
  version?: string;
  /** 工具作者 */
  author?: string;
  /** 工具标签 */
  tags?: string[];
}

/**
 * 工具注册信息
 */
export interface ToolRegistration {
  /** 元数据 */
  metadata: ToolMetadata;
  /** 工具实例 */
  tool: any;
}

/**
 * 工具分类信息
 */
export interface ToolCategoryInfo {
  /** 分类名称 */
  category: ToolCategory;
  /** 分类显示名称 */
  displayName: string;
  /** 分类描述 */
  description: string;
  /** 该分类下的工具数量 */
  toolCount: number;
}

/**
 * 工具注册统计
 */
export interface ToolRegistryStats {
  /** 总工具数 */
  totalTools: number;
  /** 各分类统计 */
  categories: ToolCategoryInfo[];
  /** 工具列表 */
  tools: ToolMetadata[];
}
