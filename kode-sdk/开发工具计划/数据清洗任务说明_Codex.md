# 数据清洗任务说明书 (致 Codex)

**任务目标**: 将 `insurance_product` 表中 `coverage` 字段的“非结构化文本列表”清洗为“结构化 Key-Value JSON”。

## 1. 数据现状 (Input)
目前 `coverage` 字段存储的是一个 JSON 字符串数组，每一项都是 **"标题：内容"** 混合的长文本。
**示例 (Raw Data)**:
```json
[
  "• 意外身故保险金：在保险合同有效期内，若被保险人身故...",
  "• 猝死保险金：若被保险人发生猝死，则本公司给付..."
]
```

## 2. 目标格式 (Output)
我们需要将其转换为 **Key-Value 对象**，Key 是条款名称，Value 是具体的保障内容。
**示例 (Target Data)**:
```json
{
  "意外身故保险金": "在保险合同有效期内，若被保险人身故...",
  "猝死保险金": "若被保险人发生猝死，则本公司给付..."
}
```

## 3. 清洗逻辑 (Logic)
1.  **遍历**数组中的每一项字符串。
2.  **去噪**：去除开头的圆点 `•` 或空格。
3.  **分割**：找到第一个中文冒号 `：` 或英文冒号 `:`。
    *   **Before Colon** ->  `Key` (条款名)
    *   **After Colon** -> `Value` (保障内容)
4.  **异常处理**：如果找不到冒号，则将整个字符串放入一个默认 Key (如 `extra`) 或保留原样。

## 4. 作业脚本模板 (Python)
请基于以下模板编写 ETL 脚本：

```python
import json
import re

def parse_coverage(raw_coverage_json):
    """
    将 coverage 列表转换为 KV 字典
    """
    if not raw_coverage_json:
        return {}
    
    try:
        items = json.loads(raw_coverage_json)
        structured_data = {}
        
        for item in items:
            # 1. 清理开头符号
            clean_text = re.sub(r'^[•\-\s]+', '', item)
            
            # 2. 分割标题和内容
            match = re.search(r'[:：]', clean_text)
            if match:
                key = clean_text[:match.start()].strip()
                value = clean_text[match.end():].strip()
                structured_data[key] = value
            else:
                # 3. [进阶] 语义提取 (既然没有冒号，尝试从内容里提取核心名词)
                # 规则：通常会写 "则给付xxx保险金" -> Key = "xxx保险金"
                semantic_match = re.search(r'给付(.+?)(金|费)(?=[，。])', clean_text)
                if semantic_match:
                    # 提取出来的作为 Key，比如 "身故保险金"
                    extracted_key = semantic_match.group(1) + semantic_match.group(2)
                    structured_data[extracted_key] = clean_text
                else:
                    # 实在提取不到，才用 clause_N 兜底
                    structured_data[f"clause_{len(structured_data)+1}"] = clean_text

                
        return structured_data
        
    except Exception as e:
        print(f"Parsing error: {e}")
        return {"raw": raw_coverage_json}

# 测试用例
raw = '["• 猝死保险金：赔付100万", "• 意外医疗：报销"]'
print(json.dumps(parse_coverage(raw), ensure_ascii=False, indent=2))
# Expect:
# {
#   "猝死保险金": "赔付100万",
#   "意外医疗": "报销"
# }
```

## 5. 执行要求
1.  请在 `backend` 目录下创建 `etl_coverage_clean.py`。
2.  读取数据库，批量处理，将结果更新回数据库（建议新建一个 `coverage_structured` 字段或直接覆盖，**需先备份**）。
