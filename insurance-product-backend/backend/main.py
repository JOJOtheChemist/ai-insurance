"""
FastAPI 后端 - 保险产品 API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Any
from enum import Enum
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
import os
import json

class SnippetLevel(str, Enum):
    TIGHT = "tight"
    OBJECT = "object"
    EXTENDED = "extended"

class SnippetExtractor:
    @staticmethod
    def extract(data: dict, keyword: str, max_chars: int = 500, level: SnippetLevel = SnippetLevel.OBJECT) -> Optional[str]:
        """
        Recursively search for keyword in JSON and return a smart snippet.
        """
        if not data or not keyword:
            return None
            
        keyword_lower = keyword.lower()
        
        def _search_recursive(node, parent_node=None):
            if isinstance(node, dict):
                for k, v in node.items():
                    # Check Key
                    if keyword_lower in k.lower():
                        return node if level == SnippetLevel.OBJECT else {k: v}
                    # Check Value
                    if isinstance(v, (str, int, float)) and keyword_lower in str(v).lower():
                        if level == SnippetLevel.OBJECT and parent_node:
                            # If value matches, return the object containing this key-value pair
                            return node
                        return {k: v} # Fallback or tight level
                    
                    # Recurse
                    if isinstance(v, (dict, list)):
                        found = _search_recursive(v, node)
                        if found:
                            return found
            elif isinstance(node, list):
                for item in node:
                    found = _search_recursive(item, parent_node) # List itself isn't an object context usually, pass parent
                    if found:
                        return found
            return None

        # 1. Find the best matching subtree
        result_node = _search_recursive(data)
        
        if result_node:
            # 2. Convert to string
            result_str = json.dumps(result_node, ensure_ascii=False)
            
            # 3. Check Safety Cutoff
            if len(result_str) > max_chars:
                # Fallback to text window if object is too huge
                return SnippetExtractor._get_text_window(result_str, keyword, 100)
            return result_str
            
        return None
    
    @staticmethod
    def _get_text_window(text: str, keyword: str, window_size: int) -> str:
        lower_text = text.lower()
        lower_kw = keyword.lower()
        start_idx = lower_text.find(lower_kw)
        if start_idx == -1:
             return text[:window_size*2] + "..."
             
        start = max(0, start_idx - window_size)
        end = min(len(text), start_idx + len(keyword) + window_size)
        return "..." + text[start:end] + "..."


app = FastAPI(title="保险产品 API", version="1.0.0")

# --- 用户系统集成 ---
from core.database import engine, Base
from routers import users, invite_codes
from models import user, user_profile, invite_code, client, family_member, follow_up, chat_session, session_client_link # 确保模型被加载

# 自动创建数据库表 (生产环境建议使用 Alembic)
Base.metadata.create_all(bind=engine)

# 注册路由
from routers import users, invite_codes, clients
# ...
app.include_router(users.router, prefix="/api/v1")
app.include_router(invite_codes.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
# ------------------

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库配置
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'insurance_products'),
    'user': os.getenv('DB_USER', 'yeya'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': int(os.getenv('DB_PORT', 5432))
}

# Pydantic 模型
class Product(BaseModel):
    id: int
    product_name: str
    product_code: str
    product_type: str
    company_name: str
    description: Optional[str] = None
    age_range: Optional[str] = None
    insurance_period: Optional[str] = None
    payment_period: Optional[str] = None
    waiting_period: Optional[str] = None
    cooling_off_period: Optional[str] = None
    surrender_terms: Optional[str] = None
    tags: Optional[str] = None
    exclusions: Optional[str] = None
    coverage: Optional[str] = None
    extend_info: Optional[dict] = None
    status: int = 1

def get_db_connection():
    """获取数据库连接"""
    return psycopg2.connect(**DB_CONFIG)

@app.get("/")
def read_root():
    return {"message": "保险产品 API 服务运行中", "version": "1.0.0"}

@app.get("/api/products", response_model=List[Product])
def get_products(
    product_type: Optional[str] = None,
    status: int = 1
):
    """
    获取产品列表
    
    参数:
    - product_type: 产品类型过滤（可选）
    - status: 产品状态（默认1=上架）
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = "SELECT * FROM insurance_product WHERE status = %s"
        params = [status]
        
        if product_type:
            query += " AND product_type = %s"
            params.append(product_type)
        
        query += " ORDER BY id"
        
        cursor.execute(query, params)
        products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return products
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    """
    获取单个产品详情
    
    参数:
    - product_id: 产品ID
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(
            "SELECT * FROM insurance_product WHERE id = %s",
            (product_id,)
        )
        product = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not product:
            raise HTTPException(status_code=404, detail="产品未找到")
        
        return product
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/product-types")
def get_product_types():
    """获取所有产品类型"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT DISTINCT product_type FROM insurance_product WHERE status = 1 ORDER BY product_type"
        )
        types = [row[0] for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return {"product_types": types}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rates/products")
def get_rate_products():
    """
    获取所有有费率数据的产品列表
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT 
                product_name,
                COUNT(*) as rate_count,
                MIN(age) as min_age,
                MAX(age) as max_age,
                array_agg(DISTINCT gender) FILTER (WHERE gender IS NOT NULL) as genders,
                array_agg(DISTINCT plan) FILTER (WHERE plan IS NOT NULL) as plans
            FROM insurance_rates
            GROUP BY product_name
            ORDER BY product_name
        """)
        products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {"products": products}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rates/{product_name}")
