-- =====================================================
-- 保险费率查询示例
-- =====================================================

-- 1. 查看所有产品及其费率记录数
SELECT 
    product_name, 
    COUNT(*) as rate_count
FROM insurance_rates
GROUP BY product_name
ORDER BY rate_count DESC;

-- 2. 查询特定产品的费率信息
SELECT *
FROM insurance_rates
WHERE product_name = '友邦友如意星享版_2025_重大疾病保险'
ORDER BY age, gender, premium_term;

-- 3. 查询特定年龄和性别的费率
SELECT 
    product_name,
    age,
    gender,
    premium_term,
    plan,
    premium_value
FROM insurance_rates
WHERE age = 30 
  AND gender = '男'
  AND health_status = 'standard'
ORDER BY premium_value;

-- 4. 按产品和计划类型统计平均费率
SELECT 
    product_name,
    plan,
    AVG(premium_value) as avg_premium,
    MIN(premium_value) as min_premium,
    MAX(premium_value) as max_premium,
    COUNT(*) as record_count
FROM insurance_rates
WHERE premium_value IS NOT NULL
GROUP BY product_name, plan
ORDER BY product_name, plan;

-- 5. 查询标准健康状况和次标准健康状况的费率对比
SELECT 
    product_name,
    age,
    gender,
    premium_term,
    health_status,
    premium_value
FROM insurance_rates
WHERE product_name = '友邦友如意星享版_2025_重大疾病保险'
  AND age = 30
  AND gender = '男'
  AND plan = 'A'
ORDER BY health_status, premium_term;

-- 6. 按缴费频率分组统计
SELECT 
    payment_frequency,
    COUNT(*) as count,
    AVG(premium_value) as avg_premium
FROM insurance_rates
WHERE premium_value IS NOT NULL
GROUP BY payment_frequency
ORDER BY count DESC;

-- 7. 查询某个年龄段的费率范围
SELECT 
    product_name,
    MIN(premium_value) as min_rate,
    MAX(premium_value) as max_rate,
    AVG(premium_value) as avg_rate
FROM insurance_rates
WHERE age BETWEEN 25 AND 35
  AND gender = '女'
  AND health_status = 'standard'
GROUP BY product_name
HAVING COUNT(*) > 10
ORDER BY avg_rate;

-- 8. 查询不同缴费期限的费率
SELECT 
    product_name,
    premium_term,
    gender,
    AVG(premium_value) as avg_premium
FROM insurance_rates
WHERE age = 30
  AND health_status = 'standard'
  AND payment_frequency = 'annual'
GROUP BY product_name, premium_term, gender
ORDER BY product_name, premium_term, gender;

-- 9. 查找费率最高和最低的产品
(
    SELECT 
        product_name,
        age,
        gender,
        premium_term,
        premium_value,
        '最高' as type
    FROM insurance_rates
    WHERE premium_value IS NOT NULL
    ORDER BY premium_value DESC
    LIMIT 10
)
UNION ALL
(
    SELECT 
        product_name,
        age,
        gender,
        premium_term,
        premium_value,
        '最低' as type
    FROM insurance_rates
    WHERE premium_value IS NOT NULL
    ORDER BY premium_value ASC
    LIMIT 10
);

-- 10. 统计各个年龄段的记录数
SELECT 
    CASE 
        WHEN age < 18 THEN '0-17岁'
        WHEN age BETWEEN 18 AND 30 THEN '18-30岁'
        WHEN age BETWEEN 31 AND 40 THEN '31-40岁'
        WHEN age BETWEEN 41 AND 50 THEN '41-50岁'
        WHEN age BETWEEN 51 AND 60 THEN '51-60岁'
        ELSE '60岁以上'
    END as age_group,
    COUNT(*) as count
FROM insurance_rates
WHERE age IS NOT NULL
GROUP BY age_group
ORDER BY age_group;
