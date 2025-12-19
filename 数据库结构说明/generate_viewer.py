
import json
import re

# 1. Read the input JSON file
input_path = '/Users/yeya/Documents/HBuilderProjects/ai保典-迁移/后端链接/数据库结构说明/保险产品数据/insurance_product.json'
try:
    with open(input_path, 'r', encoding='utf-8') as f:
        # The file content might be a list of JSON objects or a single JSON array
        # Based on the read output, it looks like a standard JSON array "[\n  {...},\n  {...}\n]"
        # However, the previous `read_files` output showed `1|[{"id": 6, ...` so it is a valid JSON list.
        raw_data = json.load(f)
except Exception as e:
    print(f"Error reading JSON: {e}")
    # Fallback to a smaller mock set if file reading fails (should not happen in this env)
    raw_data = []

# 2. Helper functions
def clean_list_string(list_str):
    """Parses "['Item 1', 'Item 2']" string into a real list."""
    if not list_str:
        return []
    # Remove outer brackets and quotes
    content = list_str.strip("[]")
    # Split by "', '" or '", "'
    # This is a simple regex split, might need refinement for edge cases
    items = re.split(r"',\s*'", content)
    # Clean up leading/trailing quotes of the first/last items
    cleaned_items = []
    for item in items:
        item = item.strip("'\"")
        if item:
            cleaned_items.append(item)
    return cleaned_items

def get_theme_color(p_type):
    if '医疗' in p_type: return '#D31145' # AIA Red
    if '意外' in p_type: return '#4682B4' # Steel Blue
    if '年金' in p_type or '分红' in p_type: return '#DAA520' # Golden Rod
    if '重疾' in p_type or '疾病' in p_type: return '#2E8B57' # Sea Green
    if '寿险' in p_type: return '#4B0082' # Indigo
    return '#1A1A1A' # Default Black

def get_icon(text):
    if '身故' in text or '寿险' in text: return '⚱️'
    if '残' in text: return '♿'
    if '住院' in text or '医疗' in text: return '🏥'
    if '药' in text: return '💊'
    if '门诊' in text: return '👨‍⚕️'
    if '重疾' in text or '癌症' in text or '肿瘤' in text: return '🦠'
    if '意外' in text or '交通' in text: return '✈️'
    if '年金' in text or '钱' in text or '红利' in text: return '💰'
    if '满期' in text: return '🎁'
    if '豁免' in text: return '🆓'
    return '🛡️'

# 3. Helper function to normalize age range
def chinese_number_to_arabic(text):
    """Convert Chinese numbers to Arabic numbers"""
    cn_nums = {
        '零': '0', '一': '1', '二': '2', '三': '3', '四': '4',
        '五': '5', '六': '6', '七': '7', '八': '8', '九': '9',
        '十': '10'
    }
    
    # Handle special cases like "十八" (18), "二十" (20), "三十五" (35)
    if '十' in text:
        parts = text.split('十')
        if len(parts) == 2:
            tens = parts[0]
            ones = parts[1]
            
            # Handle "十X" (10-19)
            if not tens:
                return str(10 + int(cn_nums.get(ones, '0')))
            # Handle "X十" (20, 30, etc.)
            elif not ones:
                return str(int(cn_nums.get(tens, '1')) * 10)
            # Handle "X十Y" (21, 35, etc.)
            else:
                return str(int(cn_nums.get(tens, '1')) * 10 + int(cn_nums.get(ones, '0')))
    
    # Simple single character number
    return cn_nums.get(text, text)

