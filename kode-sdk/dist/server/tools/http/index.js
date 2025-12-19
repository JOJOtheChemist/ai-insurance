"use strict";
/**
 * HTTP client exports
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
exports.mcpClient = void 0;
const client_1 = require("./client");
const config_1 = require("./config");
// 默认实例（从环境变量读取用户名密码）
exports.mcpClient = new client_1.MCPClient(config_1.DEFAULT_MCP_CONFIG);
// 导出所有类型和类
__exportStar(require("./types"), exports);
__exportStar(require("./config"), exports);
__exportStar(require("./auth"), exports);
__exportStar(require("./client"), exports);
