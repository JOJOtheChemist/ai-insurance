# Agent 深度解析：文件夹、沙箱与动态配置

这份文档旨在深入剖析 `kode-sdk` 中 Agent 的运行时行为，回答关于存储、沙箱以及动态配置的核心问题。

## 1. “分配房间”：文件夹 vs 沙箱

你问到：“这个新文件夹（session-123）是什么意思？这个是沙箱吗？”

**答案：不是。文件夹和沙箱是两个不同的概念。**

### A. 会话文件夹 (Storage Directory)
*   **路径**：`.kode/yeya/insure-test-session-1/`
*   **作用**：这是 Agent 的**“大脑记忆区”**。
*   **存放内容**：
    *   `meta.json`：身份证（我是谁，我什么时候出生的）。
    *   `runtime/messages.json`：聊天记录（短期记忆）。
    *   `events/`：发生的事件日志。
*   **性质**：它是**持久化存储**。就算服务器重启，这里面的东西也不会丢。

### B. 沙箱 (Sandbox / Workspace)
*   **路径**：通常在项目根目录下的 `workspace/` 或者系统临时目录（取决于 `config.agent.workDir` 配置）。
*   **作用**：这是 Agent 的**“办公桌”**。
*   **存放内容**：
    *   Agent 编写的代码文件（比如它写了一个 Python 脚本）。
    *   Agent 生成的图表、Excel 文件。
    *   Agent 读取的临时数据。
*   **性质**：它是**工作环境**。它提供了一个隔离的环境，让 Agent 可以在里面执行命令（如 `fs.write`, `npm install`），而不会破坏你项目原本的代码。

### 总结
*   **文件夹 (`.kode/...`)** = **日记本**（存记忆）。
*   **沙箱 (`workspace/`)** = **草稿纸**（干活的地方）。
*   当我们说“分配房间”时，通常是指**分配日记本（存储路径）**，让它知道把聊天记录写在哪里。

---

## 2. “动态”的真正含义

你问到：“动态什么意思？你说是把这个模板里面提示词和工具都放到内存里。”

这里有两个层面的“动态”：

### A. 静态资源 (Static Assets) - "货架上的商品"
*   **发生时间**：服务器启动时。
*   **行为**：代码把 `insure-recommand-v1` 的配置（Prompt 字符串、工具函数代码）从文件里读出来，存到一个全局变量（Map）里。
*   **状态**：此时它们只是死数据，静静地躺在内存里，没人去用它们。

### B. 动态实例化 (Dynamic Instantiation) - "售出的商品"
*   **发生时间**：用户点击“发送”按钮的那一毫秒。
*   **行为**：
    1.  代码执行 `new Agent(...)`。
    2.  计算机在内存里**新开辟了一块空间**。
    3.  把刚才躺在全局变量里的 Prompt 和工具**复制**（或引用）一份，塞进这块新空间。
    4.  同时，给这块新空间绑定了特定的 `sessionId`（日记本）。
*   **结果**：产生了一个**活的** Agent 对象。它有自己的状态（正在思考、正在说话），并且只为这一个 Session 服务。

---

## 3. 高级玩法：我可以动态修改 Prompt 和工具吗？

你问到：“那如果说我动态创建新的 Agent 的话，我可以给他动态分配提示词和工具吗？还是说只能按照这个模板？”

**答案：绝对可以！你完全不必死守模板。**

虽然目前的示例代码（`agent-service.ts`）主要是照搬模板，但在底层 SDK (`src/agent.ts`) 的设计中，支持**“覆盖（Override）”**机制。

### 场景 1：默认情况（照搬模板）
```typescript
// 当前的代码逻辑
const template = registry.get('insure-recommand-v1');
const agent = new Agent({
  systemPrompt: template.systemPrompt, // 直接用模板的
  tools: template.tools                // 直接用模板的
});
```

### 场景 2：动态修改（魔改）
你完全可以在创建 Agent 之前，根据用户的特殊需求，**临时修改**传进去的参数。

#### 例子 A：动态追加 Prompt（个性化）
假设前端传了一个参数 `userMood: "angry"`（用户很生气），你想让 Agent 变得卑微一点。

```typescript
// 伪代码：在创建 Agent 前动态修改 Prompt
let prompt = template.systemPrompt;

if (req.body.userMood === 'angry') {
  // 动态追加一段提示词
  prompt += "\n\n【重要指令】用户现在很生气，请你务必使用最谦卑、最温和的语气回答，多道歉。";
}

const agent = new Agent({
  systemPrompt: prompt, // <--- 用的是修改后的 Prompt！
  tools: template.tools
});
```
**结果**：这个 `session-123` 里的 Agent 会特别卑微，而其他 Session 的 Agent 依然正常。这就是**动态**的魅力。

#### 例子 B：动态增减工具（权限控制）
假设如果是 VIP 用户，多给他一个“高级分析工具”。

```typescript
// 伪代码
let tools = [...template.tools]; // 复制一份工具列表

if (user.isVIP) {
  tools.push('premium-analysis-tool'); // 动态塞入一个新工具
} else {
  // 普通用户，移除某些工具
  tools = tools.filter(t => t !== 'expensive-tool');
}

const agent = new Agent({
  systemPrompt: template.systemPrompt,
  tools: tools // <--- 用的是修改后的工具列表！
});
```

