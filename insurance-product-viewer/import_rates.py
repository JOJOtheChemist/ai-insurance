#!/usr/bin/env python3
"""
批量导入保险费率数据到 PostgreSQL
从 /Users/yeya/Downloads/费率 目录读取所有 .txt 文件并导入
"""
import os
import csv
import psycopg2
from psycopg2 import sql
import sys

# 数据库连接配置
DB_CONFIG = {
    'host': 'localhost',
    'database': 'insurance_products',
    'user': 'yeya',
    'password': '',
    'port': 5432
}

# 费率文件目录
RATES_DIR = '/Users/yeya/Downloads/费率'

def parse_value(value):
    """解析费率值,处理特殊情况"""
    if not value or value.strip() == '' or value.strip() == '-' or value.strip().upper() == 'NA':
        return None
    try:
        return float(value.strip())
    except ValueError:
        return None

def parse_integer(value):
    """解析整数值"""
    if not value or value.strip() == '' or value.strip() == '-' or value.strip().upper() == 'NA':
        return None
    try:
        return int(value.strip())
    except ValueError:
        return None

def extract_product_name(filename):
    """从文件名提取产品名称"""
    # 移除 .txt 后缀
    name = filename.replace('.txt', '')
    return name

def import_rate_file(cursor, filepath, product_name):
    """导入单个费率文件"""
    inserted_count = 0
    skipped_count = 0
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            # 使用 csv.DictReader 读取CSV文件
            reader = csv.DictReader(f)
            
            for row in reader:
                # 解析每一行数据
                age = parse_integer(row.get('age'))
                
                # 安全地处理可能为 None 的字符串字段
                gender_val = row.get('gender', '') or ''
                gender = gender_val.strip() if gender_val.strip() not in ['NA', '-', ''] else None
                
                premium_term = parse_integer(row.get('premium_term'))
                premium_due = parse_integer(row.get('premium_due'))
                
                health_status_val = row.get('health_status', '') or ''
                health_status = health_status_val.strip() if health_status_val.strip() not in ['NA', '-', ''] else None
                
                payment_frequency_val = row.get('payment_frequency', '') or ''
                payment_frequency = payment_frequency_val.strip() if payment_frequency_val.strip() not in ['NA', '-', ''] else None
                
                payment_factor = parse_value(row.get('payment_factor'))
                
                plan_val = row.get('plan', '') or ''
                plan = plan_val.strip() if plan_val.strip() not in ['NA', '-', ''] else None
                
                premium_value = parse_value(row.get('value'))
                
                # 如果保费值为空,跳过这一行
                if premium_value is None:
                    skipped_count += 1
                    continue
                
                # 插入数据库
                cursor.execute(
                    """
                    INSERT INTO insurance_rates (
                        product_name, age, gender, premium_term, premium_due,
                        health_status, payment_frequency, payment_factor, plan, premium_value
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        product_name, age, gender, premium_term, premium_due,
                        health_status, payment_frequency, payment_factor, plan, premium_value
                    )
                )
                inserted_count += 1
                
    except Exception as e:
        print(f"   ❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return 0, 0
    
    return inserted_count, skipped_count

def main():
    """主函数"""
    try:
        # 检查目录是否存在
        if not os.path.exists(RATES_DIR):
            print(f"❌ 目录不存在: {RATES_DIR}")
            sys.exit(1)
        
        # 获取所有 .txt 文件
        txt_files = [f for f in os.listdir(RATES_DIR) if f.endswith('.txt')]
        
        if not txt_files:
            print(f"❌ 目录中没有找到 .txt 文件: {RATES_DIR}")
            sys.exit(1)
        
        print(f"✅ 找到 {len(txt_files)} 个费率文件")
        print(f"📂 目录: {RATES_DIR}\n")
        
        # 连接数据库
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("✅ 成功连接到数据库\n")
        
        # 清空现有费率数据
        cursor.execute("TRUNCATE TABLE insurance_rates RESTART IDENTITY CASCADE;")
        print("✅ 已清空现有费率数据\n")
        
        # 导入每个文件
        total_inserted = 0
        total_skipped = 0
        
        for i, filename in enumerate(txt_files, 1):
            filepath = os.path.join(RATES_DIR, filename)
            product_name = extract_product_name(filename)
            
            print(f"[{i}/{len(txt_files)}] 正在导入: {product_name}")
            
            inserted, skipped = import_rate_file(cursor, filepath, product_name)
            total_inserted += inserted
            total_skipped += skipped
            
            print(f"   ✅ 插入 {inserted} 条记录, 跳过 {skipped} 条")
            
            # 每处理10个文件提交一次
            if i % 10 == 0:
                conn.commit()
                print(f"\n💾 已提交前 {i} 个文件的数据\n")
        
        # 最后提交
        conn.commit()
        
        print(f"\n{'='*60}")
        print(f"🎉 导入完成!")
        print(f"📊 统计:")
        print(f"   • 文件总数: {len(txt_files)}")
        print(f"   • 插入记录: {total_inserted:,} 条")
        print(f"   • 跳过记录: {total_skipped:,} 条")
        print(f"{'='*60}\n")
        
        # 验证数据
        cursor.execute("SELECT COUNT(*) FROM insurance_rates")
        count = cursor.fetchone()[0]
        print(f"✅ 数据库中共有 {count:,} 条费率记录")
        
        # 显示按产品统计
        cursor.execute("""
            SELECT product_name, COUNT(*) as count
            FROM insurance_rates
            GROUP BY product_name
            ORDER BY count DESC
            LIMIT 10
        """)
        
        print(f"\n📈 前10个产品的费率记录数:")
        for row in cursor.fetchall():
            print(f"   • {row[0]}: {row[1]:,} 条")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    print("="*60)
    print("保险费率数据导入工具")
    print("="*60 + "\n")
    main()
