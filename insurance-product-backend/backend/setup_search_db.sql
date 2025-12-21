-- 开启 pg_trgm 扩展 (用于模糊查询加速)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 为 description 字段创建 GIN 索引
CREATE INDEX IF NOT EXISTS idx_insurance_product_description_trgm 
ON insurance_product 
USING GIN (description gin_trgm_ops);

-- 为 extend_info 字段(转为text后)创建 GIN 索引
-- 这是让 extend_info::text ILIKE '%keyword%' 变快的关键
CREATE INDEX IF NOT EXISTS idx_insurance_product_extend_info_trgm 
ON insurance_product 
USING GIN ((extend_info::text) gin_trgm_ops);

-- 为 product_name 创建 GIN 索引 (可选，如果名字也要模糊搜)
CREATE INDEX IF NOT EXISTS idx_insurance_product_name_trgm 
ON insurance_product 
USING GIN (product_name gin_trgm_ops);
