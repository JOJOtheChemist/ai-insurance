#!/usr/bin/env python3
"""
批量导入所有前端产品数据到 PostgreSQL
"""
import json
import psycopg2
from psycopg2.extras import Json
import sys

# 数据库连接配置
DB_CONFIG = {
    'host': 'localhost',
    'database': 'insurance_products',
    'user': 'yeya',
    'password': '',
    'port': 5432
}

def parse_string_to_list(value):
    """解析字符串形式的列表"""
    if not value:
        return None
    if isinstance(value, list):
        return value
    
    # 尝试解析类似 "['item1', 'item2']" 的字符串
    try:
        # 替换单引号为双引号以符合 JSON 格式
        json_str = value.replace("'", '"')
        return json.loads(json_str)
    except:
        # 如果解析失败，按逗号分割
        return [item.strip() for item in value.split(',') if item.strip()]

def import_from_json():
    """从 JSON 文件导入数据"""
    json_file = '/Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/数据库结构说明/保险产品数据/insurance_product.json'
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"✅ 读取到 {len(products)} 个产品")
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # 清空现有数据
        cursor.execute("TRUNCATE TABLE insurance_product RESTART IDENTITY CASCADE;")
        print("✅ 已清空现有数据")
        
        inserted_count = 0
        for product in products:
            # 解析 extend_info
            extend_info = product.get('extend_info', {})
            if isinstance(extend_info, dict) and 'raw' in extend_info:
                # 如果是 {"raw": "..."} 格式，保留原样
                pass
            
            # 解析 tags 和 exclusions
            tags_list = parse_string_to_list(product.get('tags'))
            exclusions_list = parse_string_to_list(product.get('exclusions'))
            coverage_list = parse_string_to_list(product.get('coverage'))
            
            cursor.execute(
                """
                INSERT INTO insurance_product (
                    id, product_name, product_code, product_type, company_name,
                    min_amount, max_amount, min_premium, max_premium,
                    coverage, description, details, image_url, status,
                    create_time, update_time, tags, age_range, insurance_period,
                    payment_period, waiting_period, exclusions, cooling_off_period,
                    surrender_terms, extend_info
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s
                )
                """,
                (
                    product.get('id'),
                    product.get('product_name'),
                    product.get('product_code'),
                    product.get('product_type'),
                    product.get('company_name'),
                    product.get('min_amount', 0),
                    product.get('max_amount', 0),
                    product.get('min_premium', 0),
                    product.get('max_premium', 0),
                    json.dumps(coverage_list) if coverage_list else None,
                    product.get('description'),
                    product.get('details'),
                    product.get('image_url'),
                    product.get('status', 1),
                    product.get('create_time'),
                    product.get('update_time'),
                    json.dumps(tags_list) if tags_list else None,
                    product.get('age_range'),
                    product.get('insurance_period'),
                    product.get('payment_period'),
                    product.get('waiting_period'),
                    json.dumps(exclusions_list) if exclusions_list else None,
                    product.get('cooling_off_period'),
                    product.get('surrender_terms'),
                    Json(extend_info) if extend_info else None
                )
            )
            inserted_count += 1
            if inserted_count % 10 == 0:
                print(f"   已导入 {inserted_count} 个产品...")
        
        conn.commit()
        print(f"\n🎉 成功导入 {inserted_count} 个产品到数据库")
        
        # 验证数据
        cursor.execute("SELECT COUNT(*) FROM insurance_product")
        count = cursor.fetchone()[0]
        print(f"✅ 数据库中共有 {count} 个产品")
        
        cursor.close()
        conn.close()
        
    except FileNotFoundError:
        print(f"❌ 找不到文件: {json_file}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    print("开始导入产品数据...")
    import_from_json()
