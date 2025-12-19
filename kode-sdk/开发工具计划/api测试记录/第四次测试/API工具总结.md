# API 工具能力总结 (基于第四次测试)

本次测试验证了 Agent 核心调用的三大工具接口。以下是各工具的详细能力说明：

## 1. 筛选工具 (Filter)
**接口**: `GET /api/tools/filter`
**功能**: 基于硬性条件（如年龄、险种类型）的精确过滤。

*   **参数**:
    *   `age_min` (int): 最小年龄 (例如 30)
    *   `age_max` (int): 最大年龄
    *   `product_type` (str): 险种类型 (精确匹配，如 "定期寿险", "意外险")
*   **优化特性**:
    *   **智能年龄解析**: 后端会自动解析数据库中 `"18-60周岁"` 这样的字符串格式，与传入的数字进行比较。
    *   **兜底机制**: 先全量提取再 Python 过滤，确保复杂的中文年龄描述不会导致数据库查询遗漏。

## 2. 搜索工具 (Search)
**接口**: `GET /api/tools/search`
**功能**: 基于关键词的模糊/语义检索。

*   **参数**:
    *   `keyword` (str): 搜索关键词 (如 "猝死", "高端医疗", "满期金")
    *   `limit` (int): 返回结果数量限制 (默认 5)
*   **匹配逻辑**:
    *   扫描 `product_name` (权重最高)
    *   扫描 `description`
    *   扫描 `extend_info` (JSON 字符串全文检索)
*   **返回**: 包含匹配分数 (`score`) 和匹配片段 (`matches`)。

## 3. 查阅工具 (Inspect) - *核心优化*
**接口**: `GET /api/tools/inspect`
**功能**: 获取特定产品的详细字段信息，支持结构化解析和按需加载。

*   **参数详解**:
    *   `product_id` (int): 目标产品的唯一 ID。
    *   `fields` (str): **逗号分隔的字段列表**。
        *   **基础字段**: `id`, `product_name`, `product_type`, `age_range`, `description`
        *   **复杂字段**: `coverage` (保障条款), `extend_info` (扩展信息), `product_code`
        *   **[高级] 嵌套提取**: 支持点号 `.` 提取 JSON 内部字段。
            *   例: `coverage.猝死保险金` (直接获取某一条款)
            *   例: `extend_info.highlights` (直接获取产品亮点)
    *   `view` (str): **返回内容的详细程度**，控制 Token 消耗。
        *   `full` (**默认**): 返回字段的**完整内容**。适用于确切知道要看什么，或者字段内容很少时。
        *   `summary` (**概览模式**): 对于字典/JSON类型的长字段（如 `coverage`, `extend_info`），**仅返回 Keys (目录)**。
            *   *效果*: `{"coverage": "..."}` 变为 `{"coverage_keys": ["条款A", "条款B"]}`。
            *   *用途*: Agent 在不确定内容时先看目录（Peek），再决定是否精读（Read），极大节省上下文。
*   **三大优化特性**:
    1.  **数据结构化 (Structured Data)**:
        *   将数据库中存储为 String 的 `coverage` 字段自动解析为 JSON Object。
        *   例: 原始字符串 `"猝死: 赔付..."` -> 解析为 `{"猝死": "赔付..."}`。
    2.  **按需概览 (Lazy Loading)**:
        *   使用 `view=summary` 时，对于重型字典字段（如 `coverage`, `extend_info`），只返回 **Keys**。
        *   例: `{"coverage_keys": ["猝死保险金", "意外身故"]}`，不返回具体条款内容的几千字。
        *   **价值**: 极大降低 Token 消耗，让 Agent 先看目录再看内容。
    3.  **精准提取 (Dot Notation)**:
        *   支持直接请求子字段。
        *   例 `fields=coverage.猝死保险金` -> 后端只提取并返回这一条内容。

---

## 4. 实战交互示例 (Interactive Examples)

以下展示 Agent 如何使用这些参数组合来高效获取信息。

### 场景 A：Agent 刚搜到产品，想看看有什么保障 (Peek)
**目的**：只看“菜单”，不加载全文，节省 Token。
**Request**:
```http
GET /api/tools/inspect?product_id=40&fields=coverage&view=summary
```
**Response**:
```json
{
  "coverage_keys": [
    "意外身故保险金",
    "猝死保险金",       <-- Agent 此时看到了感兴趣的 key
    "意外骨折医疗"
  ]
}
```

### 场景 B：Agent 发现用户关心“猝死”，想看具体条款 (Read)
**目的**：精准提取某一条款，不看其他无关内容。
**Request**:
```http
GET /api/tools/inspect?product_id=40&fields=coverage.猝死保险金
```
**Response**:
```json
{
  "coverage": {
    "猝死保险金": "在保险合同有效期内，若被保险人发生猝死，则赔付..."
  }
}
```

