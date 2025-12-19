# fs_edit 工具使用指南

`fs_edit` 是一个用于对文件进行**精确字符串替换**的工具。它是 Agent 修改现有代码的主要手段之一。

## 1. 核心机制

与传统的“重写整个文件”不同，`fs_edit` 采用的是“查找并替换”的模式。

*   **输入**：你告诉它“把这段代码 A 换成代码 B”。
*   **验证**：它会检查文件里是不是**真的有**代码 A，以及代码 A 是不是**唯一的**。
*   **执行**：如果验证通过，它会将 A 替换为 B 并保存文件。

这种机制通过强制要求 Agent 提供上下文（`old_string`），大大减少了盲目写入导致的错误覆盖。

## 2. 参数说明

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `path` | string | **是** | 要编辑的文件路径。 |
| `old_string` | string | **是** | 原文件中的**原始内容**。必须与文件中的字符完全一致（包括空格、换行符）。 |
| `new_string` | string | **是** | 要插入的新内容。 |
| `replace_all` | boolean | 否 | 是否替换所有匹配项。默认为 `false`。 |

## 3. 安全检查机制（重要）

`fs_edit` 包含严格的防错逻辑：

1.  **未找到错误**：如果文件中找不到 `old_string`，操作失败。
    *   *原因*：通常是因为 Agent 记忆的代码与实际文件不一致（文件被外部修改了，或者 Agent 记错了缩进）。
    *   *解决*：先调用 `fs_read` 获取最新内容。
2.  **多重匹配错误**：如果 `old_string` 在文件中出现了多次，且 `replace_all` 为 `false`，操作失败。
    *   *原因*：防止你想改第 1 处，结果把第 2 处也改了。
    *   *解决*：提供更长的 `old_string`（包含更多上下文）以确保其唯一性，或者确认需要全部替换并设置 `replace_all: true`。

## 4. 使用示例

### 场景 1：修改一行代码

假设 `config.ts` 内容如下：
```typescript
export const TIMEOUT = 1000;
export const RETRIES = 3;
```

Agent 想要把超时改为 5000。

**请求：**
```json
{
  "path": "config.ts",
  "old_string": "export const TIMEOUT = 1000;",
  "new_string": "export const TIMEOUT = 5000;"
}
```

### 场景 2：替换多个相同的变量名（使用 replace_all）

假设 `utils.ts` 中多次使用了 `var a = 1`，想全部改为 `const a = 1`。

**请求：**
```json
{
  "path": "utils.ts",
  "old_string": "var a = 1",
  "new_string": "const a = 1",
  "replace_all": true
}
```

### 场景 3：包含上下文的修改（推荐）

为了确保唯一性，建议包含修改行的上下行代码。

**原文件：**
```typescript
function init() {
  console.log('Start');
  connect();
}
```

**推荐请求**（包含缩进和上下文）：
```json
{
  "path": "main.ts",
  "old_string": "  console.log('Start');\n  connect();",
  "new_string": "  console.log('Initializing...');\n  await connect();"
}
```

## 5. 常见问题排查

*   **Error: old_string not found**
    *   **空格/缩进不对**：代码看似一样，但空格数量不同。
    *   **换行符问题**：`\n` vs `\r\n`。
    *   **转义问题**：如果 `old_string` 包含特殊字符，确保 JSON 格式正确。
*   **Error: old_string appears X times**
    *   你的搜索字符串太短了（例如只搜了 `return true;`），导致文件中匹配到了好几处。请增加更多上下文代码。

## 6. 最佳实践

1.  **Read-Before-Write**：永远不要凭“印象”修改代码。在调用 `fs_edit` 之前，务必先 `fs_read` 确认目标代码段的确切内容。
2.  **足够的上下文**：`old_string` 至少应包含 3-5 行代码，或者足够确保唯一性的特征代码。
3.  **保持格式**：`new_string` 必须包含正确的缩进和换行符，否则会破坏代码格式。
