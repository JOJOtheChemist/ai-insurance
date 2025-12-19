#!/usr/bin/env python3
"""
导入前端 extend_info 数据到 PostgreSQL
"""
import json
import psycopg2
from psycopg2.extras import Json

# 数据库连接配置
DB_CONFIG = {
    'host': 'localhost',
    'database': 'insurance_products',
    'user': 'yeya',
    'password': '',  # macOS 通常不需要密码
    'port': 5432
}

# 从前端数据文件中读取 extend_info
# 这里手动映射产品ID到对应的 extend_info
EXTEND_INFO_MAP = {
    27: {
        "illness_features": {
            "basic_rules": {
                "age_limit": "0-50周岁",
                "insurance_period": "终身",
                "waiting_period": "90天"
            },
            "heavy_illness": {
                "disease_count": "120种",
                "payout_times": "5次",
                "payout_ratio": "100%基本保额",
                "extra_payout": "豁免后期保费"
            }
        },
        "theme_color": "#2E8B57",
        "highlights": [
            {"label": "最高保额", "value": "详见条款"},
            {"label": "保障期限", "value": "与对应批注..."},
            {"label": "等待期", "value": "90天"},
            {"label": "险种类型", "value": "重疾险"}
        ],
        "coverage_list": [
            {"icon": "🛡️", "title": "等待期", "desc": "保险合同生效日起或最后一次效力恢复之日起的90日内（含第90日）为等待期。若被保险人在等待期内被确诊患有一种或多种保险合同约定的重度疾病，则不承担相应的重度疾病豁免保险费的保险责任。若被保险人因意外事故发生前述情形的，无等待期。", "value": "✅"},
            {"icon": "⚱️", "title": "身故豁免保险费", "desc": "若保险合同的被保险人身故，则对于批注合同，将豁免自保险合同的被保险人身故后的首个保单周年日开始（若确诊日与周年日为同一日，则自该确诊日开始）至批注合同交费期间届满所对应的保险费。豁免开始后，保险合同终止。", "value": "✅"},
            {"icon": "♿", "title": "全残豁免保险费", "desc": "若保险合同的被保险人全残，则对于批注合同，将豁免自保险合同的被保险人全残后的首个保单周年日开始（若确诊日与周年日为同一日，则自该确诊日开始）至批注合同交费期间届满所对应的保险费。豁免开始后，保险合同终止。", "value": "✅"},
            {"icon": "🆓", "title": "重度疾病豁免保险费", "desc": "若保险合同的被保险人因意外事故或于等待期后因意外事故以外的原因就诊并被专科医生首次确诊患有保险合同约定的重度疾病，则对于批注合同，将豁免自该确诊日后的首个保单周年日开始（若确诊日与周年日为同一日，则自该确诊日开始）至批注合同交费期间届满所对应的保险费。豁免开始后，保险合同终止。", "value": "✅"}
        ]
    },
    # 可以继续添加其他产品的 extend_info...
}

def main():
    try:
        # 连接数据库
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("✅ 成功连接到数据库")
        
        # 更新每个产品的 extend_info
        updated_count = 0
        for product_id, extend_info in EXTEND_INFO_MAP.items():
            cursor.execute(
                """
                UPDATE insurance_product
                SET extend_info = %s
                WHERE id = %s
                """,
                (Json(extend_info), product_id)
            )
            updated_count += cursor.rowcount
            print(f"✅ 更新产品 ID {product_id}")
        
        # 提交事务
        conn.commit()
        print(f"\n🎉 成功更新 {updated_count} 个产品的 extend_info 数据")
        
        # 验证数据
        cursor.execute("SELECT id, product_name, extend_info FROM insurance_product WHERE id = 27")
        result = cursor.fetchone()
        if result:
            print(f"\n📋 验证产品 ID 27:")
            print(f"   产品名: {result[1]}")
            print(f"   extend_info: {json.dumps(result[2], ensure_ascii=False, indent=2)}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
