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
exports.insureRecommandV3AgentConfig = exports.insureRecommandV1AgentConfig = exports.searchAgentConfig = exports.reviewAgentConfig = exports.careerGoalAgentConfig = exports.timetableV2AgentConfig = exports.timetableAgentConfig = exports.scheduleAssistantConfig = exports.calculatorAgentConfig = void 0;
exports.registerDefaultAgentConfigs = registerDefaultAgentConfigs;
exports.registerAgentConfig = registerAgentConfig;
exports.getAgentConfig = getAgentConfig;
exports.getAllAgentConfigs = getAllAgentConfigs;
exports.hasAgentConfig = hasAgentConfig;
const calculator_agent_1 = require("./calculator-agent");
const schedule_assistant_1 = require("./schedule-assistant");
const timetable_agent_1 = require("./timetable-agent");
const timetable_v2_agent_1 = require("./timetable-v2-agent");
const career_goal_agent_1 = require("./career-goal-agent");
const review_agent_1 = require("./review-agent");
const search_agent_1 = require("./search-agent");
const insure_recommand_v1_1 = require("./insure-recommand-v1");
const insure_recommand_v3_1 = require("./insure-recommand-v3");
/**
 * Agent 配置注册表
 */
const agentConfigRegistry = new Map();
/**
 * 注册默认 Agent 配置
 */
function registerDefaultAgentConfigs() {
    registerAgentConfig(calculator_agent_1.calculatorAgentConfig);
    registerAgentConfig(schedule_assistant_1.scheduleAssistantConfig);
    registerAgentConfig(timetable_agent_1.timetableAgentConfig);
    registerAgentConfig(timetable_v2_agent_1.timetableV2AgentConfig);
    registerAgentConfig(career_goal_agent_1.careerGoalAgentConfig);
    registerAgentConfig(review_agent_1.reviewAgentConfig);
    registerAgentConfig(search_agent_1.searchAgentConfig);
    registerAgentConfig(insure_recommand_v1_1.insureRecommandV1AgentConfig);
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
var calculator_agent_2 = require("./calculator-agent");
Object.defineProperty(exports, "calculatorAgentConfig", { enumerable: true, get: function () { return calculator_agent_2.calculatorAgentConfig; } });
var schedule_assistant_2 = require("./schedule-assistant");
Object.defineProperty(exports, "scheduleAssistantConfig", { enumerable: true, get: function () { return schedule_assistant_2.scheduleAssistantConfig; } });
var timetable_agent_2 = require("./timetable-agent");
Object.defineProperty(exports, "timetableAgentConfig", { enumerable: true, get: function () { return timetable_agent_2.timetableAgentConfig; } });
var timetable_v2_agent_2 = require("./timetable-v2-agent");
Object.defineProperty(exports, "timetableV2AgentConfig", { enumerable: true, get: function () { return timetable_v2_agent_2.timetableV2AgentConfig; } });
var career_goal_agent_2 = require("./career-goal-agent");
Object.defineProperty(exports, "careerGoalAgentConfig", { enumerable: true, get: function () { return career_goal_agent_2.careerGoalAgentConfig; } });
var review_agent_2 = require("./review-agent");
Object.defineProperty(exports, "reviewAgentConfig", { enumerable: true, get: function () { return review_agent_2.reviewAgentConfig; } });
var search_agent_2 = require("./search-agent");
Object.defineProperty(exports, "searchAgentConfig", { enumerable: true, get: function () { return search_agent_2.searchAgentConfig; } });
var insure_recommand_v1_2 = require("./insure-recommand-v1");
Object.defineProperty(exports, "insureRecommandV1AgentConfig", { enumerable: true, get: function () { return insure_recommand_v1_2.insureRecommandV1AgentConfig; } });
var insure_recommand_v3_2 = require("./insure-recommand-v3");
Object.defineProperty(exports, "insureRecommandV3AgentConfig", { enumerable: true, get: function () { return insure_recommand_v3_2.insureRecommandV3AgentConfig; } });
