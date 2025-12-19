"use strict";
/**
 * 工具注册中心
 *
 * 此文件统一导出所有工具的注册信息，并提供工具管理功能
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceInspect = exports.InsuranceSearch = exports.InsuranceFilter = exports.fs_grepTool = exports.fs_readTool = exports.fs_globTool = exports.toolRegistry = exports.getToolStats = exports.unregisterTool = exports.hasTool = exports.getToolsByCategory = exports.getAllTools = exports.getTool = exports.registerTools = exports.registerTool = void 0;
exports.registerDefaultTools = registerDefaultTools;
const registry_1 = require("./registry");
// ============================================================
// 工具导入 - 按分类组织
// ============================================================
// 文件搜索工具
const registration_1 = require("./fs_glob/registration");
const registration_2 = require("./fs_read/registration");
const registration_3 = require("./fs_grep/registration");
// 保险业务工具 (Insurance)
const registration_4 = require("./insurance_filter/registration");
const registration_5 = require("./insurance_search/registration");
const registration_6 = require("./insurance_inspect/registration");
// ============================================================
// 工具注册
// ============================================================
/**
 * 注册所有默认工具
 */
function registerDefaultTools() {
    console.log('🔧 开始注册工具...\n');
    // 文件搜索工具
    registry_1.toolRegistry.register(registration_1.fs_globToolRegistration);
    registry_1.toolRegistry.register(registration_2.fs_readToolRegistration);
    registry_1.toolRegistry.register(registration_3.fs_grepToolRegistration);
    // 保险业务工具
    registry_1.toolRegistry.register(registration_4.insuranceFilterToolRegistration);
    registry_1.toolRegistry.register(registration_5.insuranceSearchToolRegistration);
    registry_1.toolRegistry.register(registration_6.insuranceInspectToolRegistration);
    console.log('\n✅ 工具注册完成!\n');
    // 打印统计信息
    registry_1.toolRegistry.printStats();
}
// ============================================================
// 工具管理函数（代理到 toolRegistry）
// ============================================================
/**
 * 注册单个工具
 */
exports.registerTool = registry_1.toolRegistry.register.bind(registry_1.toolRegistry);
/**
 * 批量注册工具
 */
exports.registerTools = registry_1.toolRegistry.registerMany.bind(registry_1.toolRegistry);
/**
 * 获取工具定义
 */
exports.getTool = registry_1.toolRegistry.getTool.bind(registry_1.toolRegistry);
/**
 * 获取所有工具
 */
exports.getAllTools = registry_1.toolRegistry.getAllTools.bind(registry_1.toolRegistry);
/**
 * 根据分类获取工具
 */
exports.getToolsByCategory = registry_1.toolRegistry.getToolsByCategory.bind(registry_1.toolRegistry);
/**
 * 检查工具是否存在
 */
exports.hasTool = registry_1.toolRegistry.hasTool.bind(registry_1.toolRegistry);
/**
 * 取消注册工具
 */
exports.unregisterTool = registry_1.toolRegistry.unregister.bind(registry_1.toolRegistry);
/**
 * 获取注册统计信息
 */
exports.getToolStats = registry_1.toolRegistry.getStats.bind(registry_1.toolRegistry);
// ============================================================
// 类型和常量导出
// ============================================================
__exportStar(require("./types"), exports);
var registry_2 = require("./registry");
Object.defineProperty(exports, "toolRegistry", { enumerable: true, get: function () { return registry_2.toolRegistry; } });
// ============================================================
// 工具定义导出（用于直接访问工具）
// ============================================================
// 文件搜索工具
var fs_glob_1 = require("./fs_glob");
Object.defineProperty(exports, "fs_globTool", { enumerable: true, get: function () { return fs_glob_1.fs_globTool; } });
var fs_read_1 = require("./fs_read");
Object.defineProperty(exports, "fs_readTool", { enumerable: true, get: function () { return fs_read_1.fs_readTool; } });
var fs_grep_1 = require("./fs_grep");
Object.defineProperty(exports, "fs_grepTool", { enumerable: true, get: function () { return fs_grep_1.fs_grepTool; } });
// 保险业务工具
var insurance_filter_1 = require("./insurance_filter");
Object.defineProperty(exports, "InsuranceFilter", { enumerable: true, get: function () { return insurance_filter_1.InsuranceFilter; } });
var insurance_search_1 = require("./insurance_search");
Object.defineProperty(exports, "InsuranceSearch", { enumerable: true, get: function () { return insurance_search_1.InsuranceSearch; } });
var insurance_inspect_1 = require("./insurance_inspect");
Object.defineProperty(exports, "InsuranceInspect", { enumerable: true, get: function () { return insurance_inspect_1.InsuranceInspect; } });
// HTTP 客户端
__exportStar(require("./http"), exports);