def normalize_age_range(age_str):
    """Normalize age range to concise format like '0-70岁' or '男18-45岁 女18-50岁'"""
    if not age_str:
        return '详见条款'
    
    # Replace common variations
    age_str = age_str.strip()
    
    # Convert Chinese numbers to Arabic (like "三岁" -> "3岁")
    # Pattern: "三岁至六十四岁"
    import re
    cn_pattern = r'([零一二三四五六七八九十]+)岁'
    def replace_cn_age(match):
        cn_num = match.group(1)
        arabic = chinese_number_to_arabic(cn_num)
        return f"{arabic}岁"
    
    age_str = re.sub(cn_pattern, replace_cn_age, age_str)
    
    # Pattern 1: "出生满X日至XX岁" or "出生满X日至XX周岁"
    if '出生满' in age_str:
        # Extract the ending age
        match = re.search(r'至[\s]*(\d+)[\s]*[岁周]', age_str)
        if match:
            return f"0-{match.group(1)}岁"
    
    # Pattern 2: "XX周岁至XX周岁" -> "XX-XX岁"
    age_str = age_str.replace('周岁', '岁').replace('週歲', '岁')
    
    # Pattern 3: Handle gender-specific ages like "男性18-45岁，女性18-50岁"
    if '男' in age_str and '女' in age_str:
        # Extract male and female ranges
        male_match = re.search(r'男[性]?[\s:]*(\d+)[^\d]*(\d+)', age_str)
        female_match = re.search(r'女[性]?[\s:]*(\d+)[^\d]*(\d+)', age_str)
        
        if male_match and female_match:
            male_range = f"{male_match.group(1)}-{male_match.group(2)}"
            female_range = f"{female_match.group(1)}-{female_match.group(2)}"
            
            # If ranges are the same, no need to specify gender
            if male_range == female_range:
                return f"{male_range}岁"
            else:
                return f"男{male_range}岁 女{female_range}岁"
    
    # Pattern 4: Simple "XX岁至XX岁" or "XX-XX岁"
    match = re.search(r'(\d+)[^\d]+(\d+)', age_str)
    if match:
        return f"{match.group(1)}-{match.group(2)}岁"
    
    # Pattern 5: Single age like "18岁及以上"
    match = re.search(r'(\d+).*以上', age_str)
    if match:
        return f"{match.group(1)}岁+"
    
    # Fallback: return simplified version
    if len(age_str) > 20:
        return age_str[:18] + '...'
    return age_str

# 4. Process each product
processed_products = []

for p in raw_data:
    # Basic info
    p_type = p.get('product_type', '保险产品')
    
    # Normalize age range
    p['age_range'] = normalize_age_range(p.get('age_range', ''))
    
def simplify_payment_period(payment_str):
    """
    Simplify verbose payment options like "一次性交清 / 5 年交/6 年交/10 年交" 
    to "一次性交清 / 5/6/10年交"
    """
    if not payment_str: return "详见条款"
    
    # Split by / or space
    options = re.split(r'[/|]', payment_str)
    options = [o.strip() for o in options if o.strip()]
    
    years_pay = [] # "5年交"
    age_pay = []   # "交到60岁"
    other = []     # "一次性交清", "终身"
    
    for opt in options:
        # Check "X年交"
        year_match = re.search(r'^(\d+)\s*年交?$', opt)
        if year_match:
            years_pay.append(year_match.group(1))
            continue
            
        # Check "交至/交到 X岁"
        age_match = re.search(r'交[至到]\s*(\d+)\s*[岁周]?', opt)
        if age_match:
            age_pay.append(age_match.group(1))
            continue
            
        other.append(opt)
    
    # Reassemble concise string
    result_parts = []
    
    if other:
        result_parts.extend(other)
        
    if years_pay:
        # Sort numerically
        years_pay.sort(key=int)
        # Use "每年交，共...年" to be absolutely clear about frequency and duration
        years_str = "/".join(years_pay)
        result_parts.append(f"每年交，共{years_str}年")
        
    if age_pay:
        age_pay.sort(key=int)
        result_parts.append(f"交到{'/'.join(age_pay)}岁")
        
    return "；或 ".join(result_parts)

