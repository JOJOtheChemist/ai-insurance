# 如何强制 Agent 遵循“先读后写”原则

在 `fs_edit` 的设计中，“先调用 `fs_read` 获取最新内容” 并不是代码层面的硬性技术约束（即如果你直接调用 `fs_edit` 也是允许的），而是一种**Prompt Engineering（提示工程）策略**和**最佳实践**。

为了让 LLM（Agent）严格遵守这一原则，我们需要在多个层面进行“强调”和“诱导”。

## 1. 原理：为什么 LLM 不想读？

LLM 本质上是懒惰的。如果它觉得自己“记得”代码（例如在对话历史的上文中出现过），它就会倾向于直接生成 `fs_edit` 调用来省事。
但问题在于：
1.  **记忆偏差**：LLM 记错缩进、空格或变量名，导致 `old_string` 匹配失败。
2.  **幻觉**：LLM 以为文件里有某行代码，实际上并没有。
3.  **状态过时**：在多轮对话中，文件可能已经被之前的步骤改过了，LLM 还在用旧版本的记忆。

## 2. 强化手段

我们可以通过以下三种方式来“强制”或“强烈建议” Agent 先读后写。

### 手段一：修改 Tool Prompt（最直接）

在 `src/tools/fs_edit/prompt.ts` 中，我们可以使用更强硬的语气。

**当前 Prompt:**
> - Combine with fs_read to confirm the current file state before editing.

**建议修改为（更强硬）：**
> **IMPORTANT: You MUST read the file using `fs_read` immediately before editing it.**
> Do not rely on previous message history or your memory, as the file content may have changed or your memory may be inexact.
> If you try to edit without reading, the operation may fail due to mismatching whitespace or context.

### 手段二：在 System Prompt 中加入全局规范

在 Agent 的 `systemPrompt` 中加入一条通用的编码规范（Coding Guidelines）：

```markdown
## Coding Guidelines
1. **Read-Before-Write**: Never attempt to edit a file without reading it in the *current* turn. Even if you just read it 3 turns ago, read it again to ensure you have the exact, up-to-date content for the `old_string` match.
```

### 手段三：通过错误反馈进行“教育”（强化学习）

当 Agent 因为没读文件而导致 `fs_edit` 失败（报错 `old_string not found`）时，我们可以在错误信息中加入**建议**。

在 `src/tools/fs_edit/index.ts` 的错误处理逻辑中：

```typescript
if (occurrences === 0) {
  return { 
    ok: false, 
    error: 'old_string not found in file. This usually happens because you are guessing the content. Please use fs_read to get the exact file content and try again.' 
  };
}
```

## 3. 为什么不从代码上强制？

你可能会问：*“为什么不在 `fs_edit` 的代码里检查，如果上一条指令不是 `fs_read` 就报错？”*

**不建议这样做的原因：**
1.  **灵活性**：有时候 Agent 确实非常有把握（例如刚创建的文件，或者刚 grep 到的内容），强制读取会浪费 Token 和时间。
2.  **上下文判断**：Agent 可能通过 `fs_grep` 获取了内容，这也是一种“读”，硬性检查“上一条是不是 fs_read”会误杀这种情况。

## 4. 总结

要强调“必须先读”，核心在于**Prompt 的诱导**。

推荐修改 `src/tools/fs_edit/prompt.ts`，将建议性的话语改为命令性的话语（MUST, NEVER, ALWAYS），这是控制 LLM 行为最有效的方法。
