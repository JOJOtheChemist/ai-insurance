# 后端模型创建总结 (2025-12-22)

在刚才的步骤中，我已经在 `insurance-product-backend` 中建立了支撑客户全景档案的核心数据模型。

## 1. 新创建的 Python 模型 (SQLAlchemy)

| 模型文件 | 表名 | 核心功能 |
| :--- | :--- | :--- |
| `models/client.py` | `clients` | 存储画像、风险、需求、抗拒点、预算等 JSON 字段。 |
| `models/family_member.py` | `client_family` | 记录家庭成员、关系、年龄及保险状态。 |
| `models/follow_up.py` | `follow_ups` | 对话总结流、电话跟进、微信联系等时间轴数据。 |
| `models/chat_session.py` | `chat_sessions` | 逻辑关联：将 SDK 的 sessionId 映射到具体客户/销售，且支持“无客户”状态。 |

## 2. 逻辑架构说明
- **模型注册**: 已在 `main.py` 中引入这些模型。
- **自动建表**: 系统启动（或重启）时，FastAPI 的 `Base.metadata.create_all` 会自动在数据中创建对应的物理表。

---

## 3. 下一步：AI 工具集成 (Tool Creation)

为了让 AI 驱动上述数据的更新，我们需要在 `kode-sdk` 层面完成以下动作：

### 3.1 工具定义与注册
- **目录位置**: 需在 `kode-sdk/src/tools` 或类似目录下创建 TypeScript 工具定义。
- **数据验证**: 在工具内部使用 Zod 或类 Pydantic 逻辑进行参数校验。
- **差异化逻辑**: 
    - 工具调用时，先从保险后端 `GET` 当前数据。
    - 进行差异化合并（比如数组追加，而非覆盖）。
    - 最终调用保险后端的原子化 `PATCH/POST` 接口。

### 3.2 代理配置同步
- 在 `kode-sdk/src/agents/insure-recommand-v3.ts` 中引入新工具。
- **重启生效**: 需要重启 `kode-sdk` 服务器（tsx/ts-node），触发 Agent 的重载和工具的动态注册。

---

**已完成工作**: ✅ 后端数据库骨架  
**待开始工作**: 🛠️ `kode-sdk` 端的智能更新工具开发
