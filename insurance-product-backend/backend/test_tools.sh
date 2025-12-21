#!/bin/bash

# 测试脚本: 验证新的检索与过滤工具

# 允许通过 INSURANCE_TOOL_BASE_URL 覆盖默认地址，便于自定义端口
BASE_URL="${INSURANCE_TOOL_BASE_URL:-http://localhost:8000/api/tools}"

# URL 编码辅助函数（Bash 原生不支持中文编码）
urlencode() {
  python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$1"
}

# JSON 美化：确保中文不被转义
pretty_json() {
  python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin), ensure_ascii=False, indent=4))"
}

KEYWORD_FRIENDS=$(urlencode "友邦")
KEYWORD_WAITING=$(urlencode "犹豫期")
PRODUCT_TYPE_MAJOR=$(urlencode "重疾险")
INSPECT_PRODUCT_ID=${INSPECT_PRODUCT_ID:-6}
KEYWORD_BONUS=$(urlencode "分红")
KEYWORD_CANCER=$(urlencode "癌症")
KEYWORD_WAIVER=$(urlencode "豁免")

echo "=== 1. 测试增强型搜索 (/api/tools/search) ==="
echo "场景: 搜索关键词 '友邦'，期望返回包含关键词的产品，且带有摘要和评分"
curl -s "$BASE_URL/search?keyword=${KEYWORD_FRIENDS}&limit=2" | pretty_json

echo -e "\n=== 2. 测试 JSON 深度搜索 ==="
echo "场景: 搜索隐藏在 JSON 里的关键词 '犹豫期'"
curl -s "$BASE_URL/search?keyword=${KEYWORD_WAITING}&limit=2" | pretty_json

echo -e "\n=== 3. 扩展字段关键词 - 分红 ==="
echo "场景: 关注分红类条款，验证 extend_info snippet 能否返回相关片段"
curl -s "$BASE_URL/search?keyword=${KEYWORD_BONUS}&limit=3" | pretty_json

echo -e "\n=== 4. 扩展字段关键词 - 癌症 ==="
echo "场景: 关注特定癌症条款，验证 extend_info snippet"
curl -s "$BASE_URL/search?keyword=${KEYWORD_CANCER}&limit=3" | pretty_json

echo -e "\n=== 5. 扩展字段关键词 - 豁免 ==="
echo "场景: 关注保费豁免类条款"
curl -s "$BASE_URL/search?keyword=${KEYWORD_WAIVER}&limit=3" | pretty_json

echo -e "\n=== 6. 测试精准查阅 (/api/tools/inspect) ==="
echo "场景: 查询产品 ID=${INSPECT_PRODUCT_ID}，只看 product_name 和 extend_info 里的 waiting_period"
curl -s "$BASE_URL/inspect?product_id=${INSPECT_PRODUCT_ID}&fields=product_name,extend_info.waiting_period,product_code" | pretty_json

echo -e "\n=== 7. 测试智能过滤 (/api/tools/filter) ==="
echo "场景: 筛选 product_type='重疾险' 的产品"
curl -s "$BASE_URL/filter?product_type=${PRODUCT_TYPE_MAJOR}" | pretty_json

echo -e "\n场景: 筛选适合 30 岁人群的产品 (age_min <= 30 <= age_max)"
# 注意: 这依赖于数据库中有 min_age/max_age 数据，否则可能返回空
curl -s "$BASE_URL/filter?age_min=30" | pretty_json
