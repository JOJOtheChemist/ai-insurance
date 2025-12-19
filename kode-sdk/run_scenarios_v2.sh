#!/bin/bash

# Define output directory
OUTPUT_DIR="开发工具计划/测试记录/第二次测试"
mkdir -p "$OUTPUT_DIR"

BASE_URL="http://localhost:8000/api/tools"

echo "==========================================="
echo "  Running Scenario Tests (Optimized API)"
echo "==========================================="
echo "Output Directory: $OUTPUT_DIR"
echo ""

# ==========================================
# Scenario 1: 30 Year Old Programmer (Filter & Coverage)
# ==========================================
echo "--- Scenario 1: 30yo Programmer ---"

# Step 1: Filter (Expecting results now due to structured data)
echo "1.1 Filter (age_min=30)..."
curl -s -G "$BASE_URL/filter" \
  --data-urlencode "age_min=30" \
  --data-urlencode "product_type=定期寿险" \
  > "$OUTPUT_DIR/1_01_filter_age30.json"

# Step 2: Search Period Life
echo "1.2 Search '定期寿险'..."
curl -s -G "$BASE_URL/search" \
  --data-urlencode "keyword=定期寿险" \
  --data-urlencode "limit=3" \
  > "$OUTPUT_DIR/1_02_search_dingqi.json"

# Step 3: Search Sudden Death
echo "1.3 Search '猝死'..."
curl -s -G "$BASE_URL/search" \
  --data-urlencode "keyword=猝死" \
  --data-urlencode "limit=3" \
  > "$OUTPUT_DIR/1_03_search_sudden_death.json"

# Step 4: Inspect ID 40 (Verify coverage structure)
# NOTE: Asking for 'coverage' field explicitly as per optimization feedback
echo "1.4 Inspect ID 40 (Requesting coverage)..."
curl -s -G "$BASE_URL/inspect" \
  --data-urlencode "product_id=40" \
  --data-urlencode "fields=product_name,extend_info,coverage" \
  > "$OUTPUT_DIR/1_04_inspect_id40_coverage.json"

echo "Scenario 1 Done."
echo ""

# ==========================================
# Scenario 2: Family Configuration
# ==========================================
echo "--- Scenario 2: Family Config ---"

# Step 1: Search Child High-End Medical
echo "2.1 Search '高端医疗'..."
curl -s -G "$BASE_URL/search" \
  --data-urlencode "keyword=高端医疗" \
  --data-urlencode "limit=3" \
  > "$OUTPUT_DIR/2_01_search_high_end_med.json"

# Step 2: Search Elder Medical
echo "2.2 Search '医疗险'..."
curl -s -G "$BASE_URL/search" \
  --data-urlencode "keyword=医疗险" \
  --data-urlencode "limit=3" \
  > "$OUTPUT_DIR/2_02_search_medical.json"

echo "Scenario 2 Done."
echo ""

# ==========================================
# Scenario 3: Product Comparison
# ==========================================
echo "--- Scenario 3: Product Compare ---"

# Step 1: Search Critical Illness
echo "3.1 Search '重疾险'..."
curl -s -G "$BASE_URL/search" \
  --data-urlencode "keyword=重疾险" \
  --data-urlencode "limit=3" \
  > "$OUTPUT_DIR/3_01_search_critical.json"

# Step 2: Inspect ID 33 (Shunxin) - Assuming ID from previous results/markdown
echo "3.2 Inspect ID 33..."
curl -s -G "$BASE_URL/inspect" \
  --data-urlencode "product_id=33" \
  --data-urlencode "fields=product_name,extend_info,coverage" \
  > "$OUTPUT_DIR/3_02_inspect_id33.json"

# Step 3: Inspect ID 28 (BeiRuyi) - As typically found in search
echo "3.3 Inspect ID 28..."
curl -s -G "$BASE_URL/inspect" \
  --data-urlencode "product_id=28" \
  --data-urlencode "fields=product_name,extend_info,coverage" \
  > "$OUTPUT_DIR/3_03_inspect_id28.json"

echo "Scenario 3 Done."
echo ""

# ==========================================
# Scenario 4: Doubt Crushing uses Search
# ==========================================
echo "--- Scenario 4: Doubt Crushing ---"

# Step 1: Search 'Manqijin' (Return of Premium)
echo "4.1 Search '满期金'..."
curl -s -G "$BASE_URL/search" \
  --data-urlencode "keyword=满期金" \
  --data-urlencode "limit=2" \
  > "$OUTPUT_DIR/4_01_search_manqijin.json"

echo "Scenario 4 Done."
echo ""

echo "All tests completed. Check '$OUTPUT_DIR' for results."