### 总结
*   **模板只是起跑线**：它提供了一个默认配置，省得你每次都重写。
*   **创建时可以“加料”**：在 `new Agent()` 的那一刻，你拥有上帝权限，可以随意修改塞给它的 Prompt 和工具。
*   **互不影响**：因为每个 Agent 都是独立的实例，你给 A 改了 Prompt，完全不会影响到 B。

## 4. 沙箱在哪里？

你问到：“我没有看到沙箱啊。`.kode/.../runtime` 这个是沙箱吗？”

**答案：不是。**

### 1. `.kode/.../runtime` 是什么？
这个目录（如 `/Users/yeya/.../.kode/yeya/insure-test-session-2/runtime`）是**存储层**的一部分。
*   它里面主要存放 `messages.json`。
*   这相当于 Agent 的“大脑皮层”，用来存长短期记忆。
*   它**不是**沙箱。

### 2. 沙箱 (Sandbox) 在哪里？
根据你的配置文件 `server/config/index.ts`：

```typescript
// server/config/index.ts 第 26 行
workDir: './workspace',
```

沙箱应该位于你的项目根目录下，名字叫 **`workspace`**。

#### 为什么你没看到？
这可能是因为：
1.  **它还没被创建**：如果 Agent 还没有执行过需要读写文件的操作（比如写代码、保存图片），这个目录可能还不存在。
2.  **它是空的**：可能创建了但里面没东西。

### 3. 逐行解析你看到的代码

你提到了这段关键代码：

```typescript
agent = await Agent.create(
  {
    agentId: storeAgentId, // 使用简化的存储ID
    templateId: agentConfig.templateId,
    sandbox: { kind: 'local', workDir: config.agent.workDir }, // <--- 关键在这里
    exposeThinking: true, // 🤔 开启思考内容显示
    metadata: {
      toolTimeoutMs: config.agent.toolTimeoutMs,
      maxToolConcurrency: config.agent.maxToolConcurrency,
    },
  },
  deps
);
console.log(`✅ [创建] Agent 创建完成`);
```

让我们逐行翻译它的意思：

1.  **`agentId: storeAgentId`**: 
    *   告诉 Agent：“你的日记本（存储路径）在这个 ID 对应的文件夹里。”（即 `.kode/.../insure-test-session-1`）。
    
2.  **`templateId: agentConfig.templateId`**:
    *   告诉 Agent：“你的出厂设置（Prompt 和工具）请参考这个模板 ID。”（即 `insure-recommand-v1`）。

3.  **`sandbox: { kind: 'local', workDir: config.agent.workDir }`**:
    *   **`kind: 'local'`**: 意思是“在本地机器上直接运行命令”，而不是在 Docker 或虚拟机里。
    *   **`workDir: config.agent.workDir`**: 意思是“如果需要写文件，请全部写到 `./workspace` 这个目录里去，不要乱写到别的地方”。

### 验证方法
你可以尝试让 Agent 写一个文件，沙箱就会神奇地出现。
在对话框里发一条指令：
> “请帮我写一个 hello.txt 文件，内容是你好。”

发送后，你再去查看项目根目录，就会发现多了一个 `workspace` 文件夹，里面躺着 `hello.txt`。

### 总结
*   **`.kode/`** = **大脑**（存记忆，看不见的思维）。
*   **`workspace/`** = **办公桌**（存文件，看得见的产物）。
*   你没看到办公桌，是因为 Agent 还没开始动笔写字。

## 5. 为什么叫 `runtime`？是进程吗？

你问到：“那为什么叫 runtime？这不是进程的意思吗？”

这是一个非常好的命名语义学问题。
在计算机科学中，`runtime`（运行时）确实常指“程序运行的生命周期”或“运行时环境”。

但在 **`kode-sdk` 的存储结构**中，它的含义稍微有点不同。

### 1. 这里的 `runtime` 是“运行时状态快照” (Runtime State)
它不代表“正在运行的进程（Process）”，而是代表**“程序运行过程中产生的动态数据”**。

*   **Static (静态)**: 
    *   `meta.json`: 这里面的东西（如 `templateId`, `createdAt`）一旦创建，基本就不怎么变了。这就像人的**基因和档案**。
    
*   **Runtime (动态/运行时)**: 
    *   `runtime/messages.json`: 这里面的东西（聊天记录）是随着程序运行**不断增加、不断变化**的。这就像人的**即时记忆**。

### 2. 为什么不用别的名字？
开发者之所以给这个文件夹起名叫 `runtime`，大概是想表达：
> "这里面存的是 Agent **在运行过程中（Running Time）** 实时产生和消费的数据。"

如果叫 `data` 或 `memory` 其实也可以，但 `runtime` 强调了这些数据的**动态性**和**易变性**。

### 3. 澄清：它不是“进程”
*   **进程 (Process)**: 是内存里的东西，看不见摸不着（除非你用任务管理器看），关机就没了。
*   **runtime 文件夹**: 是硬盘上的东西，是实实在在的文件。

**你可以把它理解为“游戏存档”：**
当你在玩游戏（运行中/Runtime）时，产生了很多进度数据。游戏为了防止你关机丢失进度，把这些**运行时数据**写到了硬盘上的一个文件夹里。
在 `kode-sdk` 里，这个文件夹恰好就叫 `runtime`。
