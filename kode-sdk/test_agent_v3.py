#!/usr/bin/env python3
"""
Insurance Agent V3 (insure-recommand-v3) 测试脚本
测试保险推荐Agent的功能，包括客户画像收集、工具调用、产品推荐等
"""

import requests
import json
import os
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3001/api"
AGENT_ID = "insure-recommand-v3"
TEST_USER = "test_user"
TEST_PASSWORD = "test123"
REPORT_DIR = "开发工具计划/agent测试记录/v3_测试"
os.makedirs(REPORT_DIR, exist_ok=True)

class Colors:
    """终端颜色输出"""
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.NC}")
    print(f"{Colors.BLUE}{text:^60}{Colors.NC}")
    print(f"{Colors.BLUE}{'='*60}{Colors.NC}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.NC}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.NC}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.NC}")

def login_and_get_token():
    """登录并获取JWT token"""
    print_header("Step 1: 用户登录")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": TEST_USER, "password": TEST_PASSWORD},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        
        if data.get('ok') and data.get('access_token'):
            token = data['access_token']
            print_success(f"登录成功: {TEST_USER}")
            print(f"  Token: {token[:50]}...")
            return token
        else:
            print_error("登录失败: 未返回token")
            return None
    except Exception as e:
        print_error(f"登录失败: {e}")
        return None

def send_message(token, message, session_index=1):
    """
    发送消息到Agent (使用SSE流式接口)
    注意: SSE响应是流式的，需要逐行处理
    """
    print(f"\n{Colors.YELLOW}[发送消息 #{session_index}]{Colors.NC}")
    print(f"  消息: {message}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
    }
    
    payload = {
        "agentId": AGENT_ID,
        "message": message,
        "userId": TEST_USER,
        "sessionId": f"test-session-{int(time.time())}"
    }
    
    try:
        # 使用stream=True来处理SSE流
        response = requests.post(
            f"{BASE_URL}/chat",
            headers=headers,
            json=payload,
            stream=True,
            timeout=120
        )
        
        if response.status_code != 200:
            print_error(f"请求失败: HTTP {response.status_code}")
            print(f"  响应: {response.text[:500]}")
            return None
        
        # 解析SSE事件流
        full_response = ""
        thinking_text = ""
        tools_used = []
        
        print(f"\n{Colors.GREEN}[Agent响应流]{Colors.NC}")
        print("-" * 60)
        
        for line in response.iter_lines(decode_unicode=True):
            if not line:
                continue
            
            # SSE格式: "data: {...}"
            if line.startswith("data: "):
                try:
                    data = json.loads(line[6:])  # 去掉 "data: " 前缀
                    event_type = data.get('type')
                    
                    if event_type == 'thinking':
                        # 思考过程
                        delta = data.get('data', {}).get('delta', '')
                        thinking_text += delta
                        print(f"{Colors.YELLOW}[思考] {delta}{Colors.NC}", end='', flush=True)
                    
                    elif event_type == 'text':
                        # AI回复内容
                        delta = data.get('data', {}).get('delta', '')
                        full_response += delta
                        print(delta, end='', flush=True)
                    
                    elif event_type == 'tool_start':
                        # 工具开始执行
                        tool_data = data.get('data', {})
                        print(f"\n{Colors.BLUE}[工具执行] {tool_data.get('name')}{Colors.NC}")
                        print(f"  输入: {tool_data.get('input', '')}")
                    
                    elif event_type == 'tool_end':
                        # 工具执行完成
                        tool_data = data.get('data', {})
                        duration = tool_data.get('duration', 0)
                        print(f"{Colors.GREEN}  ✓ 完成 ({duration}ms){Colors.NC}")
                    
                    elif event_type == 'tool':
                        # 工具执行结果
                        tool_data = data.get('data', {})
                        tools_used.append({
                            'name': tool_data.get('name'),
                            'input': tool_data.get('input'),
                            'output': tool_data.get('output'),
                            'duration': tool_data.get('duration')
                        })
                    
                    elif event_type == 'complete':
                        # 对话完成
                        complete_data = data.get('data', {})
                        print(f"\n\n{Colors.GREEN}[完成] 原因: {complete_data.get('reason')}{Colors.NC}")
                        print(f"  工具调用次数: {complete_data.get('toolCount', 0)}")
                        break
                    
                    elif event_type == 'error':
                        # 错误
                        error_msg = data.get('data', {}).get('message', 'Unknown error')
                        print_error(f"错误: {error_msg}")
                        break
                        
                except json.JSONDecodeError as e:
                    # 可能是注释行或其他非JSON数据
                    pass
        
        print("\n" + "-" * 60)
        
        return {
            'thinking': thinking_text,
            'response': full_response,
            'tools': tools_used,
            'timestamp': datetime.now().isoformat()
        }
        
    except requests.exceptions.Timeout:
        print_error("请求超时")
        return None
    except Exception as e:
        print_error(f"请求失败: {e}")
        import traceback
        traceback.print_exc()
        return None

