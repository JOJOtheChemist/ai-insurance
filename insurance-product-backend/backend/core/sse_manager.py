"""
SSE Manager - 管理所有SSE连接和通知推送
从jd1高频任务表项目复制并适配保险项目
"""
import asyncio
from typing import Dict
from fastapi import Request
from sse_starlette.sse import EventSourceResponse


class SSEManager:
    """SSE连接管理器"""
    
    def __init__(self):
        # 存储每个用户/会话的事件队列
        # key: session_id, value: asyncio.Queue
        self._queues: Dict[str, asyncio.Queue] = {}
        
    def has_connection(self, session_id: str) -> bool:
        """检查会话是否有活跃的SSE连接"""
        return session_id in self._queues
    
    async def subscribe(self, session_id: str, user_id: str = None):
        """
        用户订阅SSE推送
        
        Args:
            session_id: 会话ID
            user_id: 可选的用户ID，用于日志记录
            
        Returns:
            EventSourceResponse: SSE响应对象
        """
        # 为会话创建新的消息队列
        queue = asyncio.Queue()
        self._queues[session_id] = queue
        
        print(f'🔌 [SSE] 会话 {session_id} 已连接 (user_id={user_id})')
        print(f'📊 [SSE] 当前活跃连接数: {len(self._queues)}')
        
        async def event_generator(session_id: str):
            """生成SSE事件流"""
            try:
                # 发送初始连接成功消息
                yield {
                    'event': 'connected',
                    'data': '{"type": "connected", "message": "SSE连接已建立"}'
                }
                
                # 定期发送心跳包
                heartbeat_interval = 30  # 30秒
                last_heartbeat = asyncio.get_event_loop().time()
                
                while True:
                    current_time = asyncio.get_event_loop().time()
                    
                    # 发送心跳包
                    if current_time - last_heartbeat >= heartbeat_interval:
                        yield {
                            'event': 'ping',
                            'data': '{"type": "ping"}'
                        }
                        last_heartbeat = current_time
                    
                    try:
                        # 等待消息，超时时间设为心跳间隔
                        message = await asyncio.wait_for(
                            queue.get(),
                            timeout=heartbeat_interval / 2
                        )
                        yield message
                    except asyncio.TimeoutError:
                        # 超时不是错误，继续循环
                        continue
                        
            except asyncio.CancelledError:
                print(f'🔌 [SSE] 会话 {session_id} 连接被取消')
                raise
            finally:
                # 清理连接
                if session_id in self._queues:
                    del self._queues[session_id]
                print(f'🔌 [SSE] 会话 {session_id} 已断开')
                print(f'📊 [SSE] 当前活跃连接数: {len(self._queues)}')
        
        return EventSourceResponse(event_generator(session_id))
    
    async def send_to_session(self, session_id: str, event_type: str, data: dict):
        """
        向特定会话发送SSE消息
        
        Args:
            session_id: 会话ID
            event_type: 事件类型
            data: 事件数据
        """
        if session_id not in self._queues:
            print(f'⚠️ [SSE] 会话 {session_id} 未连接，无法发送消息')
            return
        
        queue = self._queues[session_id]
        
        # 构造SSE消息
        import json
        message = {
            'event': event_type,
            'data': json.dumps({
                'type': event_type,
                **data
            })
        }
        
        await queue.put(message)
        print(f'📤 [SSE] 已向会话 {session_id} 发送 {event_type} 事件')
    
    async def send_client_updated(self, session_id: str, client_id: int):
        """
        发送客户信息更新通知
        
        Args:
            session_id: 会话ID
            client_id: 客户ID
        """
        # 检查是否有活跃连接
        if session_id not in self._queues:
            print(f'⚠️ [SSE] 会话 {session_id} 没有活跃连接，无法推送客户更新通知 (client_id={client_id})')
            return
        
        await self.send_to_session(
            session_id,
            'client_updated',
            {
                'client_id': client_id
            }
        )
        print(f'📢 [SSE] 已发送客户信息更新通知: session_id={session_id}, client_id={client_id}')


# 全局SSE管理器实例
sse_manager = SSEManager()
