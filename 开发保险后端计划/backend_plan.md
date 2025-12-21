# AI 保典 后端开发计划 (销售辅助系统版)

## 1. 项目定位与核心逻辑
本系统是一个 **销售辅助工具 (Sales Assistant)**。
- **用户 (User/UserSystem)**: 注册账号均为 **保险销售人员**。
- **客户 (Client/Customer)**: 销售人员管理的潜在投保人。
- **核心场景**: 销售与 AI 配合对客户进行画像提取。AI 在对话中识别出客户的 **风险点** 和 **需求点**，后端需将这些“洞察”持久化到客户档案中，辅助销售制定方案。

## 2. 数据库架构升级 (核心)

### 2.1 销售-客户 关系模型
- **`clients` 表 (新)**:
  - `id`: 主键
  - `salesperson_id`: 关联 `user.id` (谁管理的客户)
  - `name`: 客户姓名
  - `age`, `gender`, `annual_income`, `annual_budget`, `location`: 基础画像
  - `risk_factors`: **(核心)** JSONB 数组，存储 AI 提取的风险点。
  - `needs`: **(核心)** JSONB 数组，存储 AI 提取的需求点。
  - `marital_status`, `role`: 补充信息。
  - `last_interaction`: 最后跟进时间。

### 2.2 聊天与洞察同步
- **`chat_sessions` 表 (新)**:
  - 关联 `salesperson_id` 和 `client_id`。
  - 记录每个客户的独立对话历史。

## 3. 功能开发重点

### 3.1 以客户为中心的列表与画像 API
- `GET /api/v1/clients`: 获取该销售下所有的客户名单及其画像简报。
- `GET /api/v1/clients/{id}`: 查看特定客户的详细画像（含风险/需求动态更新）。
- `PATCH /api/v1/clients/{id}`: AI 识别到新标签后，自动同步更新到数据库字段。

### 3.2 销售辅助 AI 对话 (Insight Sync)
- 改进 `/api/chat` 逻辑：当 AI 返回包含 `customer_profile` 的 JSON 时，后端需自动解析并更新 `clients` 表中对应的风险和需求字段，无需销售手动修改。

### 3.3 数字分身与会员服务 (销售个人品牌)
- **数字人**: 销售上传自己的视频/语音，合成“数字销售分身”。
- **积分系统**: 销售使用 AI 功能（如自动生成保险方案、数字人演播）需消耗点数。

## 4. 现有资源复用
- **产品检索**: 依旧复用 `main.py` 的 `Tool` 类接口，为客户匹配合适的产品。
- **DB 设计**: 将 `数据库设计文档.md` 中的 `member` 和 `subscription` 逻辑对应到 **销售人员** 的会员权益。

## 5. 立即执行计划
1. **[重要]** 建立 `clients` 表，结构必须完整覆盖前端 `CustomerProfile` 的所有动态字段（风险/需求/预算等）。
2. 实现“销售-客户”一对多逻辑。
3. 对接 AI 对话的“自动落库”功能。
