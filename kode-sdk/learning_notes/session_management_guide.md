# 会话管理模块（Session Management）学习指南

## 1. 核心读取逻辑理解

在 `server/modules/session-management/service.ts` 中，有两行核心代码用于加载会话：

```typescript
const meta = sessionStorage.readMeta(agentId);
const messages = sessionStorage.readMessages(agentId);
```

### 代码含义
这两行代码的作用是**从文件系统中恢复一个已存在的会话状态**。

- **`sessionStorage.readMeta(agentId)`**
  - **动作**：读取 `.kode/<agentId>/meta.json` 文件。
  - **内容**：会话的“身份证”信息。
  - **包含数据**：
    - `created`: 创建时间
    - `updated`: 最后更新时间
    - `customName`: 用户自定义的会话标题
    - `userId`: 所属用户 ID（如果是多用户模式）

- **`sessionStorage.readMessages(agentId)`**
  - **动作**：读取 `.kode/<agentId>/runtime/messages.json` 文件。
  - **内容**：会话的“记忆”数据。
  - **包含数据**：一个数组，包含所有历史对话记录（用户发送的消息 + AI 回复的消息）。

### 底层原理
这两个方法封装在 `storage.ts`（或 `multi-user-storage.ts`）中，本质上是 Node.js 的文件读写操作（`fs.readFileSync` + `JSON.parse`）。

---

## 2. 文件夹写入与序号生成理解

### 文件夹是如何被“写入”的？
当创建一个新会话时，后端执行的是**写入（Write）**操作，而非读取。

1. **路径生成**：
   后端会根据传入的 `userId` 和 `agentId`（会话ID）拼接出存储路径。
   - 路径示例：`.kode/<userId>/<agentId>/`

2. **自动创建**：
   代码（如 `multi-user-storage.ts` 中的 `createSession` 方法）会检查该路径是否存在。如果不 存在，它会使用 `fs.mkdirSync(path, { recursive: true })` 自动创建文件夹结构。

### “标上序号”是怎么实现的？
在目前的 `kode-sdk` 代码逻辑中，**后端并不负责自动生成 "1, 2, 3" 这样的序号**。

目前的逻辑是 **“前端主导”**：
- **前端生成 ID**：前端在发起请求前，生成一个唯一的 `sessionId`（可能是 UUID，也可能是前端自己维护的 `session-1`）。
- **后端被动接收**：后端接收到这个 ID 后，直接用它作为文件夹的名字。

### 如果想在后端实现自动递增序号
如果你希望后端自动管理序号（例如：自动创建 `session-1`, `session-2`），你需要修改创建会话的逻辑：

1. **扫描现有会话**：读取用户目录下所有的文件夹名。
2. **计算最大序号**：解析文件夹名中的数字，找出最大值（Max ID）。
3. **生成新序号**：将最大值 +1，作为新文件夹的名字。
4. **创建文件夹**：使用新生成的 ID 创建文件夹。

## 3. SessionId vs AgentId：关键区别

你在代码中可能会看到 `sessionId` 和 `agentId` 混用的情况，这确实容易混淆。以下是它们的区别：

### 核心区别

*   **`sessionId` (会话ID)**: 
    *   **定义**：代表用户的一次具体聊天记录（即那个文件夹的名字）。
    *   **作用**：用于存储和区分不同的聊天历史。
    *   **示例**：`session-123` (如果前端生成UUID) 或 `schedule-assistant` (如果用户没传ID，后端用了默认值)。

*   **`agentId` (Agent 类型/配置ID)**:
    *   **定义**：代表“你是谁”，即你正在和哪个 AI 助手聊天。
    *   **作用**：决定了使用哪个 Prompt 模板、哪些工具（Tools）以及哪个模型。
    *   **示例**：`schedule-assistant` (日程助手), `coding-assistant` (编程助手)。

### 代码中的混用与策略

在 `server/routes/chat.ts` 和 `agent-service.ts` 中，有一个非常重要的**兼容性策略**：

1.  **前端只传 `agentId` (老逻辑/兼容模式)**：
    *   如果没有 `sessionId`，系统直接把 `agentId` 当作 `sessionId` 用。
    *   **结果**：你的文件夹名字就变成了 `schedule-assistant`。这就导致你看到的“用 agent 名字命名 session”。
    *   **缺点**：同一个 Agent 类型只能有一个聊天历史，如果你刷新页面再聊，还是同一个历史记录。

