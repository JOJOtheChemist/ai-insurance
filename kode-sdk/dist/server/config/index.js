"use strict";
/**
 * 服务器配置管理
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
exports.config = {
    // 服务器配置
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || '127.0.0.1', // 默认只监听localhost，由nginx代理
    // AI 模型配置
    ai: {
        apiKey: process.env.ANTHROPIC_API_KEY,
        modelId: process.env.ANTHROPIC_MODEL_ID || 'glm-4',
        baseUrl: process.env.ANTHROPIC_BASE_URL,
    },
    // Agent 配置
    agent: {
        toolTimeoutMs: 30000,
        maxToolConcurrency: 1,
        workDir: './workspace',
    },
    // 开发模式
    isDevelopment: process.env.NODE_ENV !== 'production',
};
/**
 * 验证必需的配置项
 */
function validateConfig() {
    const errors = [];
    if (!exports.config.ai.apiKey) {
        errors.push('ANTHROPIC_API_KEY 未配置');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
