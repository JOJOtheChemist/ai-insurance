import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_update():
    print("🚀 开始测试多主体智能更新接口 (Multi-Client)...")
    
    # 模拟第一次调用：更新王总
    payload1 = {
        "sessionId": "session-multi-001",
        "salespersonId": 1,
        "targetClient": "王总(多主体)",
        "profileUpdates": {
            "name": "王总(多主体)",
            "age": 45,
            "risk_factors": ["加班"]
        },
        "followUpSummary": "王总提到自己工作很忙。"
    }
    
    # 模拟第二次调用：更新李女士 (同一个 Session)
    payload2 = {
        "sessionId": "session-multi-001",
        "salespersonId": 1,
        "targetClient": "李女士(多主体)",
        "profileUpdates": {
            "name": "李女士(多主体)",
            "age": 42,
            "needs": ["养老金"]
        },
        "followUpSummary": "顺便咨询了李女士的养老问题。"
    }
    
    try:
        # 1. 更新王总
        print(f"📡 发送请求 1: {payload1['targetClient']}...")
        r1 = requests.post(f"{BASE_URL}/clients/update-intelligence", json=payload1)
        r1.raise_for_status()
        res1 = r1.json()
        print(f"✅ 王总更新成功 ID: {res1['client_id']}")
        
        # 2. 更新李女士
        print(f"📡 发送请求 2: {payload2['targetClient']}...")
        r2 = requests.post(f"{BASE_URL}/clients/update-intelligence", json=payload2)
        r2.raise_for_status()
        res2 = r2.json()
        print(f"✅ 李女士更新成功 ID: {res2['client_id']}")
        
        return res1['client_id'], res2['client_id']
    except Exception as e:
        print(f"❌ 更新失败: {e}")
        try:
             print(e.response.text)
        except:
            pass
        sys.exit(1)

def verify_data(id1, id2):
    print(f"\n🔍 验证数据...")
    
    # 验证王总
    try:
        data1 = requests.get(f"{BASE_URL}/clients/{id1}").json()
        print(f"👤 客户1: {data1['name']}, 跟进记录数: {len(data1['follow_ups'])}")
        assert data1['name'] == "王总(多主体)"
        assert data1['follow_ups'][0]['session_id'] == "session-multi-001"
    except Exception as e:
        print(f"❌ 验证客户1失败: {e}")

    # 验证李女士
    try:
        data2 = requests.get(f"{BASE_URL}/clients/{id2}").json()
        print(f"👤 客户2: {data2['name']}, 跟进记录数: {len(data2['follow_ups'])}")
        assert data2['name'] == "李女士(多主体)"
        assert data2['follow_ups'][0]['session_id'] == "session-multi-001"
    except Exception as e:
        print(f"❌ 验证客户2失败: {e}")
        
    print("\n✨ 多主体关联验证通过！")

if __name__ == "__main__":
    id1, id2 = test_update()
    verify_data(id1, id2)
