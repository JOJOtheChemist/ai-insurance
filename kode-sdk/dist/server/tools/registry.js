"use strict";
/**
 * 工具注册表管理
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolRegistry = void 0;
const types_1 = require("./types");
/**
 * 分类显示名称映射
 */
const CATEGORY_DISPLAY_NAMES = {
    [types_1.ToolCategory.MATH]: '数学计算',
    [types_1.ToolCategory.FILE]: '文件操作',
    [types_1.ToolCategory.NETWORK]: '网络请求',
    [types_1.ToolCategory.DATABASE]: '数据库操作',
    [types_1.ToolCategory.UTILITY]: '实用工具',
    [types_1.ToolCategory.SCHEDULE]: '日程管理',
    [types_1.ToolCategory.PROJECT]: '项目管理',
    [types_1.ToolCategory.AI]: 'AI 工具',
};
/**
 * 分类描述映射
 */
const CATEGORY_DESCRIPTIONS = {
    [types_1.ToolCategory.MATH]: '数学运算和计算相关工具',
    [types_1.ToolCategory.FILE]: '文件读写、搜索、编辑等文件系统操作',
    [types_1.ToolCategory.NETWORK]: 'HTTP请求、API调用等网络操作',
    [types_1.ToolCategory.DATABASE]: '数据库查询、更新等数据操作',
    [types_1.ToolCategory.UTILITY]: '通用实用工具和辅助功能',
    [types_1.ToolCategory.SCHEDULE]: '日程安排、查询、更新等日程管理功能',
    [types_1.ToolCategory.PROJECT]: '项目和任务管理相关功能',
    [types_1.ToolCategory.AI]: 'AI智能分析和处理相关功能',
};
/**
 * 工具注册表类
 */
class ToolRegistry {
    constructor() {
        this.registry = new Map();
    }
    /**
     * 注册单个工具
     */
    register(registration) {
        if (this.registry.has(registration.metadata.name)) {
            console.warn(`⚠️  工具 ${registration.metadata.name} 已存在，将被覆盖`);
        }
        this.registry.set(registration.metadata.name, registration);
        console.log(`✓ 注册工具: ${registration.metadata.name} (${registration.metadata.category})`);
    }
    /**
     * 批量注册工具
     */
    registerMany(registrations) {
        registrations.forEach((reg) => this.register(reg));
    }
    /**
     * 获取工具定义
     */
    getTool(name) {
        return this.registry.get(name);
    }
    /**
     * 获取所有工具
     */
    getAllTools() {
        return Array.from(this.registry.values());
    }
    /**
     * 根据分类获取工具
     */
    getToolsByCategory(category) {
        return Array.from(this.registry.values()).filter((reg) => reg.metadata.category === category);
    }
    /**
     * 检查工具是否存在
     */
    hasTool(name) {
        return this.registry.has(name);
    }
    /**
     * 取消注册工具
     */
    unregister(name) {
        if (this.registry.has(name)) {
            this.registry.delete(name);
            console.log(`✓ 取消注册工具: ${name}`);
            return true;
        }
        return false;
    }
    /**
     * 清空注册表
     */
    clear() {
        this.registry.clear();
        console.log('✓ 已清空工具注册表');
    }
    /**
     * 获取注册统计信息
     */
    getStats() {
        const tools = this.getAllTools();
        const categoryMap = new Map();
        // 统计各分类工具数量
        tools.forEach((tool) => {
            const count = categoryMap.get(tool.metadata.category) || 0;
            categoryMap.set(tool.metadata.category, count + 1);
        });
        // 构建分类信息
        const categories = Array.from(categoryMap.entries()).map(([category, toolCount]) => ({
            category,
            displayName: CATEGORY_DISPLAY_NAMES[category],
            description: CATEGORY_DESCRIPTIONS[category],
            toolCount,
        }));
        return {
            totalTools: tools.length,
            categories,
            tools: tools.map((t) => t.metadata),
        };
    }
    /**
     * 打印注册表信息
     */
    printStats() {
        const stats = this.getStats();
        console.log('\n=== 工具注册表统计 ===');
        console.log(`总工具数: ${stats.totalTools}`);
        console.log('\n分类统计:');
        stats.categories.forEach((cat) => {
            console.log(`  ${cat.displayName} (${cat.category}): ${cat.toolCount} 个工具`);
        });
        console.log('\n工具列表:');
        stats.tools.forEach((tool) => {
            console.log(`  - ${tool.name} [${tool.category}]: ${tool.description}`);
        });
        console.log('====================\n');
    }
}
/**
 * 全局工具注册表实例
 */
exports.toolRegistry = new ToolRegistry();
