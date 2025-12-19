"use strict";
/**
 * Express 应用配置
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
/**
 * 创建并配置 Express 应用
 */
function createApp() {
    const app = (0, express_1.default)();
    // 中间件
    app.use((0, cors_1.default)({
        origin: function (origin, callback) {
            // 允许所有来自 140.143.194.215 的请求（支持时间表系统跨域）
            // 以及本地开发环境
            const allowedOrigins = [
                'http://localhost:8890',
                'http://localhost:3000',
                /^http:\/\/140\.143\.194\.215(:\d+)?$/ // 允许任意端口
            ];
            if (!origin) {
                // 允许非浏览器请求（如curl、postman）
                callback(null, true);
            }
            else if (allowedOrigins.some(allowed => typeof allowed === 'string' ? allowed === origin : allowed.test(origin))) {
                callback(null, true);
            }
            else {
                callback(null, true); // 开发环境暂时允许所有来源
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));
    app.use(express_1.default.json());
    // 静态文件服务（放在路由之前，避免被拦截）
    app.use(express_1.default.static('public'));
    // 挂载 API 路由
    app.use(routes_1.default);
    return app;
}
