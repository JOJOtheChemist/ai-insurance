#!/usr/bin/env python3
"""检查客户的推荐方案数据"""
import requests
import json

# 查询所有客户
print("=== 查询所有客户（名字包含'美美'）===")
try:
    response = requests.get("http://localhost:8000/api/v1/clients/list?salesperson_id=1&limit=100")
    if response.status_code == 200:
        data = response.json()
        clients = data.get("clients", [])
        
        meimei_clients = [c for c in clients if "美美" in c.get("name", "")]
        
        if meimei_clients:
            for client in meimei_clients:
                print(f"\n客户ID: {client.get('id')}")
                print(f"客户姓名: {client.get('name')}")
                print(f"方案数量: {client.get('plans_count', 0)}")
                
                # 获取详细信息
                client_id = client.get('id')
                detail_response = requests.get(f"http://localhost:8000/api/v1/clients/{client_id}")
                if detail_response.status_code == 200:
                    detail = detail_response.json()
                    proposed_plans = detail.get('proposed_plans', [])
                    print(f"推荐方案: {json.dumps(proposed_plans, ensure_ascii=False, indent=2)}")
                else:
                    print(f"获取详情失败: {detail_response.status_code}")
        else:
            print("未找到名字包含'美美'的客户")
            print(f"\n所有客户：")
            for c in clients[:5]:  # 只显示前5个
                print(f"  - {c.get('name')} (ID: {c.get('id')})")
    else:
        print(f"获取客户列表失败: {response.status_code}")
        print(f"响应: {response.text}")
except Exception as e:
    print(f"错误: {e}")

# 查询方案ID为1的方案详情
print("\n\n=== 查询方案ID=1的详细信息 ===")
try:
    scheme_response = requests.get("http://localhost:8000/api/v1/schemes/1")
    if scheme_response.status_code == 200:
        scheme = scheme_response.json()
        print(json.dumps(scheme, ensure_ascii=False, indent=2))
    else:
        print(f"获取方案失败: {scheme_response.status_code}")
        print(f"响应: {scheme_response.text}")
except Exception as e:
    print(f"错误: {e}")
