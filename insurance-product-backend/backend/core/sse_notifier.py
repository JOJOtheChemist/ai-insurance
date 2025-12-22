"""
SSE Notifier - 提供装饰器和辅助函数用于发送SSE通知
从jd1高频任务表项目复制并适配保险项目
"""
from functools import wraps
from typing import Optional, Any
from .sse_manager import sse_manager


def sse_notify(event_type: str = "update"):
    """
    SSE通知装饰器
    自动在被装饰函数执行成功后发送SSE通知
    
    使用方式:
    @router.post("/update")
    @sse_notify(event_type="client_updated")
    async def update_client(data: Data):
        ...
        return {"session_id": "...", "client_id": 1}
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 执行原函数
            result = await func(*args, **kwargs)
            
            try:
                # 尝试从结果中提取 session_id 和 client_id
                session_id = None
                client_id = None
                
                if isinstance(result, dict):
                    session_id = result.get('linked_session') or result.get('session_id')
                    client_id = result.get('client_id') or result.get('id')
                
                # 如果获取到了关键信息，且事件类型匹配，则发送通知
                if session_id:
                    if event_type == "client_updated" and client_id:
                        await notify_client_updated(session_id, client_id)
                    else:
                        # 通用通知
                        await sse_manager.send_to_session(
                            session_id=session_id,
                            event_type=event_type,
                            data=result if isinstance(result, dict) else {"data": str(result)}
                        )
                        print(f'📢 [SSE装饰器] 已发送通用通知: session_id={session_id}, event={event_type}')
                        
            except Exception as e:
                print(f'⚠️ [SSE装饰器] 发送通知失败: {e}')
                
            return result
        return wrapper
    return decorator


async def notify_client_updated(session_id: str, client_id: int):
    """
    客户信息更新通知
    
    Args:
        session_id: 会话ID
        client_id: 客户ID
    """
    if not session_id:
        print('⚠️ [SSE通知] session_id为空，无法发送通知')
        return
    
    try:
        await sse_manager.send_client_updated(
            session_id=session_id,
            client_id=client_id
        )
        # print(f'📢 [SSE] 已发送客户信息更新通知: session_id={session_id}, client_id={client_id}')
    except Exception as e:
        print(f'⚠️ [SSE通知] 发送客户信息更新通知失败: {e}')
