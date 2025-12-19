# AI 保险顾问工具设计方案

## 一、业务需求分析

根据你的项目情况，AI Agent 需要能够：
1.  **查询产品基础信息**：查看产品名称、公司、类型、条款等。
2.  **选择性读取条款**：根据用户需求，只读取相关部分（如责任免除、保障范围）。
3.  **对比产品**：比较多个保险产品的关键维度（价格、保障、免赔等）。
4.  **费率计算**：根据用户年龄、性别等条件查询保费。
5.  **适配性分析**：结合用户情况（年龄、职业、健康状况、需求），评估产品是否适合。

## 二、数据库结构梳理

根据你的 PostgreSQL 数据库，主要有两张表：

### 1. `insurance_product` 表
**核心字段：**
*   **基础信息**：`product_name`, `product_code`, `company_name`, `product_type`
*   **核心条款**：
    *   `coverage` (保障范围，数组格式)
    *   `exclusions` (责任免除，数组格式)
    *   `age_range` (投保年龄)
    *   `insurance_period` (保险期间)
    *   `payment_period` (交费期间)
    *   `waiting_period` (等待期)
    *   `cooling_off_period` (犹豫期)
    *   `surrender_terms` (退保说明)
*   **其他信息**：`description`, `tags`, `extend_info` (JSON扩展信息)

### 2. `insurance_rates` 表
**核心字段：**
*   `product_name` (产品名称)
*   `age` (年龄)
*   `gender` (性别)
*   `premium_term` (缴费期限)
*   `health_status` (健康状况)
*   `plan` (计划类型)
*   `premium_value` (费率值)

## 三、工具设计方案

我建议设计以下 **6 个核心工具**，遵循"原子化"和"选择性"原则。

### Tool 1: `insurance_query_products`

**功能**：查询保险产品列表（概览信息）。

**参数：**
```typescript
{
  product_type?: string;      // 产品类型筛选 (如 "医疗险", "重疾险")
  company_name?: string;      // 保险公司筛选
  age?: number;               // 用户年龄（用于匹配 age_range）
  limit?: number;             // 最多返回数量（默认10）
}
```

**返回：**
```json
{
  products: [
    {
      id: 6,
      product_name: "友邦乐运动意外伤害保险",
      product_code: "PCODE_0001",
      company_name: "友邦",
      product_type: "意外险",
      age_range: "三岁至六十四岁",
      tags: ["意外伤害", "运动", "互联网"]
    }
  ],
  count: 1
}
```

**调用 FastAPI**：`GET /api/products`

---

### Tool 2: `insurance_read_clauses`

**功能**：**选择性**读取产品的具体条款内容。

**参数：**
```typescript
{
  product_id: number;         // 产品ID（必填）
  clause_types: string[];     // 要读取的条款类型（数组）
  // 可选值：
  // - "coverage"          保障范围
  // - "exclusions"        责任免除
  // - "age_range"         投保年龄
  // - "insurance_period"  保险期间
  // - "payment_period"    交费期间
  // - "waiting_period"    等待期
  // - "cooling_off"       犹豫期
  // - "surrender"         退保说明
  // - "description"       产品描述
  // - "all"               全部内容
}
```

**返回：**
```json
{
  product_name: "友邦乐运动意外伤害保险",
  clauses: {
    "coverage": ["意外身故保险金", "意外伤残保险金", "..."],
    "exclusions": ["投保人对被保险人的故意杀害", "..."]
  }
}
```

**实现逻辑**：
1.  先调用 `GET /api/products/{product_id}` 获取完整产品数据。
2.  根据 `clause_types` 筛选字段。
3.  只返回用户指定的部分，减少 Token 消耗。

---

### Tool 3: `insurance_compare_products`

**功能**：对比多个产品的核心维度。

**参数：**
```typescript
{
  product_ids: number[];          // 产品ID列表（2-5个）
  compare_dimensions: string[];   // 对比维度
  // 可选值：
  // - "coverage"          保障范围对比
  // - "exclusions"        免责条款对比
  // - "age_range"         投保年龄对比
  // - "payment_period"    缴费期对比
  // - "waiting_period"    等待期对比
  // - "tags"              产品标签对比
}
```

**返回：**
```json
{
  comparison: [
    {
      product_name: "产品A",
      coverage: ["责任1", "责任2"],
      age_range: "18-65岁"
    },
    {
      product_name: "产品B",
      coverage: ["责任1", "责任3", "责任4"],
      age_range: "0-70岁"
    }
  ],
  summary: "产品B的保障范围更广，且投保年龄范围更大，适合不同年龄段的用户。"
}
```

**实现逻辑**：
批量查询产品详情，按照指定维度提取并组织为对比表格。

---

### Tool 4: `insurance_calculate_premium`

**功能**：计算用户的保费。

**参数：**
```typescript
{
  product_name: string;      // 产品名称
  age: number;               // 年龄
  gender: string;            // 性别 ("男" | "女")
  premium_term: number;      // 缴费期限（年）
  health_status?: string;    // 健康状况（默认 "standard"）
  plan?: string;             // 计划类型（可选）
  coverage_amount?: number;  // 保额（默认100000）
}
```

