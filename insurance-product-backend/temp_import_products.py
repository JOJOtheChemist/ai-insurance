import json
import psycopg2
from psycopg2.extras import Json
import sys

# 数据库连接配置 (Docker Environment)
# 数据库连接配置 (Docker Internal)
DB_CONFIG = {
    'host': 'postgres',
    'database': 'insurance_products',
    'user': 'insurance_user',
    'password': 'insurance_password_2024',
    'port': 5432
}

def parse_string_to_list(value):
    if not value: return None
    if isinstance(value, list): return value
    try:
        json_str = value.replace("'", '"')
        return json.loads(json_str)
    except:
        return [item.strip() for item in value.split(',') if item.strip()]

def import_from_json():
    json_file = 'insurance_product.json'
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"✅ Reading {len(products)} products")
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Clean existing data
        cursor.execute("TRUNCATE TABLE insurance_product RESTART IDENTITY CASCADE;")
        print("✅ Cleared existing data")
        
        for product in products:
            extend_info = product.get('extend_info', {})
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
        
        conn.commit()
        print(f"🎉 Successfully imported {len(products)} products")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    import_from_json()
