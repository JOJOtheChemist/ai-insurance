/**
 * 路由聚合
 */

import { Router } from 'express';
import healthRouter from './health';
import chatRouter from './chat';
import sessionsRouter from './sessions';
import authRouter from './auth';

const router = Router();

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

router.use('/api', healthRouter);
router.use('/api', chatRouter);
router.use('/api', sessionsRouter);
router.use('/api', authRouter);

export default router;