**返回：**
```json
{
  annual_premium: 2500.00,    // 年保费
  total_premium: 50000.00,    // 总保费（年保费 × 缴费期）
  premium_rate: 25.00,        // 费率
  payment_frequency: "年交"
}
```

**调用 FastAPI**：`POST /api/rates/calculate`

---

### Tool 5: `insurance_check_eligibility`

**功能**：检查用户是否符合产品投保条件（适配性初筛）。

**参数：**
```typescript
{
  product_id: number;        // 产品ID
  user_age: number;          // 用户年龄
  user_health?: string;      // 用户健康状况（可选）
  user_occupation?: string;  // 用户职业（可选）
}
```

**返回：**
```json
{
  eligible: true,              // 是否符合
  reasons: [
    "✅ 年龄在投保范围内（18-65岁）",
    "⚠️ 需确认是否从事高风险职业（如矿工、爆破工等）"
  ],
  recommendations: "建议补充职业信息以获得更精准的评估。"
}
```

**实现逻辑**：
1.  读取产品的 `age_range`, `exclusions`。
2.  解析年龄范围（如 "18周岁至65周岁"）。
3.  根据免责条款中的职业限制、健康要求等，给出初步判断。

---

### Tool 6: `insurance_recommend`

**功能**：根据用户需求推荐产品（智能匹配）。

**参数：**
```typescript
{
  user_age: number;                     // 用户年龄
  user_gender: string;                  // 用户性别
  budget?: number;                      // 预算（年保费）
  needs: string[];                      // 用户需求关键词
  // 可选值：
  // - "意外保障"
  // - "重疾保障"
  // - "医疗报销"
  // - "养老储蓄"
  // - "子女教育"
  // - "身故保障"
  priority: "price" | "coverage" | "comprehensive";  // 优先级
}
```

**返回：**
```json
{
  recommendations: [
    {
      product_id: 6,
      product_name: "友邦乐运动意外伤害保险",
      match_score: 95,
      reasons: [
        "完全符合年龄要求（18-64岁）",
        "保费预算内（年保费约1200元）",
        "含意外身故、伤残及猝死保障，符合需求"
      ],
      estimated_premium: 1200
    }
  ]
}
```

**实现逻辑**：
1.  根据 `needs` 筛选产品类型（意外险、重疾险等）。
2.  调用 `insurance_calculate_premium` 计算保费，筛选预算内产品。
3.  根据 `priority` 排序（价格优先、保障全面优先等）。

---

## 四、调用流程示例

**场景**：用户询问"30岁男性，想要意外险，预算2000元以内"

### Step 1: Agent 调用 `insurance_recommend`
```json
{
  "user_age": 30,
  "user_gender": "男",
  "budget": 2000,
  "needs": ["意外保障"],
  "priority": "price"
}
```

### Step 2: Agent 获取推荐结果
```json
{
  "recommendations": [
    {"product_id": 6, "product_name": "友邦乐运动", "match_score": 95}
  ]
}
```

### Step 3: Agent 调用 `insurance_read_clauses` 查看细节
```json
{
  "product_id": 6,
  "clause_types": ["coverage", "exclusions"]
}
```

### Step 4: Agent 向用户展示并解读
> "我为您推荐**友邦乐运动意外伤害保险**。它包含意外身故、伤残及猝死保障，适合您的需求。年保费约1200元，在您的预算内。需要注意的是，它不保障高风险运动（如跳伞、攀岩），如果您有此类爱好，需考虑其他产品。"

---

## 五、技术实现建议

### 1. 工具与 FastAPI 的集成

在 Tool 的 `execute` 函数中，通过 `ctx.userToken` 携带认证信息，调用后端 API：

```typescript
async execute(args, ctx: ToolContext) {
  const response = await fetch('http://localhost:8000/api/products', {
    headers: {
      'Authorization': `Bearer ${ctx.userToken}`
    }
  });
  const data = await response.json();
  return data;
}
```

### 2. 数据解析优化

对于数组格式的字段（如 `coverage`, `exclusions`），在 Python 中存储为 JSON 数组字符串时，记得使用 `json.loads()` 解析后再返回给 Agent，避免 Agent 收到嵌套的字符串。

### 3. Prompt 优化

在 Agent 的 `systemPrompt` 中加入保险领域知识：
```markdown
## 保险专业术语
- 等待期：保险生效后，一段时间内发生保险事故不赔付。
- 犹豫期：购买保险后的冷静期，期间可无条件退保。
- 责任免除：保险公司明确不承担的情况。
```

---

## 六、总结

这套工具设计的核心原则是：
1.  **原子化**：每个工具职责单一，便于组合调用。
2.  **选择性**：避免一次性返回所有数据，减少 Token 浪费。
3.  **可解释性**：工具返回的结果包含推理依据（如 `reasons`），便于 Agent 向用户解释。

你可以先实现前 4 个基础工具，然后在使用中逐步完善第 5、6 个智能工具。
