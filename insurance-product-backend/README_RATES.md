# 保险费率数据导入说明

## 概述

本文档说明如何将 `/Users/yeya/Downloads/费率` 目录下的费率数据导入到 PostgreSQL 数据库中。

## 文件说明

1. **create_rates_table.sql** - 创建费率表的 SQL 脚本
2. **import_rates.py** - 导入费率数据的 Python 脚本

## 数据表结构

费率表 `insurance_rates` 包含以下字段:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGSERIAL | 主键ID |
| product_name | VARCHAR(200) | 产品名称（从文件名提取） |
| age | INTEGER | 年龄 |
| gender | VARCHAR(10) | 性别 |
| premium_term | INTEGER | 缴费期限 |
| premium_due | INTEGER | 缴费年限 |
| health_status | VARCHAR(50) | 健康状况 (standard/substandard) |
| payment_frequency | VARCHAR(50) | 缴费频率 (annual/semi_annual/quarterly/monthly) |
| payment_factor | DECIMAL(10,2) | 缴费系数 |
| plan | VARCHAR(50) | 计划类型 |
| premium_value | DECIMAL(15,2) | 保费值 |
| create_time | TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | 更新时间 |

## 使用步骤

### 1. 创建费率表

首先需要在数据库中创建费率表:

```bash
cd /Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/insurance-product-viewer

# 连接到 PostgreSQL 并执行建表脚本
psql -U yeya -d insurance_products -f create_rates_table.sql
```

或者使用 psql 交互式命令:

```bash
psql -U yeya -d insurance_products
\i create_rates_table.sql
\q
```

### 2. 运行导入脚本

确保已安装必要的 Python 包:

```bash
# 如果使用虚拟环境
source venv/bin/activate

# 确保已安装 psycopg2
pip install psycopg2-binary
```

执行导入脚本:

```bash
python3 import_rates.py
```

### 3. 验证导入结果

导入完成后,脚本会自动显示统计信息。你也可以手动查询验证:

```sql
-- 查看总记录数
SELECT COUNT(*) FROM insurance_rates;

-- 查看每个产品的费率记录数
SELECT product_name, COUNT(*) as count
FROM insurance_rates
GROUP BY product_name
ORDER BY count DESC;

-- 查看某个产品的费率示例
SELECT *
FROM insurance_rates
WHERE product_name = '友邦友如意星享版_2025_重大疾病保险'
LIMIT 10;
```

## 数据源

费率数据来自 `/Users/yeya/Downloads/费率` 目录，包含约 49 个产品的费率文件，每个文件为 CSV 格式 (.txt 扩展名)。

文件格式示例:
```csv
age,gender,premium_term,premium_due,health_status,payment_frequency,payment_factor,plan,value
0,男,20,20,standard,annual,1.0,A,20.2
0,女,20,20,standard,annual,1.0,A,19.5
```

## 注意事项

1. **数据清理**: 导入脚本会自动处理 `NA`、`-` 等特殊值，将其转换为 NULL
2. **数据覆盖**: 每次运行导入脚本会清空现有数据（TRUNCATE TABLE）
3. **跳过记录**: 如果费率值（value字段）为空，该记录会被跳过
4. **批量提交**: 脚本每处理 10 个文件会提交一次事务，提高性能和安全性

## API 集成建议

可以在 `backend/main.py` 中添加费率查询接口:

```python
@app.get("/api/rates/{product_name}")
def get_product_rates(
    product_name: str,
    age: Optional[int] = None,
    gender: Optional[str] = None
):
    """获取产品费率"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = "SELECT * FROM insurance_rates WHERE product_name = %s"
        params = [product_name]
        
        if age is not None:
            query += " AND age = %s"
            params.append(age)
            
        if gender:
            query += " AND gender = %s"
            params.append(gender)
        
        cursor.execute(query, params)
        rates = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return rates
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 常见问题

### Q: 导入失败怎么办?
A: 检查以下几点:
- PostgreSQL 服务是否运行
- 数据库连接配置是否正确
- 费率文件目录路径是否正确
- 是否有足够的数据库权限

### Q: 如何只导入特定产品的费率?
A: 可以修改 `import_rates.py` 中的文件过滤逻辑，或手动删除不需要的文件后再运行导入。

### Q: 费率数据更新后如何重新导入?
A: 直接运行 `python3 import_rates.py` 即可，脚本会自动清空旧数据并导入新数据。

## 联系方式

如有问题，请联系开发团队。
