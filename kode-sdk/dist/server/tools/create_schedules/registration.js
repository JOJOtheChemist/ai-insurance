"use strict";
/**
 * 创建日程工具注册
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchedulesBatchToolRegistration = exports.parseNaturalLanguageToolRegistration = exports.createScheduleToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * 创建日程工具注册信息
 *
 * 从用户的自然语言描述创建日程记录，包括：
 * - 任务和时间槽
 * - 心情记录
 * - 随想和感受
 * - 计划vs实际对比
 */
exports.createScheduleToolRegistration = {
    metadata: {
        name: 'create_schedule',
        category: types_1.ToolCategory.SCHEDULE, // 改为 SCHEDULE 类别，因为这是创建日程的核心功能
        description: '从自然语言创建日程记录，支持记录任务、时间槽、心情和随想',
        version: '1.0.0',
        tags: ['schedule', 'create', 'natural-language', 'time-slot', 'mood', 'diary', 'glm'],
    },
    tool: index_1.createScheduleTool,
};
// 向后兼容的别名
exports.parseNaturalLanguageToolRegistration = exports.createScheduleToolRegistration;
// 为了兼容，也导出批量创建日程工具的注册信息
// 注意：这个工具在后端通过 MCP API 调用，不是直接注册的
exports.createSchedulesBatchToolRegistration = {
    metadata: {
        name: 'create_schedules_batch',
        category: types_1.ToolCategory.SCHEDULE,
        description: '批量创建日程记录（通过 MCP API）',
        version: '1.0.0',
        tags: ['schedule', 'batch', 'create', 'mcp'],
    },
    tool: {
        name: 'create_schedules_batch',
        description: '批量创建日程记录（此工具通过 MCP HTTP API 调用）',
        input_schema: {
            type: 'object',
            properties: {
                schedules: {
                    type: 'array',
                    description: '日程列表',
                },
            },
        },
        async exec(args) {
            // 这个工具实际上是通过 MCP Client 调用的
            // 这里只是一个占位符，用于工具注册
            return {
                ok: false,
                error: '此工具需要通过 MCP Client 调用，请使用 MCPClient.callTool("create_schedules_batch", params)',
            };
        },
    },
};
