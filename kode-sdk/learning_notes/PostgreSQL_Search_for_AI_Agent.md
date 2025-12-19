# PostgreSQL 关键词搜索与 AI 检索工具设计学习笔记

## 1. 背景：为什么 AI 需要“检索工具”？

在 Gemini 的设计（`ADVANCED_INSURANCE_AGENT_DESIGN.md`）中，提到了 `insurance_search_text` 工具。设计这个工具的核心目的是：

1.  **减少上下文（Context）占用**：不要把几百个产品的条款全部塞给 AI。AI 的上下文窗口是昂贵的且有限的。
2.  **按需获取**：当用户问“有没有保猝死的产品？”时，AI 只需要通过关键词拿到相关的 2-3 个产品，而不是遍历整个数据库。
3.  **精准定位**：让 AI 像使用搜索引擎一样，先检索，再阅读。

## 2. PostgreSQL 实现关键词搜索的三种方案

针对保险条款（包含大量中文文本）的搜索，PostgreSQL 提供了由浅入深的几种方案。

### 方案一：基础模糊查询 (`LIKE`)

这是最直观的实现方式，适合数据量较小（几千条以内）的场景。

**SQL 实现：**
```sql
-- 搜索名称或描述中包含“猝死”的产品
SELECT id, product_name, description 
FROM insurance_product 
WHERE product_name LIKE '%猝死%' 
   OR description LIKE '%猝死%';
```

*   **优点**：不需要任何插件，语法简单，绝对匹配（包含字就能搜到）。
*   **缺点**：性能随着数据量增加而急剧下降；标准的 B-tree 索引对 `%keyword%` 这种两边带 `%` 的查询无效。

### 方案二：进阶模糊搜索 (`pg_trgm` 扩展) —— 🚀 推荐

PostgreSQL 自带一个强大的扩展叫 `pg_trgm` (Trigram，三元组)，它能极大地加速 `LIKE` 查询，并支持相似度排序。这对中文模糊搜索非常有效。

**1. 开启扩展（只需执行一次）：**
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

**2. 创建索引（使用 GIN 索引）：**
```sql
-- 对 description 字段创建 GIN 索引，加速模糊查询
CREATE INDEX idx_insurance_desc_trgm ON insurance_product USING GIN (description gin_trgm_ops);
```

**3. 执行查询：**
```sql
-- 依旧使用 LIKE，但现在它会走索引，速度飞快
SELECT id, product_name 
FROM insurance_product 
WHERE description LIKE '%牙科%';
```

*   **优点**：**配置简单，无需配置复杂的中文分词器**，性能优秀，完美支持中文模糊匹配。
*   **适用场景**：用户输入不精准的关键词，或者单纯的子串匹配。

### 方案三：专业全文检索 (Full Text Search)

这是 PostgreSQL 最硬核的搜索功能，类似于 ElasticSearch 的轻量版。它引入了两个核心概念：
*   `tsvector`: 把文档拆分成带位置信息的词条（Document）。
*   `tsquery`: 把用户的搜索词处理成查询条件（Query）。

**1. 基础查询（默认按空格分词，中文需特殊处理）：**
```sql
-- simple 配置不进行词形转换，直接匹配
SELECT product_name 
FROM insurance_product 
WHERE to_tsvector('simple', product_name) @@ to_tsquery('simple', '重疾');
```

**2. 中文分词痛点：**
PG 默认不支持中文分词（它不知道“保险”是“保+险”还是一个词）。要完美实现，通常需要安装 `zhparser` 或 `jieba` 插件。
如果你无法安装插件，**方案二 (`pg_trgm`) 是处理中文的最佳替代方案**。

## 3. AI 工具封装设计 (`insurance_search_text`)

基于 **方案二 (`pg_trgm`)**，我们可以实现 Gemini 建议的工具。

### 工具定义 (Function Calling)

```json
{
  "name": "insurance_search_text",
  "description": "在保险产品库中搜索包含特定关键词的产品。当用户询问特定保障（如'猝死'、'牙科'）时使用。",
  "parameters": {
    "type": "object",
    "properties": {
      "keyword": {
        "type": "string",
        "description": "搜索关键词，如 '猝死', '高风险运动'"
      },
      "limit": {
        "type": "integer",
        "description": "返回的最大数量，默认为 5",
        "default": 5
      }
    },
    "required": ["keyword"]
  }
}
```

### 后端实现逻辑 (Python/FastAPI)

```python
@app.get("/api/tools/search")
def search_products(keyword: str, limit: int = 5):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # 使用 ILIKE 进行不区分大小写的模糊匹配
    # 配合 pg_trgm 索引，这里会非常快
    sql = """
        SELECT id, product_name, product_code, description
        FROM insurance_product
        WHERE product_name ILIKE %s 
           OR description ILIKE %s
           OR extend_info::text ILIKE %s  -- 甚至可以搜索 JSON 字段
        LIMIT %s
    """
    
    search_pattern = f"%{keyword}%"
    cursor.execute(sql, (search_pattern, search_pattern, search_pattern, limit))
    results = cursor.fetchall()
    
    return {
        "tool_response": results,
        "count": len(results)
    }
```

## 4. 总结与建议

1.  **起步**：直接使用 **SQL `LIKE` + `pg_trgm` 索引**。这是性价比最高的方案，既解决了性能问题，又避免了复杂的中文分词配置。
2.  **JSON 搜索**：PostgreSQL 允许将 JSONB 转为 text 进行搜索 (`extend_info::text ILIKE ...`)，这让 AI 能够搜到深埋在 JSON 配置里的细节（比如某个特殊的等待期规定）。
3.  **AI 策略**：告诉 AI，如果搜索结果过多，尝试添加更多限制词；如果搜不到，尝试精简关键词。
