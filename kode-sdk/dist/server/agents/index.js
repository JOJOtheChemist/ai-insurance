"use strict";
/**
 * Agent 配置管理中心
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
exports.insureRecommandV3AgentConfig = void 0;
exports.registerDefaultAgentConfigs = registerDefaultAgentConfigs;
exports.registerAgentConfig = registerAgentConfig;
exports.getAgentConfig = getAgentConfig;
exports.getAllAgentConfigs = getAllAgentConfigs;
exports.hasAgentConfig = hasAgentConfig;
const insure_recommand_v3_1 = require("./insure-recommand-v3");
/**
 * Agent 配置注册表
 */
const agentConfigRegistry = new Map();
/**
 * 注册默认 Agent 配置
 */
function registerDefaultAgentConfigs() {
    registerAgentConfig(insure_recommand_v3_1.insureRecommandV3AgentConfig);
}
/**
 * 注册单个 Agent 配置
 */
function registerAgentConfig(config) {
    if (agentConfigRegistry.has(config.id)) {
        console.warn(`⚠️  Agent 配置 ${config.id} 已存在，将被覆盖`);
    }
    agentConfigRegistry.set(config.id, config);
    console.log(`✓ 注册 Agent 配置: ${config.name} (${config.id})`);
}
/**
 * 获取 Agent 配置
 */
function getAgentConfig(id) {
    return agentConfigRegistry.get(id);
}
/**
 * 获取所有 Agent 配置
 */
function getAllAgentConfigs() {
    return Array.from(agentConfigRegistry.values());
}
/**
 * 检查 Agent 配置是否存在
 */
function hasAgentConfig(id) {
    return agentConfigRegistry.has(id);
}
// 导出配置
__exportStar(require("./types"), exports);
var insure_recommand_v3_2 = require("./insure-recommand-v3");
Object.defineProperty(exports, "insureRecommandV3AgentConfig", { enumerable: true, get: function () { return insure_recommand_v3_2.insureRecommandV3AgentConfig; } });