2.  **前端同时传 `sessionId` 和 `agentId` (新逻辑/多会话模式)**：
    *   `agentId` 依然用来加载配置（知道你是日程助手）。
    *   `sessionId` 用来创建文件夹（存储聊天记录）。
    *   **后端内部处理**：为了在内存中区分不同的实例，后端会构造一个**复合 ID**：
        `agentIdForSession = ${userId}:${sessionId}:${agentId}`
    *   **结果**：
        *   **配置**：用 `schedule-assistant` 的配置。
        *   **存储**：存在 `.kode/<userId>/<sessionId>/` 目录下。

### 总结
你发现“用 Agent 名字命名 Session”，是因为在发请求时：
1.  前端**没有传 `sessionId`**，或者 `sessionId` 为空。
2.  后端执行了 `const actualSessionId = sessionId || agentId;` 这样的兜底逻辑。

## 4. Agent 模板的决定与“全新对话”的产生

### 谁决定了调用哪个模板？
答案：**`agentId`** 参数。

1.  **前端请求**: 前端发请求时会带上 `agentId`（例如 `schedule-assistant`）。
2.  **后端查找**: 
    *   在 `server/routes/chat.ts` 中调用 `getAgentConfig(agentId)`。
    *   这个函数去 `server/agents/index.ts` 的注册表中查找对应的配置对象。
    *   配置对象里定义了 `systemPrompt` (人设), `tools` (工具列表), `modelId` (模型) 等关键信息。

### 为什么每次都是“全新的对话记录”？
这取决于你是否传了 **`sessionId`**。

#### 情况 A：兼容模式（你现在的感受）
*   **前端传参**: `agentId: 'schedule-assistant'`, `sessionId: null` (或不传)
*   **后端行为**: 
    *   将 `sessionId` 设为 `schedule-assistant`。
    *   去读取 `.kode/<userId>/schedule-assistant/runtime/messages.json`。
    *   **结果**: 其实**不是**全新对话，而是**所有对话都混在一起**。如果你觉得是全新的，可能是因为你手动删除了文件夹，或者前端自己没有显示之前的历史。

#### 情况 B：多会话模式（推荐）
*   **前端传参**: `agentId: 'schedule-assistant'`, `sessionId: 'session-123'` (前端生成的新UUID)
*   **后端行为**:
    *   **加载模板**: 根据 `schedule-assistant` 加载日程助手的配置。
    *   **创建存储**: 在 `.kode/<userId>/session-123/` 创建**全新**的文件夹。
    *   **初始化**: 文件夹里是空的，所以是从零开始的全新对话。
*   **结果**: 真正的全新对话，且历史记录互不干扰。

### 总结流程图
```
前端请求 (agentId="xxx", sessionId="yyy")
      ↓
1. 决定模板 (Who): 根据 agentId="xxx" 去 agents/index.ts 找配置 (Prompt, Tools)
      ↓
2. 决定存储 (Where): 
      若 sessionId="yyy" → 读写 .kode/user/yyy/ (新文件夹=新对话)
      若 sessionId=null  → 读写 .kode/user/xxx/ (旧文件夹=混杂对话)
```

## 5. 参数与重命名逻辑（Clarification）

### Q1: 创建新对话必须同时传入 `agentId` 和 `sessionId` 吗？
**是的，必须同时传入。**

*   **`agentId` (必填)**：告诉后端你要“雇佣”谁（比如雇佣保险顾问）。如果不传，后端就不知道该加载什么知识库和工具。
*   **`sessionId` (必填)**：告诉后端你要“在哪里”聊天。如果不传，后端就会默认用 `agentId` 当作房间名，导致这间房里挤满了所有人（历史记录混杂）。

### Q2: 后端会把 `agentId` 重命名吗？
**不会。**

你可能误解了代码中的逻辑。让我们看看 `server/services/agent-service.ts` 里到底发生了什么：