for p in raw_data:
    # Basic info
    p_type = p.get('product_type', '保险产品')
    
    # ... (age range logic) ...
    p['age_range'] = normalize_age_range(p.get('age_range', ''))
    
    # Normalize waiting period
    waiting = p.get('waiting_period', '')
    if waiting:
        # Convert Chinese numbers to Arabic first (e.g. 九十 -> 90)
        # Reuse the regex logic from age normalization but apply to whole string
        import re
        cn_pattern = r'([零一二三四五六七八九十]+)'
        def replace_cn_wait(match):
            return chinese_number_to_arabic(match.group(1))
        
        waiting = re.sub(cn_pattern, replace_cn_wait, waiting)
        
        # Simplify "日" to "天", remove redundant text
        waiting = waiting.replace('日', '天')
        # Remove "(含第...天)" or "内"
        waiting = re.sub(r'[(（].*?[)）]', '', waiting) # Remove content in brackets
        waiting = waiting.replace('内', '')
        
        # Clean up
        waiting = waiting.strip()
        p['waiting_period'] = waiting

    # Normalize payment period
    payment = p.get('payment_period', '')
    if payment:
        # First, standard replacements
        payment = payment.replace('趸交', '一次性交清')
        payment = payment.replace('交至', '交到')
        payment = payment.replace('周岁', '岁')
        
        # Special handling for short-term
        if ('一年' in payment or '1年' in payment) and len(payment) < 10:
             if '医疗' in p_type or '意外' in p_type:
                 payment = '交一年保一年'
        else:
            # Apply simplification logic for complex lists
            payment = simplify_payment_period(payment)
            
        p['payment_period'] = payment
    
    # Normalize insurance period - simplify complex clauses
    period = p.get('insurance_period', '')
    if period and len(period) > 15:
        # Extract key information from verbose clauses
        if '一年' in period or '1年' in period:
            p['insurance_period'] = '1年'
        elif '终身' in period:
            p['insurance_period'] = '终身'
        elif '保险合同不可续保' in period:
            # Extract the actual period if mentioned
            if '生效' in period and '满期' in period:
                p['insurance_period'] = '自生效至满期（不可续保）'
        elif '年满' in period and ('/' in period or '或' in period):
            # Handle multiple age options like "40年，至被保险人年满 70/75/80/85 岁" OR "至...或至..."
            
            # 1. Try to find "Year duration" part
            year_match = re.search(r'(\d+)\s*年', period)
            
            # 2. Try to find all ages
            # Support "88周岁", "88 周岁", "88岁"
            ages = re.findall(r'(\d+)\s*(?:周岁|岁)', period)
            
            # Remove duplicates and sort
            unique_ages = sorted(list(set([int(a) for a in ages])))
            
            if not unique_ages:
                # If no ages found, skip
                pass
            elif year_match:
                # Format: "40年 / 至70-85岁"
                years = year_match.group(1)
                if len(unique_ages) >= 2:
                    p['insurance_period'] = f"保{years}年；或 保至{unique_ages[0]}-{unique_ages[-1]}岁"
                else:
                    p['insurance_period'] = f"保{years}年；或 保至{unique_ages[0]}岁"
            elif '或' in period:
                # Format: "保至88岁 或 保至105岁" -> "保至88岁；或 保至105岁"
                options = [f"保至{a}岁" for a in unique_ages]
                p['insurance_period'] = "；或 ".join(options)
            elif len(unique_ages) >= 2:
                # Format: "保至70-85岁" (Range)
                p['insurance_period'] = f"保至{unique_ages[0]}-{unique_ages[-1]}岁（多种选择）"
        elif '至' in period and '岁' in period:
            # Keep age-based periods as is (already clear)
            pass
    
    # --- Generate Highlights ---
    highlights = []
    # Try to find amount
    amount = "详见条款"
    if p.get('max_amount', 0) > 0:
        amount = f"{int(p['max_amount']/10000)}万"
    highlights.append({"label": "最高保额", "value": amount})
    
    # Period
    period = p.get('insurance_period', '详见条款')
    if len(period) > 6: period = period[:5] + "..."
    highlights.append({"label": "保障期限", "value": period})
    
    # Waiting period
    wait = p.get('waiting_period', '无')
    highlights.append({"label": "等待期", "value": wait})
    
    # Product Type Label
    highlights.append({"label": "险种类型", "value": p_type})

    # --- Generate Coverage List ---
    coverage_raw = p.get('coverage', '')
    coverage_items = clean_list_string(coverage_raw)
    coverage_list = []
    
    for item in coverage_items:
        # Split title and desc. Usually formatted as "• Title: Description" or just "• Title"
        # Remove bullet point
        clean_item = item.replace('• ', '').replace('· ', '')
        
        parts = re.split(r'：|:|,|，', clean_item, 1)
        title = parts[0]
        desc = parts[1] if len(parts) > 1 else clean_item
        if len(desc) > 20: desc = desc[:19] + "..."
        
        coverage_list.append({
            "icon": get_icon(title),
            "title": title,
            "desc": desc,
            "value": "✅"
        })
    
    # Limit to top 4 coverages for UI
    coverage_list = coverage_list[:4]

    # --- Generate Table Data (Mock) ---
    table_data = None
    if '医疗' in p_type or '意外' in p_type:
        table_data = {
            "title": "费率参考 (示例)",
            "headers": ["年龄", "年交保费"],
            "rows": [
                ["0-17岁", "¥300"],
                ["18-40岁", "¥500"],
                ["41-60岁", "¥1,200"]
            ]
        }
    elif '年金' in p_type or '寿险' in p_type:
        table_data = {
            "title": "利益演示 (30岁男/年交10万)",
            "headers": ["保单年度", "现金价值"],
            "rows": [
                ["第10年", "¥110,000"],
                ["第20年", "¥240,000"],
                ["第30年", "¥450,000"]
            ]
        }

    # Construct the extend_info
    p['extend_info'] = {
        "theme_color": get_theme_color(p_type),
        "highlights": highlights,
        "coverage_list": coverage_list,
        "table_data": table_data
    }
    
    # Remove large raw fields to save JS size if needed, but for now keep them
    # Just ensure we have what the template needs
    processed_products.append(p)

