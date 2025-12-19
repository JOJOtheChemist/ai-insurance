import requests
import json
import os
import time

# Configuration
BASE_URL = "http://localhost:8000/api/tools"
OUTPUT_DIR = "开发工具计划/测试记录/第四次测试"
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
# Scenario 1 (Optimized)
# ==========================================
def run_scenario_1():
    print("\n--- Scenario 1: 30yo Programmer (Optimized) ---")
    
    # 1. Filter
    res_filter = run_step("Filter", f"{BASE_URL}/filter", {"age_min": 30, "product_type": "定期寿险"})
    
    # 2. Search
    res_search_sudden = run_step("Search Sudden Death", f"{BASE_URL}/search", {"keyword": "猝死", "limit": 3})
    
    # 3. Inspect (Summary Mode - Lazy Loading)
    res_inspect_summary = run_step("Inspect ID 40 (Summary)", f"{BASE_URL}/inspect", {"product_id": 40, "fields": "product_name,coverage", "view": "summary"})
    
    # 4. Inspect (Detail Mode - Fetch Specific Key)
    # Simulator Decision: "I see '猝死保险金' in keys, so I fetch it."
    res_inspect_detail = run_step("Inspect ID 40 (Detail)", f"{BASE_URL}/inspect", {"product_id": 40, "fields": "coverage.猝死保险金"})

    md = f"""# 场景一：30岁程序员防猝死配置 (Fourth Test - Optimized)

**测试时间**: {time.strftime("%Y-%m-%d %H:%M:%S")}
**测试环境**: 本地 API (localhost:8000)
**测试重点**: 验证 "Lazy Loading" (按需查阅) 机制能否减少 Token 消耗。

## 1. 用户输入
> "我今年30岁，是写代码的，经常熬夜。家里老婆孩子都靠我，我怕万一哪天猝死了或者得了大病，家里没钱。有没有那种性价比高的保险？最好能保猝死的。"

## 2. Agent 思考与工具调用

### Step 1: 尝试筛选 (Filter)
Agent 尝试寻找适合 30 岁的定期寿险。
**Request**: `filter(age_min=30, product_type="定期寿险")`
**Response**:
```json
{format_json(res_filter)}
```

### Step 2: 关键词搜索 "猝死"
**Request**: `search(keyword="猝死", limit=3)`
**Response**:
```json
{format_json(res_search_sudden)}
```

### Step 3: 细节查阅 (Phase 1: 概览)
Agent 决定查看 ID 40 的条款，但为了节省 Token，先看目录。
**Request**: `inspect(product_id=40, fields="product_name,coverage", view="summary")`
**Response**:
```json
{format_json(res_inspect_summary)}
```
> **Agent 思考**: "我看到了 `coverage_keys` 里有 '猝死保险金'，这正是我要找的。不需要看其他几十条无关条款，只要看这一条。"

### Step 4: 细节查阅 (Phase 2: 精读)
Agent 精准提取 "猝死保险金" 的内容。
**Request**: `inspect(product_id=40, fields="coverage.猝死保险金")`
**Response**:
```json
{format_json(res_inspect_detail)}
```

## 3. 生成最终回复 (Simulated)
> "懂您的担心，做 IT 的确实压力大。鉴于检索结果，我为您定制了方案：
> 推荐 **友邦友型运动意外伤害保险**，它明确包含**猝死保障**（条款确认：‘在保险合同有效期内，若被保险人发生猝死，则本公司给付猝死保险金...’）。此产品对 30 岁人群非常友好..."
"""
    save_report("Scenario 1", "场景1_30岁程序员_v4.md", md)