```typescript
// agent-service.ts 第 36-50 行 (简化版)
const parts = agentId.split(':'); // agentId 此时是复合字符串: "userId:sessionId:agentType"

if (parts.length === 3) {
  const [userId, sessionId, agentType] = parts;
  
  // 1. 确定存储根目录
  storePath = `./.kode/${userId}`; 
  
  // 2. 确定子目录名 (这就是文件夹的名字)
  storeAgentId = sessionId; 
}
```

**后端并没有“重命名” Agent，而是：**
1.  它拿到了一个复合字符串（包含了 用户+会话+类型）。
2.  它从中**拆解**出了 `sessionId`。
3.  它直接用拆解出来的 `sessionId` 作为文件夹的名字。

**所以：**
*   不是把 `insure-recommand-v1` 重命名为 `session-123`。
*   而是根据你的指令，**加载** `insure-recommand-v1` 的大脑，然后**坐进** `session-123` 这个房间里跟你聊天。

## 6. 为什么文件夹名字“变了”？（终极解答）

你现在的疑惑是：
> “我的 Agent ID 只有一个（insure-recommand-v1），为什么文件夹名字却变成了 insure-test-session-1？”

这正说明你的系统工作在**多会话模式（Multi-Session Mode）**下，这是完全正常的，也是正确的。

### 事实核查
我查看了你的 `.kode` 目录，现在的结构是这样的：

```text
.kode/
  └── yeya/  (用户目录)
      ├── insure-test-session-1/  (会话A)
      │   ├── runtime/
      │   └── meta.json
      └── insure-test-session-2/  (会话B)
          ├── runtime/
          └── meta.json
```

### 为什么会这样？
因为**文件夹的名字从来就不是用来存 Agent ID 的**。

*   **以前（兼容模式）**：你没传 `sessionId`，后端偷懒，把 Agent ID (`insure-recommand-v1`) 当作了文件夹名。所以你觉得“文件夹名 = Agent名”。
*   **现在（多会话模式）**：你传了 `sessionId` (`insure-test-session-1`)，后端就乖乖地用 `sessionId` 作为文件夹名。

### 那 Agent ID 去哪了？
既然文件夹名字变成了 Session ID，那后端怎么知道这个会话属于哪个 Agent 呢？
答案：**它不需要存在文件夹名字里。**

1.  **即时加载**：每次你发请求，前端都会再次把 `agentId: 'insure-recommand-v1'` 传给后端。后端拿到这个参数，就知道该去加载哪个模板。
2.  **元数据存储**：如果你想在历史记录里查到“这个会话当初是用哪个 Agent 创建的”，后端通常会把 `agentId` 写入到文件夹里的 `meta.json` 文件中（虽然这不影响运行逻辑，主要用于记录）。

### 结论
**文件夹名字变了，不是因为 Agent 被重命名了，而是因为你正在使用更高级的“房间号”机制。**
你完全可以有 100 个不同的文件夹（`session-1` 到 `session-100`），它们全都使用同一个 Agent (`insure-recommand-v1`) 来进行服务。这正是我们想要的效果！

## 7. 副本与模板的概念（Confirm）

### 你的理解完全正确！
> “每一个会话都重新创建了一个 Agent 的副本，按照那个模板。”

是的，这正是面向对象编程（OOP）中 **“类（Class）”与“实例（Instance）”** 的关系。

*   **模板 (Template)** = **类 (Class)**
    *   这就是 `insure-recommand-v1`。
    *   它是一张**蓝图**，定义了死规矩：
        *   Prompt: "你是一个专业的保险顾问..."
        *   Tools: [计算器, 搜索工具]
        *   Model: Claude 3.5 Sonnet
    *   这张蓝图只有一份，放在代码里。

*   **副本 (Instance)** = **实例 (Object)**
    *   这就是你在运行时创建的每一个 **Agent 对象**。
    *   当你开启 `session-1` 时，系统照着蓝图复印了一份，生成了 `Agent_Instance_1`。
    *   当你开启 `session-2` 时，系统又照着蓝图复印了一份，生成了 `Agent_Instance_2`。

### 为什么需要副本？
因为每个副本需要维护自己**独立的状态**：
1.  **短期记忆（Context）**：`Instance_1` 记得你说过“我今年 30 岁”；`Instance_2` 可能完全不知道这事，因为那是另一场对话。
2.  **执行状态**：`Instance_1` 可能正在思考（Thinking）；而 `Instance_2` 可能已经聊完了。

