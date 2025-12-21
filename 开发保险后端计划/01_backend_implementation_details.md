# AI 保典 后端详细开发规划 (字段与结构说明)

## 1. 核心业务流程
本系统的核心是 **销售人员 (Salesperson)** 对 **客户 (Client)** 的服务流。
1. **录入/识别**: 销售人员开始对话，AI 自动从对话中提取客户画像。
2. **存档**: 后端实时更新客户的风险点和需求点。
3. **转化**: 销售人员根据累积的客户画像，匹配合适的保险产品。

## 2. 前端所需数据结构 (JSON 示例)

### 2.1 客户详情接口返回 (用于客户画像卡片)
**接口**: `GET /api/v1/clients/{client_id}`
```json
{
  "id": 1001,
  "name": "王志远",
  "role": "互联网大厂架构师",
  "age": 35,
  "annual_budget": "2-3万",
  "marital_status": "已婚已育",
  "annual_income": "600000",
  "location": "北京",
  "risk_factors": [
    "长期加班导致身体亚健康",
    "作为家庭唯一经济支柱",
    "房贷压力大"
  ],
  "needs": [
    "重疾保障 (50万+)",
    "高端医疗 (免排队)",
    "子女教育金"
  ],
  "last_interaction": "2025-12-21 14:00:00"
}
```

### 2.2 销售人员个人信息 (用于 UserProfile)
**接口**: `GET /api/v1/users/me`
```json
{
  "id": 2,
  "username": "demon",
  "stats": {
    "total_clients": 42,
    "total_plans": 128,
    "saved_hours": 15
  },
  "membership": {
    "level": "PRO 会员",
    "balance": 2450.0,
    "expire_date": "2025-12-31"
  }
}
```

---

## 3. 数据库表结构设计 (SQL 字段)

### 3.1 `clients` 表 (客户档案)
| 序号 | 字段名 | 类型 | 说明 | 对应前端字段 |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | BigInt (PK) | 客户唯一ID | `id` |
| 2 | `salesperson_id` | BigInt (FK) | 关联所属销售人员 (User.id) | - |
| 3 | `name` | String(50) | 客户姓名 | `name` |
| 4 | `role` | String(100) | 职业/身份 | `role` |
| 5 | `age` | Integer | 年龄 | `age` |
| 6 | `annual_budget` | String(50) | 投保预算 | `annual_budget` |
| 7 | `marital_status`| String(50) | 婚姻状态 | `marital_status` |
| 8 | `annual_income` | String(50) | 年收入 | `annual_income` |
| 9 | `location` | String(100) | 所在区域 | `location` |
| 10 | `risk_factors` | JSONB | **(重要)** 存储风险点字符串数组 | `risk_factors` |
| 11 | `needs` | JSONB | **(重要)** 存储需求点字符串数组 | `needs` |
| 12 | `create_time` | DateTime | 创建时间 | - |
| 13 | `update_time` | DateTime | 最后更新时间 | `last_interaction` |

### 3.2 `chat_sessions` 表 (会话管理)
| 序号 | 字段名 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| 1 | `id` | String (PK) | 会话ID (如 `session-173...`) |
| 2 | `client_id` | BigInt (FK) | 关联客户 |
| 3 | `salesperson_id` | BigInt (FK) | 关联销售人员 |
| 4 | `summary` | String(255) | 谈话简报 |

---

## 4. 后端开发步骤序号

1. **第一阶段：数据库扩展 (DB Migration)**
   - 1.1 创建 `clients` 业务表。
   - 1.2 为 `user_profile` 增加余额和积分字段。
   - 1.3 建立销售与客户的一对多外键关联。

2. **第二阶段：基础 CRUD API 开发**
   - 2.1 实现客户列表分页查询接口。
   - 2.2 实现客户画像详情查询。
   - 2.3 开发客户画像手动/自动更新接口 (`PATCH`)。

3. **第三阶段：AI 洞察同步逻辑 (Core Logic)**
   - 3.1 编写中间件，拦截 `/api/chat` 的 AI 返回值。
   - 3.2 提取 JSON 中的 `customer_profile` 对象。
   - 3.3 逻辑判断：若发现新的 `risk_factors` 或 `needs`，立即增量更新至 `clients` 表。

4. **第四阶段：个人中心与会员权益**
   - 4.1 统计该销售下的客户总数和方案总数。
   - 4.2 实现会员到期检查和算力扣费逻辑。

5. **第五阶段：前端全量调优**
   - 5.1 将前端 Page 中的静态 Mock 数据替换为真实的 Axios 请求。
   - 5.2 验证“对话 -> 画像更新 -> 个人页统计增加”的完整闭环。