### 场景 C：Agent 想要对比两款产品的等待期 (Nested Extraction)
**目的**：直接挖掘嵌套在 JSON 里的特定字段。
**Request**:
```http
GET /api/tools/inspect?product_id=33&fields=extend_info.waiting_period
```
**Response**:
```json
{
  "extend_info.waiting_period": "90天"
}
```

---

## 5. Agent 如何知道有哪些字段？ (Field Discovery)

这是一个非常好的问题。Agent 对字段的认知分为两层：

### 第一层：静态认知 (通过 Tool Definition)
在系统提示词（System Prompt）中，我们会告诉 Agent 顶层只有这几个**固定字段**。因为数量很少（仅 5-6 个），完全可以写死在 Prompt 里：
*   `product_name`: 产品名
*   `product_type`: 险种类型
*   `age_range`: 投保年龄
*   `description`: 简介
*   `coverage`: 条款细则 (Map)
*   `extend_info`: 扩展信息 (Map)

### 第二层：动态发现 (通过 Summary View)
对于 `coverage` 和 `extend_info` 内部千变万化的 Key（比如“猝死”还是“突发性心脏病”），Agent **不需要提前知道**。
**工作流**：
1.  Agent 知道有 `coverage` (来自 Tool Definition)。
2.  Agent 问：`inspect(fields="coverage", view="summary")`。
3.  API 回答：`["猝死保险金", "意外身故"]`。
4.  Agent **此时才知道**原来这里叫 "猝死保险金"，于是发起下一步查询。

**结论**：
*   **顶层字段**：很少，直接写在工具描述里。
*   **深层字段**：无限多，靠 `summary` 模式动态探索。这个机制完美解决了“字段太多记不住”的问题。

---

## 6. 核心字段深度解析 (Deep Dive)

您问得非常准，这两个字段确实是**高度动态**的，它们的内容结构会随着**险种类型**（重疾、医疗、意外）而剧烈变化。

### 6.1 `coverage` (保障责任) — "保什么？"
这是一个 **Map <保障项名称, 条款细则>** 结构。它直接对应保险合同里的“保险责任”章节。
*   **内容**: 具体的赔付触发条件和定义。
*   **示例 (意外险)**:
    ```json
    {
      "猝死保险金": "若被保险人发生猝死，给付...",
      "意外骨折医疗": "因意外导致骨折，按比例赔付..."
    }
    ```
*   **示例 (医疗险)**:
    ```json
    {
      "一般门急诊": "等待期后，门急诊费用..."
    }
    ```

### 6.2 `extend_info` (扩展信息) — "怎么赔 & 多少钱？"
这是一个其大无比的 **“杂物箱” (JSON Object)**，存放所有**结构化、可视化**所需的元数据。它的 Key 会根据险种不同而完全不同。

**通用字段**:
*   `highlights` (List): 产品亮点标签（如“最高保额”、“等待期”）。
*   `table_data` (Object): 费率表或利益演示表数据。
*   `theme_color` (String): UI 渲染用的主题色。

**特有字段 (Polymorphic)**:
*   **重疾险 (`illness_features`)**: 包含轻/中/重症的分组列表、赔付比例。
*   **医疗险 (`medical_features`)**: 包含免赔额、报销比例、就医范围。
*   **寿险 (`life_features`)**: 包含现金价值表、减保规则。

**Agent 策略**:
正是因为 `extend_info` 太杂太深，Agent **必须**结合 `view=summary` 先看它里面有什么（比如是 `medical_features` 还是 `life_features`），然后再决定去挖哪个细节。

---

## 7. 关于字段语义的补充 (Key Semantics)

您敏锐地指出了一个关键点：**Agent 拿到 Key 之后，怎么知道这个 Key 是干嘛的？**

目前的设计采用了 **"语义化命名 (Semantic Naming)"** 策略，即变量名本身就是描述。

*   **现状**:
    *   API 返回: `["illness_features", "waiting_period"]`
    *   Agent 推理: "`illness_features` 肯定是病种相关，`waiting_period` 肯定是等待期。"
*   **您的建议 (更高级的形态)**:
    *   理想返回: `[{"key": "illness_features", "desc": "病种列表及赔付规则"}, ...]`
    *   **现状说明**: 目前为了追求极致的 Token 节省和工程简单性，我们暂未实现“自带描述”。我们依赖 Agent 强大的自然语言理解能力去“望文生义”。事实证明，对于标准化的保险字段（如 `deductible`, `quota`），大模型完全能理解。