### 总结
你理解得非常到位：
**Agent ID 是模具，Session 是用模具印出来的一个个独立的蛋糕。**

## 8. 为什么 meta.json 里写的 AgentId 是 Session 名字？

### 现象确认
你非常细心地发现了 `meta.json` 里的内容：
```json
{
  "agentId": "insure-test-session-1",          // <--- 这里写的是 Session 的名字！
  "templateId": "insure-recommand-v1-template" // <--- 这里才是真正的模板 ID
}
```

### 解释
这看起来确实像是把“每次对话都作为一个新的 Agent 名字”。
**是的，在底层的存储视角（Store View）来看，确实如此。**

这里涉及两个不同层面的“命名”：

1.  **逻辑层（业务视角）**：
    *   Agent = 那个会推荐保险的“专家”（insure-recommand-v1）。
    *   Session = 你和专家的一次聊天（insure-test-session-1）。

2.  **物理层（存储视角）**：
    *   SDK 的底层（`kode-sdk/src/agent.ts`）并不懂什么是“业务”，它只认**“一个 ID 对应一个文件夹”**。
    *   为了让底层 SDK 能乖乖地把数据存到 `insure-test-session-1` 这个文件夹里，我们在初始化底层对象时，**故意欺骗**了它，把 `agentId` 属性设置成了文件夹的名字。

### 代码实锤
在 `server/services/agent-service.ts` 中，有这样一段“偷梁换柱”的代码：

```typescript
// 我们传给底层 Agent 构造函数的参数
agent = await Agent.create({
    agentId: storeAgentId, // <--- 注意！这里把 sessionId (insure-test-session-1) 赋值给了 agentId
    templateId: agentConfig.templateId, // 这里保留了真正的模板 ID
    ...
});
```

### 结论
*   **你看到的现象是对的**：在生成的 `meta.json` 文件里，`agentId` 字段确实被写成了 `insure-test-session-1`。
*   **但这只是为了存储**：这只是为了让底层系统知道数据该存哪个文件夹。
*   **并不影响逻辑**：真正的“身份”是由 `templateId` (`insure-recommand-v1-template`) 决定的，它决定了 AI 的 Prompt 和工具。

## 9. 动态创建 Agent 需要重启吗？

### 核心答案：不需要。

你担心的点是：“新 Agent 需要注册才能拥有工具和权限，那每次新对话创建一个新 Agent，是不是要重启后端来注册它？”

答案是 **不需要**。这里有一个关键的概念区分：**全局静态注册 vs 实例动态组装**。

### 1. 全局静态注册 (Server Start)
**只需做一次，且是在后端启动时完成的。**
在 `server/index.ts` 或 `agents/index.ts` 中，我们注册的是**“零件库”**：
*   **注册工具**：把 `calculator`、`search` 等工具的代码加载进内存。
*   **注册模板**：把 `insure-recommand-v1` 的 Prompt 和配置加载进内存。

这些“零件”一旦启动好，就一直在内存里等着被使用。

### 2. 实例动态组装 (Runtime)
**每次用户发起新对话时发生，毫秒级完成，无需重启。**
当你请求 `session-123` 时，后端代码（`agent-service.ts`）在**运行时（Runtime）**执行了以下操作：

1.  **拿图纸**：从内存里取出 `insure-recommand-v1` 的配置（Template）。
2.  **拿零件**：从内存里取出 `calculator` 等工具（Tools）。
3.  **组装**：`new Agent()`。创建一个新的对象，把图纸和零件塞给它。
4.  **分配房间**：指定它去 `session-123` 文件夹工作。

### 打个比方
*   **重启后端** = **开一家乐高店**。你需要把所有的积木（工具）和说明书（模板）都摆在货架上。这只需要做一次。
*   **创建新会话** = **卖出一盒乐高**。顾客来了（发起会话），你从货架上拿一盒积木，照着说明书拼好给他。你不需要为了卖一盒新乐高而重新装修店铺（重启后端）。

### 结论
**“注册”是指把模板和工具加载到内存中，这确实需要重启生效（如果你改了代码）。**
**但“创建 Agent 实例”只是在内存里 `new` 了一个对象，这是动态的、瞬间的，完全不需要重启。**
