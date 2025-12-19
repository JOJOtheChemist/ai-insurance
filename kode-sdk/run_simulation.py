import requests
import json
import os
import time

# Configuration
BASE_URL = "http://localhost:8000/api/tools"
OUTPUT_DIR = "开发工具计划/测试记录/第三次测试"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def run_step(step_name, url, params):
    print(f"  > Running {step_name}...", end=" ", flush=True)
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        print("OK")
        return data
    except Exception as e:
        print(f"FAILED: {e}")
        return {"error": str(e)}

def save_report(scenario_name, filename, content):
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved report: {filepath}")

def format_json(data):
    return json.dumps(data, indent=2, ensure_ascii=False)

# ==========================================
# Scenario 1
# ==========================================
def run_scenario_1():
    print("\n--- Scenario 1: 30yo Programmer ---")
    
    # Live Calls
    res_filter = run_step("Filter", f"{BASE_URL}/filter", {"age_min": 30, "product_type": "定期寿险"})
    res_search_dingqi = run_step("Search Dingqi", f"{BASE_URL}/search", {"keyword": "定期寿险", "limit": 3})
    res_search_sudden = run_step("Search Sudden Death", f"{BASE_URL}/search", {"keyword": "猝死", "limit": 3})
    res_inspect = run_step("Inspect ID 40", f"{BASE_URL}/inspect", {"product_id": 40, "fields": "product_name,extend_info,coverage"})

    # Generate Markdown
    md = f"""# 场景一：30岁程序员防猝死配置 - 真实测试记录 (Third Test)

**测试时间**: {time.strftime("%Y-%m-%d %H:%M:%S")}
**测试环境**: 本地 API (localhost:8000)

## 1. 用户输入
> "我今年30岁，是写代码的，经常熬夜。家里老婆孩子都靠我，我怕万一哪天猝死了或者得了大病，家里没钱。有没有那种性价比高的保险？最好能保猝死的。"

## 2. Agent 思考与工具调用 (Live)

### Step 1: 尝试筛选 (Filter)
Agent 尝试寻找适合 30 岁的定期寿险。
**Request**: `filter(age_min=30, product_type="定期寿险")`
**Response**:
```json
{format_json(res_filter)}
```

### Step 2: 关键词搜索 (Search) - "定期寿险"
**Request**: `search(keyword="定期寿险", limit=3)`
**Response**:
```json
{format_json(res_search_dingqi)}
```

### Step 3: 关键词搜索 (Search) - "猝死"
**Request**: `search(keyword="猝死", limit=3)`
**Response**:
```json
{format_json(res_search_sudden)}
```

### Step 4: 细节查阅 (Inspect) - 验证"猝死"条款
Agent 决定查看 ID 40 的详细条款。
**Request**: `inspect(product_id=40, fields="product_name,extend_info,coverage")`
**Response**:
```json
{format_json(res_inspect)}
```

## 3. 生成最终回复 (Simulated)
> "懂您的担心，做 IT 的确实压力大。鉴于检索结果，我为您定制了方案：..."
"""
    save_report("Scenario 1", "场景1_30岁程序员_v3.md", md)

# ==========================================
# Scenario 2
# ==========================================
def run_scenario_2():
    print("\n--- Scenario 2: Family Config ---")
    
    res_child = run_step("Search High-end Med", f"{BASE_URL}/search", {"keyword": "高端医疗", "limit": 3})
    res_elder = run_step("Search Medical", f"{BASE_URL}/search", {"keyword": "医疗险", "limit": 3})
    
    md = f"""# 场景二：全家桶配置 - 真实测试记录 (Third Test)

**测试时间**: {time.strftime("%Y-%m-%d %H:%M:%S")}
**测试环境**: 本地 API (localhost:8000)

## 1. 用户输入
> "我想给全家买保险。孩子5岁，我想给他最好的医疗。还有我岳母65岁了，身体一般，能买什么？"

## 2. Agent 思考与工具调用 (Live)

### Step 1: 搜索儿童高端医疗
**Request**: `search(keyword="高端医疗", limit=3)`
**Response**:
```json
{format_json(res_child)}
```

### Step 2: 搜索老人医疗险
**Request**: `search(keyword="医疗险", limit=3)`
**Response**:
```json
{format_json(res_elder)}
```
"""
    save_report("Scenario 2", "场景2_家庭全员配置_v3.md", md)

# ==========================================
# Scenario 3
# ==========================================
def run_scenario_3():
    print("\n--- Scenario 3: Product Comparison ---")
    
    res_search = run_step("Search Critical", f"{BASE_URL}/search", {"keyword": "重疾险", "limit": 3})
    res_inspect_33 = run_step("Inspect ID 33", f"{BASE_URL}/inspect", {"product_id": 33, "fields": "product_name,extend_info,coverage"})
    res_inspect_28 = run_step("Inspect ID 28", f"{BASE_URL}/inspect", {"product_id": 28, "fields": "product_name,extend_info,coverage"})

    md = f"""# 场景三：产品深度对比 - 真实测试记录 (Third Test)

**测试时间**: {time.strftime("%Y-%m-%d %H:%M:%S")}
**测试环境**: 本地 API (localhost:8000)

## 1. 用户输入
> "我看那个‘顺心版’和‘星享版’都是重疾险，它俩有啥区别啊？"

## 2. Agent 思考与工具调用 (Live)

### Step 1: 搜索重疾险
**Request**: `search(keyword="重疾险", limit=3)`
**Response**:
```json
{format_json(res_search)}
```

### Step 2: 模拟深度查阅 (Inspect)
**Request**: `inspect(id=33/28)`
**Response (ID 33)**:
```json
{format_json(res_inspect_33)}
```
**Response (ID 28)**:
```json
{format_json(res_inspect_28)}
```
"""
    save_report("Scenario 3", "场景3_产品对比_v3.md", md)

# ==========================================
# Scenario 4
# ==========================================
def run_scenario_4():
    print("\n--- Scenario 4: Doubt Crushing ---")
    
    res_search = run_step("Search Manqijin", f"{BASE_URL}/search", {"keyword": "满期金", "limit": 2})

    md = f"""# 场景四：疑虑粉碎（回本） - 真实测试记录 (Third Test)

**测试时间**: {time.strftime("%Y-%m-%d %H:%M:%S")}
**测试环境**: 本地 API (localhost:8000)

## 1. 用户输入
> "听说保险都是骗人的...有没有那种能回本的？"

## 2. Agent 思考与工具调用 (Live)

### Step 1: 搜索‘满期金’
**Request**: `search(keyword="满期金", limit=2)`
**Response**:
```json
{format_json(res_search)}
```
"""
    save_report("Scenario 4", "场景4_疑虑粉碎_v3.md", md)


if __name__ == "__main__":
    print("Starting Simulation...")
    run_scenario_1()
    run_scenario_2()
    run_scenario_3()
    run_scenario_4()
    print("\nDone.")
