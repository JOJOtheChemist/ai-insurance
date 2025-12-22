# AI 驱动的数据更新与工具集成方案

为了实现 AI 能够根据对话内容“聪明地”更新客户全景档案，我们采用 **“前端高度聚合，后端原子化 API，AI 逻辑拆解”** 的分层设计。

## 1. 核心表结构回顾 (Database Models)

后端将建立以下核心表，以支持原子化更新：
1. **`clients`**: 存储基础画像（姓名、职业、预算、风险点、需求点、抗拒点等）。
2. **`client_family`**: 存储家庭成员结构（支持一对多关系）。
3. **`client_contacts`**: 存储联系人系统。
4. **`follow_ups`**: 存储跟进流水（支持 AI 总结、手动录入等）。
5. **`chat_sessions`**: 存储对话元数据及与 `client_id` 的关联。

## 2. API 设计：原子化与差异化更新

我们不推荐一个 API 更新所有内容，而是采用原子化设计（Atomic Update），这样可以减少数据冲突并提高 AI 调用成功率：

- `PATCH /api/clients/{id}/profile`: 更新画像、风险点、需求等基础 JSON 字段。
- `POST /api/clients/{id}/family`: 新增或全量覆盖家庭成员。
- `POST /api/clients/{id}/follow-up`: 记录本次对话的 AI 总结。
- `PATCH /api/chat-sessions/{id}/link`: 将当前会话挂靠到特定客户。

## 3. AI 工具集成方案 (AI Tool/Function Calling)

AI 执行更新时，推荐采用 **“单一入口工具 + 后端逻辑分发”** 的模式。

### 3.1 定义超级工具：`update_client_intelligence`
AI 只需要知道这一个工具，在该工具的参数中，我们定义多个可选的“更新包”：

```json
{
  "name": "update_client_intelligence",
  "description": "根据对话提取的信息，更新客户档案、记录跟进进度或管理家庭成员",
  "parameters": {
    "type": "object",
    "properties": {
      "clientId": { "type": "string" },
      "profileUpdates": { 
        "type": "object",
        "description": "画像差异化更新，如风险点、需求点" 
      },
      "followUpSummary": { 
        "type": "string",
        "description": "基于本次对话生成的阶段性摘要" 
      },
      "familyMembers": {
        "type": "array",
        "items": { "type": "object" },
        "description": "新识别出的家庭成员信息"
      }
    }
  }
}
```

### 3.2 更新策略：差异化计算 (Diff Computing)

1. **AI 端拆解**:
   - AI 在对话过程中，如果发现客户提到“家里有个5岁小孩”，它会自动构造带有 `familyMembers` 的工具调用请求。
   - 如果发现客户提到“主要是怕本金亏损”，它会构造带有 `resistances: ["怕亏损"]` 的请求。

2. **后端差异化合并**:
   - 后端接收到 `profileUpdates` 后，**不是直接替换**，而是进行**增量合并 (Incremental Update)**。
   - 例如：原有风险点是 `["脂肪肝"]`，AI 传回 `["经常应酬"]`，最终存入数据库的是 `["脂肪肝", "经常应酬"]`。

3. **前端实时响应**:
   - 后端更新成功后返回最新的全景 JSON。
   - 前端监听到 Socket 或 SSE 消息，右侧卡片无需刷新页面，通过 React State 实现数据字段的高亮闪烁更新。

## 4. 实施阶段序号

1. **[后端]** 定义 SQLAlchemy 模型类，建立外键关联。
2. **[后端]** 实现增量合并逻辑函数 `smart_merge_metadata(old, new)`。
3. **[SDK]** 在 `insure-recommand-v3` 中注册 `update_client_intelligence` 工具。
4. **[前端]** 对接 `CustomerProfilePanel` 的数据更新监听流。
