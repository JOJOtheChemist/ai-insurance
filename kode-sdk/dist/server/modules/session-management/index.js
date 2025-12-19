"use strict";
/**
 * 会话管理模块 - 统一导出
 *
 * 只使用文件系统存储（.kode目录下）
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
exports.SessionManagementService = exports.sessionService = void 0;
const service_1 = require("./service");
// 注释掉 MongoDB 相关
// import { MongoDBSessionService } from './mongodb-service';
// 强制使用文件系统存储
console.log('[Session Management] 使用存储方式: 文件系统 (.kode 目录)');
// 只导出文件系统会话服务
exports.sessionService = new service_1.SessionManagementService();
// 同时导出类型
__exportStar(require("./types"), exports);
var service_2 = require("./service");
Object.defineProperty(exports, "SessionManagementService", { enumerable: true, get: function () { return service_2.SessionManagementService; } });
// 注释掉 MongoDB 导出
// export { MongoDBSessionService } from './mongodb-service';
