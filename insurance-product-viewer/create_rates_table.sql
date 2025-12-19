-- =====================================================
-- 保险费率表 PostgreSQL 创建脚本
-- =====================================================

-- 删除旧表（如存在）
DROP TABLE IF EXISTS insurance_rates;

-- 创建保险费率表
CREATE TABLE insurance_rates (
    id BIGSERIAL PRIMARY KEY,                              -- 费率ID
    product_name VARCHAR(200) NOT NULL,                    -- 产品名称（从文件名提取）
    age INTEGER,                                           -- 年龄
    gender VARCHAR(10),                                    -- 性别
    premium_term INTEGER,                                  -- 缴费期限
    premium_due INTEGER,                                   -- 缴费年限
    health_status VARCHAR(50),                             -- 健康状况
    payment_frequency VARCHAR(50),                         -- 缴费频率
    payment_factor DECIMAL(10,2),                          -- 缴费系数
    plan VARCHAR(50),                                      -- 计划类型
    premium_value DECIMAL(15,2),                           -- 保费值
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- 创建时间
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- 更新时间
);

-- 创建索引以提高查询性能
CREATE INDEX idx_rates_product_name ON insurance_rates(product_name);
CREATE INDEX idx_rates_age ON insurance_rates(age);
CREATE INDEX idx_rates_gender ON insurance_rates(gender);
CREATE INDEX idx_rates_health_status ON insurance_rates(health_status);
CREATE INDEX idx_rates_premium_term ON insurance_rates(premium_term);

-- 添加表注释
COMMENT ON TABLE insurance_rates IS '保险产品费率表';
COMMENT ON COLUMN insurance_rates.id IS '费率ID';
COMMENT ON COLUMN insurance_rates.product_name IS '产品名称';
COMMENT ON COLUMN insurance_rates.age IS '年龄';
COMMENT ON COLUMN insurance_rates.gender IS '性别';
COMMENT ON COLUMN insurance_rates.premium_term IS '缴费期限';
COMMENT ON COLUMN insurance_rates.premium_due IS '缴费年限';
COMMENT ON COLUMN insurance_rates.health_status IS '健康状况 (standard/substandard)';
COMMENT ON COLUMN insurance_rates.payment_frequency IS '缴费频率 (annual/semi_annual/quarterly/monthly)';
COMMENT ON COLUMN insurance_rates.payment_factor IS '缴费系数';
COMMENT ON COLUMN insurance_rates.plan IS '计划类型';
COMMENT ON COLUMN insurance_rates.premium_value IS '保费值';
COMMENT ON COLUMN insurance_rates.create_time IS '创建时间';
COMMENT ON COLUMN insurance_rates.update_time IS '更新时间';
