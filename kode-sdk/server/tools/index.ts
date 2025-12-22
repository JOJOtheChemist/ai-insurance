/**
 * 工具注册中心
 * 
 * 此文件统一导出所有工具的注册信息，并提供工具管理功能
 */

import { toolRegistry } from './registry';

// ============================================================
// 工具导入 - 按分类组织
// ============================================================

// 文件搜索工具
import { fs_globToolRegistration } from './fs_glob/registration';
import { fs_readToolRegistration } from './fs_read/registration';
import { fs_grepToolRegistration } from './fs_grep/registration';

// 保险业务工具 (Insurance)
import { insuranceFilterToolRegistration } from './insurance_filter/registration';
import { insuranceSearchToolRegistration } from './insurance_search/registration';
import { insuranceInspectToolRegistration } from './insurance_inspect/registration';
import { updateClientIntelligenceToolRegistration } from './update_client_intelligence/registration';


// ============================================================
// 工具注册
// ============================================================

/**
 * 注册所有默认工具
 */
export function registerDefaultTools(): void {
  console.log('🔧 开始注册工具...\n');

  // 文件搜索工具
  toolRegistry.register(fs_globToolRegistration);
  toolRegistry.register(fs_readToolRegistration);
  toolRegistry.register(fs_grepToolRegistration);

  // 保险业务工具
  toolRegistry.register(insuranceFilterToolRegistration);
  toolRegistry.register(insuranceSearchToolRegistration);
  toolRegistry.register(insuranceInspectToolRegistration);
  toolRegistry.register(updateClientIntelligenceToolRegistration);

  console.log('\n✅ 工具注册完成!\n');

  // 打印统计信息
  toolRegistry.printStats();
}

// ============================================================
// 工具管理函数（代理到 toolRegistry）
// ============================================================

/**
 * 注册单个工具
 */
export const registerTool = toolRegistry.register.bind(toolRegistry);

/**
 * 批量注册工具
 */
export const registerTools = toolRegistry.registerMany.bind(toolRegistry);

/**
 * 获取工具定义
 */
export const getTool = toolRegistry.getTool.bind(toolRegistry);

/**
 * 获取所有工具
 */
export const getAllTools = toolRegistry.getAllTools.bind(toolRegistry);

/**
 * 根据分类获取工具
 */
export const getToolsByCategory = toolRegistry.getToolsByCategory.bind(toolRegistry);

/**
 * 检查工具是否存在
 */
export const hasTool = toolRegistry.hasTool.bind(toolRegistry);

/**
 * 取消注册工具
 */
export const unregisterTool = toolRegistry.unregister.bind(toolRegistry);

/**
 * 获取注册统计信息
 */
export const getToolStats = toolRegistry.getStats.bind(toolRegistry);

// ============================================================
// 类型和常量导出
// ============================================================

export * from './types';
export { toolRegistry } from './registry';

// ============================================================
// 工具定义导出（用于直接访问工具）
// ============================================================

// 文件搜索工具
export { fs_globTool } from './fs_glob';
export { fs_readTool } from './fs_read';
export { fs_grepTool } from './fs_grep';

// 保险业务工具
export { InsuranceFilter } from './insurance_filter';
export { InsuranceSearch } from './insurance_search';
export { InsuranceInspect } from './insurance_inspect';
export { UpdateClientIntelligence } from './update_client_intelligence';

// HTTP 客户端
export * from './http';