def save_test_report(scenario_name, results):
    """保存测试报告"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{scenario_name}_{timestamp}.md"
    filepath = os.path.join(REPORT_DIR, filename)
    
    # 构建Markdown报告
    md_content = f"""# {scenario_name} - Agent V3 测试报告

**时间**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Agent ID**: {AGENT_ID}
**测试用户**: {TEST_USER}

---

"""
    
    for i, result in enumerate(results, 1):
        md_content += f"""## 交互 {i}

### 用户消息
```
{result.get('user_message', 'N/A')}
```

### Agent思考过程
```
{result.get('data', {}).get('thinking', 'N/A')}
```

### Agent回复
```json
{result.get('data', {}).get('response', 'N/A')}
```

### 工具调用
"""
        tools = result.get('data', {}).get('tools', [])
        if tools:
            for j, tool in enumerate(tools, 1):
                md_content += f"""
#### 工具 {j}: {tool.get('name')}
- **输入**: `{tool.get('input')}`
- **输出**: 
```json
{json.dumps(tool.get('output'), indent=2, ensure_ascii=False)}
```
- **耗时**: {tool.get('duration')}ms

"""
        else:
            md_content += "\n*未调用工具*\n"
        
        md_content += "\n---\n\n"
    
    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print_success(f"测试报告已保存: {filepath}")

def run_scenario_1_initial_contact(token):
    """
    场景1: 初次接触 - 测试Agent收集客户画像
    预期: Agent应该主动询问缺失的客户信息
    """
    print_header("场景 1: 初次接触 - 客户画像收集")
    
    results = []
    
    # 第一轮: 用户简单询问
    message = "你好，我想了解一下保险产品"
    result = send_message(token, message, session_index=1)
    if result:
        results.append({
            'user_message': message,
            'data': result
        })
        time.sleep(2)
    
    # 第二轮: 提供部分信息
    message = "我35岁，年收入100万，在北京工作"
    result = send_message(token, message, session_index=2)
    if result:
        results.append({
            'user_message': message,
            'data': result
        })
    
    save_test_report("场景1_初次接触", results)
    return results

def run_scenario_2_specific_needs(token):
    """
    场景2: 明确需求 - 测试Agent的产品推荐能力
    预期: Agent应该调用工具查询产品并给出推荐
    """
    print_header("场景 2: 明确需求 - 产品推荐")
    
    results = []
    
    # 提供完整信息并明确需求
    message = """我叫张伟，35岁，科技公司高管，已婚有一个孩子。
年收入150万，预算在5-10万之间。
主要关注高端医疗险和重疾险，希望能覆盖海外就医。
工作压力大，经常出差，担心突发疾病。"""
    
    result = send_message(token, message, session_index=1)
    if result:
        results.append({
            'user_message': message,
            'data': result
        })
        time.sleep(2)
    
    # 追问细节
    message = "有没有覆盖心脑血管疾病的产品？"
    result = send_message(token, message, session_index=2)
    if result:
        results.append({
            'user_message': message,
            'data': result
        })
    
    save_test_report("场景2_明确需求", results)
    return results

def run_scenario_3_tool_validation(token):
    """
    场景3: 工具调用验证 - 测试Agent正确使用insurance工具
    预期: Agent应该使用 insurance_filter, insurance_search, insurance_inspect
    """
    print_header("场景 3: 工具调用验证")
    
    results = []
    
    # 特定条件查询
    message = """帮我找一款产品：
- 预算5万以内
- 年龄30-40岁
- 重疾险或医疗险
- 要有癌症保障
给我详细的产品信息和条款"""
    
    result = send_message(token, message, session_index=1)
    if result:
        results.append({
            'user_message': message,
            'data': result
        })
    
    save_test_report("场景3_工具调用", results)
    return results

def main():
    """主测试流程"""
    print_header("🧪 Insurance Agent V3 测试开始")
    print(f"Agent ID: {AGENT_ID}")
    print(f"Base URL: {BASE_URL}")
    print(f"测试用户: {TEST_USER}")
    
    # 1. 登录
    token = login_and_get_token()
    if not token:
        print_error("无法获取token，测试终止")
        return
    
    print_success("认证成功，开始测试场景...\n")
    time.sleep(1)
    
    # 2. 运行测试场景
    try:
        # 场景1: 初次接触
        run_scenario_1_initial_contact(token)
        time.sleep(3)
        
        # 场景2: 明确需求
        run_scenario_2_specific_needs(token)
        time.sleep(3)
        
        # 场景3: 工具调用验证
        run_scenario_3_tool_validation(token)
        
    except KeyboardInterrupt:
        print_warning("\n\n测试被用户中断")
    except Exception as e:
        print_error(f"测试执行失败: {e}")
        import traceback
        traceback.print_exc()
    
    print_header("✅ 测试完成")
    print(f"测试报告保存在: {REPORT_DIR}")

if __name__ == "__main__":
    main()
