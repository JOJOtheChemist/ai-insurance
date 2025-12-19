/**
 * 工具注册表管理
 */
import { ToolRegistration, ToolCategory, ToolRegistryStats } from './types';
/**
 * 工具注册表类
 */
declare class ToolRegistry {
    private registry;
    /**
     * 注册单个工具
     */
    register(registration: ToolRegistration): void;
    /**
     * 批量注册工具
     */
    registerMany(registrations: ToolRegistration[]): void;
    /**
     * 获取工具定义
     */
    getTool(name: string): ToolRegistration | undefined;
    /**
     * 获取所有工具
     */
    getAllTools(): ToolRegistration[];
    /**
     * 根据分类获取工具
     */
    getToolsByCategory(category: ToolCategory): ToolRegistration[];
    /**
     * 检查工具是否存在
     */
    hasTool(name: string): boolean;
    /**
     * 取消注册工具
     */
    unregister(name: string): boolean;
    /**
     * 清空注册表
     */
    clear(): void;
    /**
     * 获取注册统计信息
     */
    getStats(): ToolRegistryStats;
    /**
     * 打印注册表信息
     */
    printStats(): void;
}
/**
 * 全局工具注册表实例
 */
export declare const toolRegistry: ToolRegistry;
export {};
