# Sandbox（沙箱）详解

你注意到 `ToolContext` 中包含了一个 `sandbox` 对象。这个 **Sandbox** 是 `kode-sdk` 中用于隔离和管理环境交互的核心组件。

## 1. 为什么需要 Sandbox？

在 AI Agent 运行过程中，它经常需要与文件系统交互（读写文件）或执行命令。为了**安全**和**可控**，SDK 不直接让 Tool 使用 Node.js 的原生 `fs` 或 `child_process` 模块，而是通过 Sandbox 这一层抽象来代理这些操作。

### Sandbox 的三大作用：

1.  **路径隔离（Jail/Chroot）**：
    *   防止 Agent 访问工作目录之外的文件（例如，防止它读取 `/etc/passwd`）。
    *   强制所有路径操作都在 `workDir` 之下。
2.  **命令安全检查**：
    *   拦截并阻止危险命令（如 `rm -rf /`，`sudo`，格式化磁盘等）。
3.  **统一接口**：
    *   无论 Agent 是运行在本地、Docker 容器中，还是远程服务器上，Tool 只需要调用 `ctx.sandbox.fs.read()`，不需要关心底层的环境差异。

## 2. Sandbox 的结构

在 `ToolContext` 中，`sandbox` 的类型定义如下（简化版）：

```typescript
export interface Sandbox {
  // 沙箱类型：'local' | 'docker' | 'k8s' | ...
  kind: SandboxKind;
  
  // 工作目录（绝对路径）
  workDir?: string;
  
  // 文件系统操作接口
  fs: {
    read(path: string): Promise<string>;
    write(path: string, content: string): Promise<void>;
    resolve(path: string): string;
    isInside(path: string): boolean;
    // ... 其他操作 (glob, stat, temp)
  };
  
  // 命令执行接口
  exec(cmd: string, opts?: { timeoutMs?: number }): Promise<{
    code: number;
    stdout: string;
    stderr: string;
  }>;
}
```

## 3. 在 Tool 中如何使用 Sandbox

当你编写 Tool 时，应该始终通过 `ctx.sandbox` 来进行环境交互，而不是引入 `fs` 模块。

### 示例 1：读取文件

```typescript
// ❌ 错误做法：直接使用 fs 模块（不安全，且无法跨环境）
import * as fs from 'fs';
// ...
const content = fs.readFileSync('/etc/hosts', 'utf-8'); 

// ✅ 正确做法：使用 sandbox（安全，自动处理相对路径）
// ...
async execute(args, ctx: ToolContext) {
  // 假设 args.path 是 "src/index.ts"
  // sandbox 会自动将其解析为 /User/xxx/project/src/index.ts
  // 并检查它是否越界
  const content = await ctx.sandbox.fs.read(args.path);
  return { content };
}
```

### 示例 2：执行命令

```typescript
// ✅ 正确做法：使用 sandbox.exec
// ...
async execute(args, ctx: ToolContext) {
  // 执行 npm install
  const result = await ctx.sandbox.exec('npm install');
  
  if (result.code !== 0) {
    throw new Error(`Command failed: ${result.stderr}`);
  }
  return result.stdout;
}
```

## 4. Sandbox 的实现类型

目前 SDK 主要内置了 **LocalSandbox**：

*   **LocalSandbox**：直接在宿主机的某个目录（`workDir`）下运行。它通过路径解析逻辑来模拟隔离。

SDK 的设计允许扩展其他类型的 Sandbox（如 `DockerSandbox`），这样代码无需修改就可以在 Docker 容器中安全运行。

## 5. 总结

*   **Sandbox 是 Agent 的“手套”**：Agent 接触外部世界（文件、命令）必须戴着这副手套。
*   **安全保障**：它防止 Agent 误删文件或访问敏感系统区域。
*   **开发规范**：编写 Tool 时，**必须**使用 `ctx.sandbox`，严禁直接使用 Node.js 原生模块操作文件或系统。
