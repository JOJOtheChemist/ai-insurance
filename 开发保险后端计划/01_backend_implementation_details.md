# AI 保典 后端详细开发规划 (字段与结构说明)

### 1. 核心业务流程
本系统的核心是 **销售人员 (Salesperson)** 对 **客户 (Client)** 的全生命周期服务流：
1. **画像收集**: 销售人员与 AI 聊天，AI 自动提取客户画像（风险、需求）。
2. **方案制定**: 针对特定客户发起“方案制定”对话，AI 根据该客户画像生成具体的保险建议。
3. **档案聚合**: 客户档案页会自动聚合该客户下所有的“方案历史”和“回复记录”。
4. **资产沉淀**: 销售人员可随时查看某位客户在过去半年内生成过哪些方案，并进行对比。

## 2. 前端所需数据结构 (JSON 示例)

### 2.1 客户全景档案接口返回
**接口**: `GET /api/v1/clients/{client_id}`
```json
{
  "id": 1001,
  "name": "王志远",
  "role": "科技公司 CTO",
  "age": 42,
  "annual_budget": "5-8万",
  "annual_income": "800000",
  "location": "北京海淀",
  "marital_status": "已婚育",
  "risk_factors": ["经常应酬", "轻度脂肪肝"],
  "needs": ["保费压力", "子女教育"],
  "resistances": ["嫌贵", "怕套牢"],
  "family_structure": [
    {"relation": "本人", "name": "王志远", "age": 42, "status": "已投保"},
    {"relation": "配偶", "name": "张女士", "age": 38, "status": "正在配置"}
  ],
  "schemes": [
    {"title": "家庭全方位保障计划书", "version": "V2.1", "budget": "8.2万", "status": "优化中"}
  ],
  "follow_ups": [
    {"type": "AI", "content": "王总关心子女教育基金配置...", "time": "2023-10-24 14:20"},
    {"type": "Phone", "content": "愿意考虑高端医疗险，需详细计划", "time": "2023-10-24 13:20"}
  ],
  "contacts": [
    {"name": "林秘书", "role": "助理", "wechat": "LinSec-001"}
  ]
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
| 10 | `risk_factors` | JSONB | 风险点数组 | `risk_factors` |
| 11 | `needs` | JSONB | 需求点数组 | `needs` |
| 12 | `resistances` | JSONB | 抗拒点数组 | `resistances` |
| 13 | `family_structure`| JSONB | 家庭成员列表 (关系、年龄、状态) | `family_structure`|
| 14 | `contacts` | JSONB | 常用联系人 (姓名、职位、联系方式) | `contacts` |
| 15 | `create_time` | DateTime | 创建时间 | - |
| 16 | `update_time` | DateTime | 最后更新时间 | `last_interaction` |

### 3.2 `follow_ups` 表 (跟进记录)
为了支持时间轴显示，跟进记录建议独立建表。
| 序号 | 字段名 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| 1 | `id` | BigInt (PK) | 记录唯一ID |
| 2 | `client_id` | BigInt (FK) | 归属客户 |
| 3 | `type` | String(20) | 类型 (AI总结、电话、微信、面谈) |
| 4 | `content` | Text | 跟进内容详情 |
| 5 | `create_time` | DateTime | 跟进时间 |

### 3.2 `chat_sessions` 表 (会话管理与方案制定历史)
本表记录了针对特定客户进行的每一次“保险方案制定”对话。一个客户可以拥有多个独立命名的会话。

| 序号 | 字段名 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| 1 | `id` | String (PK) | 会话唯一ID (如 `session-173...`) |
| 2 | `client_id` | BigInt (FK) | **(关键)** 归属哪个客户 |
| 3 | `salesperson_id` | BigInt (FK) | 归属哪个销售人员 |
| 4 | `title` | String(100) | 对话标题 (如：2024重疾险方案制定) |
| 5 | `summary` | String(255) | 该次对话的 AI 谈话简报 |
| 6 | `status` | String(20) | 状态：进行中、已生成方案、已关闭 |

---

## 4. 客户多维对话历史检索逻辑
当销售人员打开某个客户的详情页时，系统需提供以下查询能力：
1. **全量聚合**: `GET /api/v1/clients/{client_id}/sessions` 获取该客户下所有的 AI 对话历史列表。
2. **场景分类**: 区分“画像收集类”对话与“方案建议类”对话（可通过 `title` 或元数据区分）。
3. **快速切换**: 点击任一历史会话，前端应加载该 `sessionId` 对应的完整聊天记录流。

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