# ==========================================
# Scenario 2 (Optimized)
# ==========================================
def run_scenario_2():
    print("\n--- Scenario 2: Family Config (Optimized) ---")
    
    # 1. Search Child (High-end)
    res_child = run_step("Search High-end Med", f"{BASE_URL}/search", {"keyword": "高端医疗", "limit": 2})
    
    # 2. Inspect ID 43 (Summary) - Corrected from 34
    res_inspect_43_sum = run_step("Inspect ID 43 (Summary)", f"{BASE_URL}/inspect", {"product_id": 43, "fields": "coverage", "view": "summary"})
    
    # 3. Inspect ID 43 (Detail) - Correct Key
    # Key found via analysis: "一般门急诊医疗费用补偿金"
    res_inspect_43_detail = run_step("Inspect ID 43 (Detail)", f"{BASE_URL}/inspect", {"product_id": 43, "fields": "coverage.一般门急诊医疗费用补偿金"})

    md = f"""# 场景二：家庭配置 (Fourth Test - Optimized)

**测试重点**: 验证针对不同家庭成员（小孩、老人）的按需查阅。

## Agent 思考与工具调用

### Step 1: 搜索儿童保险
**Request**: `search("高端医疗")`
**Response**:
```json
{format_json(res_child)}
```

### Step 2: 查阅条款 (概览)
**Request**: `inspect(id=43, fields="coverage", view="summary")`
**Response**:
```json
{format_json(res_inspect_43_sum)}
```
> **Agent 思考**: "看到 `一般门急诊医疗费用补偿金`，我想确认额度。"

### Step 3: 查阅条款 (精读)
**Request**: `inspect(id=43, fields="coverage.一般门急诊医疗费用补偿金")`
**Response**:
```json
{format_json(res_inspect_43_detail)}
```
"""
    save_report("Scenario 2", "场景2_家庭全员配置_v4.md", md)


# ==========================================
# Scenario 3 (Optimized)
# ==========================================
def run_scenario_3():
    print("\n--- Scenario 3: Product Comparison (Optimized) ---")
    
    # 1. Inspect ID 33 (Summary)
    res_33_sum = run_step("Inspect ID 33 (Summary)", f"{BASE_URL}/inspect", {"product_id": 33, "fields": "extend_info", "view": "summary"})
    
    # 2. Inspect ID 33 (Detail - Highlights for Waiting Period)
    # Note: Waiting period is usually in 'highlights' list
    res_33_high = run_step("Inspect ID 33 (Highlights)", f"{BASE_URL}/inspect", {"product_id": 33, "fields": "extend_info.highlights"})

    md = f"""# 场景三：产品深度对比 (Fourth Test - Optimized)

**测试重点**: 对比复杂产品时，通过 Summary 模式快速定位差异点。

## Agent 思考与工具调用

### Step 1: 查阅 ID 33 的扩展信息 (概览)
**Request**: `inspect(id=33, fields="extend_info", view="summary")`
**Response**:
```json
{format_json(res_33_sum)}
```
> **Agent 思考**: "扩展信息里有 `highlights` (产品亮点)，通常包含等待期信息，我要查看它。"

### Step 2: 查阅产品亮点 (精读)
**Request**: `inspect(id=33, fields="extend_info.highlights")`
**Response**:
```json
{format_json(res_33_high)}
```
"""
    save_report("Scenario 3", "场景3_产品对比_v4.md", md)

# ==========================================
# Scenario 4 (Optimized)
# ==========================================
def run_scenario_4():
    print("\n--- Scenario 4: Doubt Crushing (Optimized) ---")
    
    # 1. Search
    res_search = run_step("Search Manqijin", f"{BASE_URL}/search", {"keyword": "满期金", "limit": 2})
    
    # 2. Inspect (Summary)
    res_inspect_sum = run_step("Inspect ID 20 (Summary)", f"{BASE_URL}/inspect", {"product_id": 20, "fields": "extend_info", "view": "summary"})
    
    # 3. Inspect (Detail - Highlights)
    res_inspect_detail = run_step("Inspect ID 20 (Detail)", f"{BASE_URL}/inspect", {"product_id": 20, "fields": "extend_info.highlights"})

    md = f"""# 场景四：疑虑粉碎 (Fourth Test - Optimized)

**测试重点**: 快速验证“满期金”是否存在。

## Agent 思考与工具调用

### Step 1: 搜索‘满期金’
**Request**: `search("满期金")`
**Response**:
```json
{format_json(res_search)}
```

### Step 2: 查阅 ID 20 (概览)
**Request**: `inspect(id=20, fields="extend_info", view="summary")`
**Response**:
```json
{format_json(res_inspect_sum)}
```

### Step 3: 查阅 ID 20 (精读)
**Request**: `inspect(id=20, fields="extend_info.highlights")`
**Response**:
```json
{format_json(res_inspect_detail)}
```
"""
    save_report("Scenario 4", "场景4_疑虑粉碎_v4.md", md)

if __name__ == "__main__":
    print("Starting Simulation V4 (Optimized Flow)...")
    run_scenario_1()
    run_scenario_2()
    run_scenario_3()
    run_scenario_4()
    print("\nDone.")
