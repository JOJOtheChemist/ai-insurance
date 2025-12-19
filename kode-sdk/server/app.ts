/**
 * Express 应用配置
 */

import express from 'express';
import cors from 'cors';
import router from './routes';

/**
 * 创建并配置 Express 应用
 */
export function createApp(): express.Application {
  const app = express();

  // 中间件
  app.use(cors({
    origin: function(origin, callback) {
      // 允许所有来自 140.143.194.215 的请求（支持时间表系统跨域）
      // 以及本地开发环境
      const allowedOrigins = [
        'http://localhost:8890',
        'http://localhost:3000',
        /^http:\/\/140\.143\.194\.215(:\d+)?$/  // 允许任意端口
      ];
      
      if (!origin) {
        // 允许非浏览器请求（如curl、postman）
        callback(null, true);
      } else if (allowedOrigins.some(allowed => 
        typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
      )) {
        callback(null, true);
      } else {
        callback(null, true); // 开发环境暂时允许所有来源
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  app.use(express.json());

  // 静态文件服务（放在路由之前，避免被拦截）
  app.use(express.static('public'));

  // 挂载 API 路由
  app.use(router);

  return app;
}

