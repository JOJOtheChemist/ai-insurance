import { useEffect, useRef } from 'react';

// TypeScript需要声明process对象类型
declare const process: { env: { NODE_ENV: string } };
const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

/**
 * 客户信息SSE连接Hook - 监听客户信息更新通知
 * @param {string} sessionId - 会话ID
 * @param {Function} onClientUpdated - 客户信息更新时的回调函数
 */
export const useClientSSE = (sessionId: string, onClientUpdated: () => void) => {
    const abortControllerRef = useRef<AbortController | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000]; // 重连延迟（毫秒）

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        const connectSSE = () => {
            // 取消之前的连接
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            const sseUrl = `/api/v1/clients/sse/${sessionId}`;

            if (isDev) {
                console.log('🔗 [Client SSE] 正在连接:', sseUrl);
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
                        console.log('✅ [Client SSE] 连接成功');
                    }

                    // 连接成功，重置重连次数
                    reconnectAttemptsRef.current = 0;

                    const reader = response.body?.getReader();
                    if (!reader) throw new Error('No reader available');

                    const decoder = new TextDecoder();

                    const readStream = (): void => {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                if (isDev) {
                                    console.log('🔌 [Client SSE] 连接关闭');
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
                                            console.log('📩 [Client SSE] 收到消息:', data);
                                        }

                                        // 处理不同类型的SSE事件
                                        if (data.type === 'client_updated') {
                                            if (isDev) {
                                                console.log('🔄 [Client SSE] 客户信息更新，触发回调...');
                                            }
                                            onClientUpdated();
                                        } else if (data.type === 'connected') {
                                            if (isDev) {
                                                console.log('✅ [Client SSE] 连接已建立');
                                            }
                                        } else if (data.type === 'ping') {
                                            // 心跳包，不需要处理
                                            if (isDev) {
                                                console.log('💓 [Client SSE] 心跳包');
                                            }
                                        }
                                    } catch (error) {
                                        console.error('❌ [Client SSE] 解析消息失败:', error);
                                    }
                                }
                            });

                            readStream();
                        }).catch(error => {
                            if (error.name === 'AbortError') {
                                if (isDev) {
                                    console.log('🛑 [Client SSE] 连接被取消');
                                }
                            } else {
                                console.error('❌ [Client SSE] 读取流失败:', error);
                                scheduleReconnect();
                            }
                        });
                    };

                    readStream();
                })
                .catch(error => {
                    if (error.name === 'AbortError') {
                        if (isDev) {
                            console.log('🛑 [Client SSE] 连接被取消');
                        }
                    } else {
                        console.error('❌ [Client SSE] 连接失败:', error);
                        scheduleReconnect();
                    }
                });
        };

        const scheduleReconnect = () => {
            if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
                console.error('❌ [Client SSE] 达到最大重连次数，停止重连');
                return;
            }

            const delay = RECONNECT_DELAYS[reconnectAttemptsRef.current] || 30000;

            if (isDev) {
                console.log(`⏳ [Client SSE] ${delay / 1000}秒后尝试重连 (第 ${reconnectAttemptsRef.current + 1} 次)`);
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
                    console.log('⏸️ [Client SSE] 页面不可见，断开连接');
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
                    console.log('▶️ [Client SSE] 页面可见，重新连接并刷新数据');
                }
                reconnectAttemptsRef.current = 0; // 重置重连次数
                onClientUpdated(); // 先拉一次最新数据
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
    }, [sessionId, onClientUpdated]);
};
