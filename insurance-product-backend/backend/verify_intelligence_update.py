import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def check_db_status():
    print("🔍 检查数据库中最近更新的客户信息...")
    
    # 这里我们遍历一下 ID 1 到 5，看看有什么数据
    # 实际生产可以使用列表接口，但目前我们先只看特定的 ID
    
    found_any = False
    for client_id in range(1, 20):
        try:
            response = requests.get(f"{BASE_URL}/clients/{client_id}")
            if response.status_code == 200:
                data = response.json()
                print(f"\n[Client ID: {client_id}]")
                print(f"  姓名: {data.get('name')}")
                print(f"  关联会话 (来自 FollowUp): {[f.get('session_id') for f in data.get('follow_ups', [])]}")
                print(f"  画像摘要: 年龄={data.get('age')}, 风险={data.get('risk_factors')}")
                found_any = True
        except Exception:
            pass

    if not found_any:
        print("⚠️ 数据库中尚未发现客户数据（如果是新环境这是正常的）。")
    else:
        print("\n✅ 数据库连接正常，已发现上述客户数据。")

if __name__ == "__main__":
    check_db_status()
