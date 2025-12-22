import requests
import json
import time

API_URL = "http://localhost:3001/api/chat"
LOGIN_URL = "http://localhost:3001/api/auth/login"

def test_chat_interaction():
    print("🚀 开始测试 AI 对话交互 (End-to-End)...")
    
    # 1. 登录获取 Token
    print("🔑 登录中...")
    login_resp = requests.post(LOGIN_URL, json={"username": "demon", "password": "password"})
    
    token = None
    if login_resp.status_code == 200:
        try:
            token = login_resp.json().get("access_token")
            print("✅ 登录成功，获取 Token")
        except:
             print("⚠️ 登录响应非 JSON")
    else:
        print(f"⚠️ 登录失败 (Status {login_resp.status_code}): {login_resp.text}")
    
    if not token:
        print("ℹ️ 未获取有效 Token，使用模拟头尝试 (可能无法通过 Auth 中间件)")
        token = "mock-token"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 2. 发送对话消息
    print("💬 发送包含客户信息的消息...")
    # 构造一个 SSE 请求
    payload = {
        "message": "我的客户叫张伟(测试)，今年33岁，想给3岁的儿子买保险。他目前比较关注子女教育和健康保障，预算大概1-2万。请帮我分析一下。",
        "agentId": "insure-recommand-v3-new",
        "sessionId": "session-auto-test-" + str(int(time.time()))
    }
    
    try:
        response = requests.post(API_URL, json=payload, headers=headers, stream=True)
        response.raise_for_status()
        
        print("📥 接收流式响应...")
        tool_triggered = False
        
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                if decoded_line.startswith("data: "):
                    data_str = decoded_line[6:]
                    if data_str == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        # 检查是否有工具调用
                        if data.get("type") == "tool_call":
                            tool_name = data.get("tool")
                            print(f"🛠️  捕获工具调用: {tool_name}")
                            if tool_name == "update_client_intelligence":
                                tool_triggered = True
                                print(f"   参数: {data.get('params')}")
                        elif data.get("type") == "text":
                             print(f"🤖 AI 回复: {data.get('text')}")
                    except json.JSONDecodeError:
                        pass
                        
        if tool_triggered:
            print("\n✅ 测试通过！成功触发了 update_client_intelligence 工具。")
        else:
            print("\n❌ 测试失败：未检测到 update_client_intelligence 工具调用。")
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")

if __name__ == "__main__":
    test_chat_interaction()