# 4. Generate the HTML file
# We will read the template file and inject the data
template_path = '/Users/yeya/Documents/HBuilderProjects/ai保典-迁移/后端链接/数据库结构说明/product_universal_template.html'
with open(template_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace the MOCK_DB_DATA with our real data
# We look for the line "const MOCK_DB_DATA = ["
# This is a simple string replacement. 
# We need to serialize `processed_products` to JSON.
json_data = json.dumps(processed_products, ensure_ascii=False, indent=4)

# Use regex to replace the variable definition
# Matches: const MOCK_DB_DATA = [...]; (assuming it ends with ; or is just a block)
# Actually, the template has `const MOCK_DB_DATA = [ ... ];` 
# Let's just find the start and replace until the end of the variable declaration if possible, 
# or just a simpler search/replace if the structure is known.
# The template I wrote has:
# const MOCK_DB_DATA = [
#    ...
# ];
# I will just replace the whole MOCK_DB_DATA definition.

new_js_data = f"const MOCK_DB_DATA = {json_data};"

# Regex to replace the mock data block
# Pattern: const MOCK_DB_DATA = \[.*?\]; (dot matches newline)
pattern = re.compile(r'const MOCK_DB_DATA = \[.*?\];', re.DOTALL)
new_html_content = pattern.sub(new_js_data, html_content)

# Write to a new file
output_path = '/Users/yeya/Documents/HBuilderProjects/ai保典-迁移/后端链接/数据库结构说明/all_products_viewer.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(new_html_content)

print(f"Successfully generated viewer for {len(processed_products)} products at: {output_path}")
