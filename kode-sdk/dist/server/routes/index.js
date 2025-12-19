"use strict";
/**
 * 路由聚合
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const chat_1 = __importDefault(require("./chat"));
const sessions_1 = __importDefault(require("./sessions"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
// 挂载子路由
router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Kode SDK Agent Server Running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            chat: '/api/chat',
            sessions: '/api/sessions'
        },
        agents: [
            'insurance-sales-assistant (Insurance Sales)',
            'insure-recommand-v1 (Legacy)'
        ]
    });
});
router.use('/api', health_1.default);
router.use('/api', chat_1.default);
router.use('/api', sessions_1.default);
router.use('/api', auth_1.default);
exports.default = router;
