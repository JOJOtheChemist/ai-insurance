import requests
import json
import os
import time

# Configuration
BASE_URL = "http://localhost:8000/api/tools"
REPORT_DIR = "开发工具计划/测试记录/第五次测试"
os.makedirs(REPORT_DIR, exist_ok=True)

def save_report(scenario_name, filename, content):
    filepath = os.path.join(REPORT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved report: {filepath}")

def run_step(step_name, url, params=None):
    print(f"  > Running {step_name}...")
    try:
        start_time = time.time()
        resp = requests.get(url, params=params)
        duration = time.time() - start_time
        resp.raise_for_status()
        data = resp.json()
        print(f"    [OK] {duration:.2f}s")
        return data
    except Exception as e:
        print(f"    [ERROR] {e}")
        return {"error": str(e)}

def format_json(data):
    return json.dumps(data, indent=2, ensure_ascii=False)

# ==========================================
# Scenario 1: Coverage Search (Hidden Terms)
# ==========================================
def run_scenario_1():
    print("\n--- Scenario 1: Searching for 'Dental/Eye' (Coverage) ---")
    # "眼科" (Ophthalmology) is likely in specific medical coverage, not title
    keyword = "眼科"
    
    # 1. Search
    res_search = run_step(f"Search '{keyword}'", f"{BASE_URL}/search", {"keyword": keyword})
    
    # 2. Inspect the winner (Verification)
    winner_id = res_search['products'][0]['id'] if res_search.get('products') else 0
    res_inspect = {}
    if winner_id:
        res_inspect = run_step("Inspect Winner (Summary)", f"{BASE_URL}/inspect", {"product_id": winner_id, "fields": "coverage,extend_info", "view": "summary"})

    md = f"""# 场景一：深度条款搜索测试 (Fifth Test)

**测试目标**: 验证搜索工具能否命中藏在 `coverage` 或 `extend_info` 深处的关键词。
**关键词**: "{keyword}" (通常不在标题里)

## Agent 交互过程

### Step 1: 搜索 "{keyword}"
**Request**: `search(keyword="{keyword}")`
**Response**:
```json
{format_json(res_search)}
```

### Step 2: 验证结果
Agent 检查搜索到的第一个产品 (ID: {winner_id}) 的概览。
**Request**: `inspect(id={winner_id}, view="summary")`
**Response**:
```json
{format_json(res_inspect)}
```
"""
    save_report("Scenario 1", "场景1_深度搜索_眼科_v5.md", md)

# ==========================================
# Scenario 2: Disease List Search (Extend Info)
# ==========================================
def run_scenario_2():
    print("\n--- Scenario 2: Searching for Specific Disease (ExtendInfo) ---")
    # "阿尔茨海默" (Alzheimer's) is usually in the disease list in extend_info
    keyword = "阿尔茨海默"
    
    # 1. Search
    res_search = run_step(f"Search '{keyword}'", f"{BASE_URL}/search", {"keyword": keyword})
    
    md = f"""# 场景二：特定病种搜索测试 (Fifth Test)

**测试目标**: 验证搜索工具能否命中 `extend_info` 大JSON字段里的特定病种。
**关键词**: "{keyword}" (深层嵌套主要病种)

## Agent 交互过程

### Step 1: 搜索 "{keyword}"
**Request**: `search(keyword="{keyword}")`
**Response**:
```json
{format_json(res_search)}
```
> **预期结果**: 系统应该返回重疾险产品，并在 `matches.extend_info` 中高亮显示命中片段。
"""
    save_report("Scenario 2", "场景2_病种搜索_阿尔茨海默_v5.md", md)

# ==========================================
# Scenario 3: Progressive Refinement
# ==========================================
def run_scenario_3():
    print("\n--- Scenario 3: Progressive Search (Accident -> Sudden Death) ---")
    
    # 1. Broad Search
    res_broad = run_step("Search '意外' (Accident)", f"{BASE_URL}/search", {"keyword": "意外", "limit": 2})
    
    # 2. Refined Search
    res_specific = run_step("Search '猝死' (Sudden Death)", f"{BASE_URL}/search", {"keyword": "猝死", "limit": 2})

    md = f"""# 场景三：递进式搜索测试 (Fifth Test)

**测试目标**: 模拟用户从“泛需求”到“精确需求”的搜索过程。

## Agent 交互过程

### Step 1: 泛搜索 "意外"
用户: "我想看点意外险。"
**Request**: `search("意外")`
**Response**:
```json
{format_json(res_broad)}
```

### Step 2: 精确搜索 "猝死"
用户: "管不管猝死啊？" (Agent 此时发起精确搜索)
**Request**: `search("猝死")`
**Response**:
```json
{format_json(res_specific)}
```
> **观察**: 对比两次搜索结果的 `score` 和排序，精确搜索应该让包含“猝死”的产品排位更靠前 (或者 Score 更高)。
"""
    save_report("Scenario 3", "场景3_递进搜索_意外vs猝死_v5.md", md)

# ==========================================
# Scenario 4: Long Tail Query
# ==========================================
def run_scenario_4():
    print("\n--- Scenario 4: Long Tail / Specific Term ---")
    keyword = "门急诊" # Outpatient
    
    res = run_step(f"Search '{keyword}'", f"{BASE_URL}/search", {"keyword": keyword})

    md = f"""# 场景四：长尾需求搜索 (Fifth Test)

**测试目标**: 验证对于 "门急诊" 这种特定保障的搜索能力。

## Agent 交互过程

### Step 1: 搜索 "{keyword}"
**Request**: `search("{keyword}")`
**Response**:
```json
{format_json(res)}
```
"""
    save_report("Scenario 4", "场景4_长尾搜索_门急诊_v5.md", md)


if __name__ == "__main__":
    print("Starting Simulation V5 (Advanced Search)...")
    run_scenario_1()
    run_scenario_2()
    run_scenario_3()
    run_scenario_4()
    print("\nDone.")
