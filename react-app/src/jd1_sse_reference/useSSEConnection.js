import { useEffect, useRef } from 'react';

const isDev = process.env.NODE_ENV === 'development';

/**
 * SSE连接Hook - 用于监听服务器推送的任务更新通知
 * @param {string} userId - 用户ID
 * @param {string} currentDateISO - 当前日期（YYYY-MM-DD格式）
 * @param {Function} reloadData - 刷新数据的回调函数
 */
export const useSSEConnection = (userId, currentDateISO, reloadData) => {
    const abortControllerRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000]; // 重连延迟（毫秒）

    useEffect(() => {
        if (!userId || !currentDateISO) {
            return;
        }

        const connectSSE = () => {
            // 取消之前的连接
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            const sseUrl = `/api/schedules/${userId}/sse?date=${currentDateISO}`;

            if (isDev) {
                console.log('🔗 [SSE] 正在连接:', sseUrl);
            }

            fetch(sseUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
                signal: abortControllerRef.current.signal,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`SSE连接失败: ${response.status}`);
                    }

                    if (isDev) {
                        console.log('✅ [SSE] 连接成功');
                    }

                    // 连接成功，重置重连次数
                    reconnectAttemptsRef.current = 0;

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    const readStream = () => {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                if (isDev) {
                                    console.log('🔌 [SSE] 连接关闭');
                                }
                                // 尝试重连
                                scheduleReconnect();
                                return;
                            }

                            const chunk = decoder.decode(value, { stream: true });
                            const lines = chunk.split('\n');

                            lines.forEach(line => {
                                if (line.startsWith('data: ')) {
                                    try {
                                        const data = JSON.parse(line.substring(6));

                                        if (isDev) {
                                            console.log('📩 [SSE] 收到消息:', data);
                                        }

                                        // 处理不同类型的SSE事件
                                        if (data.type === 'task_updated') {
                                            if (isDev) {
                                                console.log('🔄 [SSE] 任务更新，重新加载数据...');
                                            }
                                            reloadData();
                                        } else if (data.type === 'timeslot_updated') {
                                            if (isDev) {
                                                console.log('🔄 [SSE] 时间表更新，重新加载数据...');
                                            }
                                            reloadData();
                                        } else if (data.type === 'ping') {
                                            // 心跳包，不需要处理
                                            if (isDev) {
                                                console.log('💓 [SSE] 心跳包');
                                            }
                                        }
                                    } catch (error) {
                                        console.error('❌ [SSE] 解析消息失败:', error);
                                    }
                                }
                            });

                            readStream();
                        }).catch(error => {
                            if (error.name === 'AbortError') {
                                if (isDev) {
                                    console.log('🛑 [SSE] 连接被取消');
                                }
                            } else {
                                console.error('❌ [SSE] 读取流失败:', error);
                                scheduleReconnect();
                            }
                        });
                    };

                    readStream();
                })
                .catch(error => {
                    if (error.name === 'AbortError') {
                        if (isDev) {
                            console.log('🛑 [SSE] 连接被取消');
                        }
                    } else {
                        console.error('❌ [SSE] 连接失败:', error);
                        scheduleReconnect();
                    }
                });
        };

        const scheduleReconnect = () => {
            if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
                console.error('❌ [SSE] 达到最大重连次数，停止重连');
                return;
            }

            const delay = RECONNECT_DELAYS[reconnectAttemptsRef.current] || 30000;

            if (isDev) {
                console.log(`⏳ [SSE] ${delay / 1000}秒后尝试重连 (第 ${reconnectAttemptsRef.current + 1} 次)`);
            }

            reconnectTimerRef.current = setTimeout(() => {
                reconnectAttemptsRef.current += 1;
                connectSSE();
            }, delay);
        };

        // 初始连接
        connectSSE();

        // 处理页面可见性变化
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // 用户切换到其他 tab，断开连接以节省资源
                if (isDev) {
                    console.log('⏸️ [SSE] 页面不可见，断开连接');
                }
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                if (reconnectTimerRef.current) {
                    clearTimeout(reconnectTimerRef.current);
                }
            } else {
                // 用户回到这个 tab，重新连接
                if (isDev) {
                    console.log('▶️ [SSE] 页面可见，重新连接并刷新数据');
                }
                reconnectAttemptsRef.current = 0; // 重置重连次数
                reloadData(); // 先拉一次最新数据
                connectSSE(); // 再重新建立 SSE
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // 清理
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [userId, currentDateISO, reloadData]);
};