def get_product_rates(
    product_name: str,
    age: Optional[int] = None,
    gender: Optional[str] = None,
    premium_term: Optional[int] = None,
    health_status: Optional[str] = None,
    plan: Optional[str] = None
):
    """
    查询产品费率
    
    参数:
    - product_name: 产品名称
    - age: 年龄（可选）
    - gender: 性别（可选）
    - premium_term: 缴费期限（可选）
    - health_status: 健康状况（可选）
    - plan: 计划类型（可选）
    """
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
            
        if premium_term is not None:
            query += " AND premium_term = %s"
            params.append(premium_term)
            
        if health_status:
            query += " AND health_status = %s"
            params.append(health_status)
            
        if plan:
            query += " AND plan = %s"
            params.append(plan)
        
        query += " ORDER BY age, gender, premium_term, plan"
        
        cursor.execute(query, params)
        rates = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {"rates": rates, "count": len(rates)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rates/{product_name}/available-options")
def get_available_options(
    product_name: str,
    age: Optional[int] = None,
    gender: Optional[str] = None,
    premium_term: Optional[int] = None,
    health_status: Optional[str] = None,
    plan: Optional[str] = None
):
    """
    获取给定条件下的可用参数选项（智能联动）
    根据已选择的参数，返回其他可用参数的选项
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 构建 WHERE条件
        where_clauses = ["product_name = %s"]
        params = [product_name]
        
        if age is not None:
            where_clauses.append("age = %s")
            params.append(age)
        if gender:
            where_clauses.append("gender = %s")
            params.append(gender)
        if premium_term is not None:
            where_clauses.append("(premium_term = %s OR (premium_term IS NULL AND premium_due = %s))")
            params.extend([premium_term, premium_term])
        if health_status:
            where_clauses.append("health_status = %s")
            params.append(health_status)
        if plan:
            where_clauses.append("plan = %s")
            params.append(plan)
        
        where_clause = " AND ".join(where_clauses)
        
        # 查询可用选项
        query = f"""
            SELECT 
                array_agg(DISTINCT age ORDER BY age) FILTER (WHERE age IS NOT NULL) as ages,
                array_agg(DISTINCT gender) FILTER (WHERE gender IS NOT NULL) as genders,
                array_agg(DISTINCT COALESCE(premium_term, premium_due::int)) FILTER (WHERE COALESCE(premium_term, premium_due::int) IS NOT NULL) as premium_terms,
                array_agg(DISTINCT health_status) FILTER (WHERE health_status IS NOT NULL) as health_statuses,
                array_agg(DISTINCT plan) FILTER (WHERE plan IS NOT NULL AND plan != '') as plans
            FROM insurance_rates
            WHERE {where_clause}
        """
        
        cursor.execute(query, params)
        options = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not options:
            raise HTTPException(status_code=404, detail="未找到匹配的数据")
        
        # 去重并排序
        if options['premium_terms']:
            options['premium_terms'] = sorted(list(set(options['premium_terms'])))
        
        return options
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rates/{product_name}/options")
def get_rate_options(product_name: str):
    """
    获取产品的所有可用选项（年龄、性别、缴费期限等）
    
    参数:
    - product_name: 产品名称
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT 
                array_agg(DISTINCT age ORDER BY age) FILTER (WHERE age IS NOT NULL) as ages,
                array_agg(DISTINCT gender) FILTER (WHERE gender IS NOT NULL) as genders,
                array_agg(DISTINCT premium_term ORDER BY premium_term) FILTER (WHERE premium_term IS NOT NULL) as premium_terms,
                array_agg(DISTINCT premium_due ORDER BY premium_due) FILTER (WHERE premium_due IS NOT NULL AND premium_due != '') as premium_dues,
                array_agg(DISTINCT health_status) FILTER (WHERE health_status IS NOT NULL) as health_statuses,
                array_agg(DISTINCT plan) FILTER (WHERE plan IS NOT NULL) as plans,
                array_agg(DISTINCT payment_frequency) FILTER (WHERE payment_frequency IS NOT NULL) as payment_frequencies
            FROM insurance_rates
            WHERE product_name = %s
        """, (product_name,))
        
        options = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not options:
            raise HTTPException(status_code=404, detail="产品未找到")
        
        # 如果 premium_terms 为空但 premium_dues 有值，使用 premium_dues 作为 premium_terms
        if (not options['premium_terms'] or len(options['premium_terms']) == 0) and options.get('premium_dues'):
            options['premium_terms'] = options['premium_dues']
        
        return options
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rates/{product_name}/curve")
def get_rate_curve(
    product_name: str,
    gender: str,
    premium_term: int,
    health_status: str = 'standard',
    plan: Optional[str] = None
):
    """
    获取费率曲线数据（用于绘制年龄-费率关系图）
    
    参数:
    - product_name: 产品名称
    - gender: 性别
    - premium_term: 缴费期限
    - health_status: 健康状况（默认 standard）
    - plan: 计划类型（可选）
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT age, premium_value
            FROM insurance_rates
            WHERE product_name = %s
              AND gender = %s
              AND health_status = %s
              AND (premium_term = %s OR (premium_term IS NULL AND premium_due = %s))
        """
        params = [product_name, gender, health_status, premium_term, premium_term]
        
        if plan:
            query += " AND plan = %s"
            params.append(plan)
        
        query += " ORDER BY age"
        
        cursor.execute(query, params)
        rates = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # 转换为图表所需格式
        ages = [r['age'] for r in rates]
        values = [float(r['premium_value']) for r in rates]
        
        return {
            "ages": ages,
            "values": values,
            "count": len(rates)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rates/calculate")
def calculate_premium(request: dict):
    """
    计算保费
    
    请求体:
    {
        "product_name": "产品名称",
        "age": 30,
        "gender": "男",
        "premium_term": 20,
        "health_status": "standard",
        "plan": "A",
        "coverage_amount": 500000
    }
    """
    try:
        product_name = request.get('product_name')
        age = request.get('age')
        gender = request.get('gender')
        premium_term = request.get('premium_term')
        health_status = request.get('health_status', 'standard')
        plan = request.get('plan')
        coverage_amount = request.get('coverage_amount', 100000)  # 默认10万保额
        
        if not all([product_name, age is not None, gender, premium_term]):
            raise HTTPException(status_code=400, detail="缺少必要参数")
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 先尝试使用 premium_term
        query = """
            SELECT premium_value, payment_factor, payment_frequency
            FROM insurance_rates
            WHERE product_name = %s
              AND age = %s
              AND gender = %s
              AND health_status = %s
              AND (premium_term = %s OR (premium_term IS NULL AND premium_due = %s))
        """
        params = [product_name, age, gender, health_status, premium_term, premium_term]
        
        if plan:
            query += " AND plan = %s"
            params.append(plan)
        
        cursor.execute(query, params)
        rate = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not rate:
            raise HTTPException(status_code=404, detail="未找到匹配的费率")
        
        # 计算保费 = 费率 × 保额 / 1000（假设费率是每千元保额的价格）
        premium = float(rate['premium_value']) * (coverage_amount / 1000)
        
        return {
            "product_name": product_name,
            "age": age,
            "gender": gender,
            "premium_term": premium_term,
            "health_status": health_status,
            "plan": plan,
            "coverage_amount": coverage_amount,
            "premium_rate": float(rate['premium_value']),
            "annual_premium": round(premium, 2),
            "total_premium": round(premium * premium_term, 2),
            "payment_frequency": rate['payment_frequency']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ... (existing imports)

@app.get("/api/tools/search")
def tool_search_products(keyword: str, limit: int = 5, snippet_level: str = "object"):
    """
    [工具] 增强型搜索接口
    同时搜索产品名称、简介、和 JSON 扩展信息。
    支持智能片段提取，避免返回过长 JSON。
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 1. 使用 ILIKE 进行宽泛召回 (Recall)
        # [Optimization] Added 'coverage' to search scope
        query = """
            SELECT 
                id, 
                product_name, 
                product_code,
                description,
                extend_info,
                coverage
            FROM insurance_product
            WHERE status = 1 
              AND (
                  product_name ILIKE %s 
                  OR description ILIKE %s
                  OR extend_info::text ILIKE %s
                  OR coverage ILIKE %s
              )
        """
        keyword_pattern = f"%{keyword}%"
        cursor.execute(query, [keyword_pattern, keyword_pattern, keyword_pattern, keyword_pattern])
        all_products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # 2. Python 层处理: 评分 + 智能摘要 (Rerank & Snippet)
        results = []
        for p in all_products:
            score = 0
            # 基础分
            if keyword.lower() in p['product_name'].lower():
                score += 100
            if p['description'] and keyword.lower() in p['description'].lower():
                score += 50
            if p.get('coverage') and keyword.lower() in str(p['coverage']).lower():
                score += 40 # Coverage match score
            
            # 摘要逻辑
            desc_snippet = None
            if p['description']:
                desc_snippet = SnippetExtractor._get_text_window(p['description'], keyword, 60)
                
            extend_snippet = None
            if p.get('extend_info'):
                try:
                    # 尝试提取 JSON 片段
                    extracted = SnippetExtractor.extract(
                        p['extend_info'], 
                        keyword, 
                        level=SnippetLevel(snippet_level) if snippet_level in ["tight", "object", "extended"] else SnippetLevel.OBJECT
                    )
                    if extracted:
                        score += 30 # JSON 命中加分
                        extend_snippet = extracted
                except:
                    pass

            coverage_snippet = None
            if p.get('coverage'):
                try:
                    # 尝试解析 coverage JSON 以获取纯文本 snippet
                    # 数据库中 coverage 可能是 list of strings 或 dict structure
                    cov_content = p['coverage']
                    if isinstance(cov_content, str):
                        try:
                            cov_data = json.loads(cov_content)
                        except:
                            cov_data = cov_content
                    else:
                        cov_data = cov_content
                        
                    # 转换为纯文本供 snippet 提取
                    text_for_snippet = ""
                    if isinstance(cov_data, list):
                        text_for_snippet = " ".join([str(item) for item in cov_data])
                    elif isinstance(cov_data, dict):
                        text_for_snippet = " ".join([f"{k}:{v}" for k,v in cov_data.items()])
                    else:
                        text_for_snippet = str(cov_data)
                        
                    coverage_snippet = SnippetExtractor._get_text_window(text_for_snippet, keyword, 80)
                except Exception as e:
                    # Fallback raw string
                    print(f"Coverage snippet error: {e}")
                    coverage_snippet = SnippetExtractor._get_text_window(str(p['coverage']), keyword, 80)
            
            # 构造返回对象
            results.append({
                "id": p['id'],
                "product_name": p['product_name'],
                "score": score,
                "matches": {
                    "description": desc_snippet,
                    "extend_info": extend_snippet,
                    "coverage": coverage_snippet
                }
            })
            
        # 3. 排序并截取 (Sort & Limit)
        results.sort(key=lambda x: x['score'], reverse=True)
        final_results = results[:limit]
        
        return {"products": final_results}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tools/inspect")
def tool_inspect_product(product_id: int, fields: str, view: str = "full"):
    """
    [工具] 精准查阅接口
    fields: 逗号分隔的字段列表
    view: "full" (默认) 或 "summary" (仅返回结构/Keys)
    """
    try:
        field_list = fields.split(',')
        select_parts = []
        coverage_subkeys = [] # To store requested sub-keys for coverage
        
        for field in field_list:
            field = field.strip()
            
            # Special Handling for 'coverage.xxx'
            if field.startswith('coverage.'):
                # We cannot do SQL extraction because coverage is TEXT (stringified JSON).
                # So we must fetch 'coverage' full and parse in Python.
                subkey = field.split('.', 1)[1]
                coverage_subkeys.append(subkey)
                # Ensure we fetch the base column (avoid dups)
                if '"coverage"' not in select_parts: # simple check
                     select_parts.append("coverage")
                continue

            if '.' in field:
                # 处理 JSON 路径 (Assuming native JSONB columns like extend_info)
                parts = field.split('.')
                col = parts[0]
                json_key = parts[1]
                if not col.replace('_', '').isalnum() or not json_key.replace('_', '').isalnum():
                     continue
                select_parts.append(f"{col}->>'{json_key}' as \"{field}\"")
            else:
                # 普通字段
                if not field.replace('_', '').isalnum():
                    continue
                select_parts.append(f"{field}")
        
        if not select_parts and not coverage_subkeys:
             raise HTTPException(status_code=400, detail="无有效字段")
        
        # Deduplicate select_parts
        select_parts = list(set(select_parts))     
        select_sql = ", ".join(select_parts)
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = f"SELECT {select_sql} FROM insurance_product WHERE id = %s"
        cursor.execute(query, (product_id,))
        result = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not result:
            raise HTTPException(status_code=404, detail="产品未找到")
            
        # [Optimization] Parse 'coverage' & Handle Summary View & Subkeys
        if 'coverage' in result and result['coverage']:
            try:
                # 1. Parse JSON string to List[str]
                coverage_list = json.loads(result['coverage'])
                if isinstance(coverage_list, list):
                    # 2. Convert to Key-Value Dict
                    structured_coverage = {}
                    for item in coverage_list:
                        clean_item = item.replace("• ", "").strip()
                        if "：" in clean_item:
                            parts = clean_item.split("：", 1)
                            structured_coverage[parts[0]] = parts[1]
                        elif ":" in clean_item:
                            parts = clean_item.split(":", 1)
                            structured_coverage[parts[0]] = parts[1]
                        else:
                            structured_coverage[clean_item[:10]] = clean_item
                    
                    # 3. Apply View Logic OR Subkey Selection
                    if coverage_subkeys:
                        # If user asked for specific keys (e.g. coverage.猝死), return only those
                        filtered_coverage = {}
                        for key in coverage_subkeys:
                            if key in structured_coverage:
                                filtered_coverage[key] = structured_coverage[key]
                        
                        # Replace 'coverage' with proper nested structure
                        # e.g. "coverage": { "猝死": "..." }
                        result['coverage'] = filtered_coverage
                        
                    elif view == "summary":
                        # Return ONLY Keys
                        result['coverage_keys'] = list(structured_coverage.keys())
                        del result['coverage'] # Remove heavy content
                    else:
                        # Return Full Content
                        result['coverage'] = structured_coverage
            except Exception as e:
                print(f"Error parsing coverage: {e}")
                pass
        
        # General Summary Logic for other Dict fields
        if view == "summary":
            for k, v in list(result.items()):
                if isinstance(v, dict) and k != 'coverage': # coverage handled above
                    result[f"{k}_keys"] = list(v.keys())
                    del result[k]

        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tools/filter")
def tool_filter_products(
    age_min: Optional[int] = None,
    age_max: Optional[int] = None,
    product_type: Optional[str] = None
):
    """
    [工具] 智能过滤接口
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 基础查询 (Fetch all candidates 1st, Python filtering 2nd)
        query = "SELECT id, product_name, product_type, age_range, extend_info FROM insurance_product WHERE status = 1"
        params = []
        
        if product_type:
            query += " AND product_type = %s"
            params.append(product_type)
            
        cursor.execute(query, params)
        all_products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        filtered_products = []
        import re
        
        for p in all_products:
            # Check Age Range in Python
            is_match = True
            
            # Extract min/max from string like "18-60周岁" or "0-17岁" or "30天-60周岁"
            # Logic: valid if [user_age_min, user_age_max] overlaps with [product_min, product_max]
            # OR simple logic: user_age must be within product range. 
            # Req: filter(age_min=30) -> Means user is 30. Does product allow 30?
            
            p_min = 0
            p_max = 100
            
            if p.get('age_range'):
                # Extract numbers
                nums = re.findall(r'\d+', str(p['age_range']))
                if len(nums) >= 2:
                    p_min = int(nums[0])
                    p_max = int(nums[1])
                elif len(nums) == 1:
                    # handle "60周岁以下" -> min=0, max=60? Or "xxx起" -> min=x, max=100?
                    # Simplify: if only one number, assume it's max if text contains '下', min if '上'/'起'
                    val = int(nums[0])
                    if '下' in p['age_range']:
                        p_max = val
                    else:
                        p_min = val
            
            # Filter Logic:
            # If user provides age_min=30, it usually means "I am 30", or "I want products covering age 30+".
            # Context: "filter(age_min=30)" -> User is 30.
            # So we check if 30 is within [p_min, p_max].
            
            if age_min is not None:
                if not (p_min <= age_min <= p_max):
                    is_match = False
            
            if is_match and age_max is not None:
                # If user provides range? Or verification logic?
                # Assuming simple "user age" check for now.
                if not (p_min <= age_max <= p_max):
                    is_match = False
            
            if is_match:
                # Remove heavy fields
                del p['extend_info'] 
                # del p['age_range'] # Keep for debug?
                filtered_products.append(p)
                
            if len(filtered_products) >= 10:
                break
        
        return {"products": filtered_products}
        
    except Exception as e:
        print(f"Filter Error: {e}")
        import traceback
        traceback.print_exc()
        return {"products": [], "warning": "Filtering failed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
