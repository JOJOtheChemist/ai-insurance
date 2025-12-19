"use strict";
/**
 * 工具相关类型定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolCategory = void 0;
/**
 * 工具分类枚举
 */
var ToolCategory;
(function (ToolCategory) {
    /** 数学计算 */
    ToolCategory["MATH"] = "math";
    /** 文件操作 */
    ToolCategory["FILE"] = "file";
    /** 网络请求 */
    ToolCategory["NETWORK"] = "network";
    /** 数据库操作 */
    ToolCategory["DATABASE"] = "database";
    /** 实用工具 */
    ToolCategory["UTILITY"] = "utility";
    /** 日程管理 */
    ToolCategory["SCHEDULE"] = "schedule";
    /** 项目管理 */
    ToolCategory["PROJECT"] = "project";
    /** AI 工具 */
    ToolCategory["AI"] = "ai";
})(ToolCategory || (exports.ToolCategory = ToolCategory = {}));
