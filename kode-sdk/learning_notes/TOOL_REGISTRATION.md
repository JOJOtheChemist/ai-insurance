# Tool 注册指南

本文档说明如何在 `kode-sdk` 中定义和注册新的 Tool。

## 概述

在 `kode-sdk` 中，Tool 的注册是**自动完成**的。当你使用 SDK 提供的 `tool` 或 `defineTool` 函数定义一个工具时，它会自动被注册到全局工具注册表 (`globalToolRegistry`) 中。

## 方式一：使用 Zod 定义（推荐）

这是最常用和功能最完整的方式，支持使用 Zod 进行强大的参数验证和类型推断。

### 步骤

1. 在 `src/tools/` 下创建一个新目录，例如 `src/tools/my_tool/`。
2. 创建 `index.ts`。
3. 使用 `src/tools/tool.ts` 中的 `tool` 函数。

### 示例代码

```typescript
import { tool } from '../../tools/tool';
import { z } from 'zod';
import { ToolContext } from '../../core/types';

// 1. 定义参数 Schema
// 建议使用 describe() 添加描述，这有助于 LLM 理解参数用途
const MyToolParams = z.object({
  username: z.string().describe('The name of the user'),
  age: z.number().optional().describe('The age of the user'),
});

// 2. 定义并导出工具
export const MyTool = tool({
  name: 'my_tool', // 工具唯一标识，必须全局唯一
  description: 'This is a description of what my tool does.',
  parameters: MyToolParams,
  
  // 3. 实现执行逻辑
  async execute(args, ctx: ToolContext) {
    const { username, age } = args;
    
    // ctx 提供了上下文信息，例如沙箱环境
    // const content = await ctx.sandbox.fs.read('some_file');
    
    return {
      message: `Hello ${username}, you are ${age || 'unknown'} years old.`,
      timestamp: Date.now()
    };
  },
  
  // 4. 元数据配置 (可选)
  metadata: {
    readonly: true, // 如果工具只读且不产生副作用，设为 true
    version: '1.0.0'
  }
});
```

## 方式二：使用简化 API 定义

如果你不想使用 Zod，或者偏好更简单的配置对象，可以使用 `defineTool`。

### 示例代码

```typescript
import { defineTool } from '../../tools/define';

export const SimpleTool = defineTool({
  name: 'simple_greet',
  description: 'A simple greeting tool',
  
  // 简化的参数定义
  params: {
    name: { type: 'string', description: 'Name to greet', required: true },
    times: { type: 'number', description: 'How many times to greet', default: 1 }
  },
  
  attributes: {
    readonly: true,
    noEffect: true
  },
  
  async exec(args, ctx) {
    const { name, times } = args;
    return Array(times).fill(`Hello, ${name}!`);
  }
});
```

### 使用装饰器 (实验性)

如果你的环境配置了 `experimentalDecorators`，你也可以在类中使用装饰器：

```typescript
import { tool } from '../../tools/define';

class MathTools {
  @tool({
    description: 'Add two numbers',
    params: { a: { type: 'number' }, b: { type: 'number' } }
  })
  async add(args: { a: number, b: number }, ctx: any) {
    return args.a + args.b;
  }
}
```

## 注册原理

底层注册机制位于 `src/tools/registry.ts`。

当你调用 `tool(...)` 或 `defineTool(...)` 时，SDK 内部会自动执行类似下的操作：

```typescript
// src/tools/tool.ts 内部
globalToolRegistry.register(def.name, () => toolInstance);
```

这意味着你只需要确保你的工具文件被代码引用（import）即可生效。

### 最佳实践

1. **目录结构**: 建议将所有工具放在 `src/tools/` 目录下，每个工具一个子目录。
   ```
   src/tools/
   ├── fs_read/
   │   ├── index.ts
   │   └── prompt.ts
   ├── my_new_tool/   <-- 新工具
   │   ├── index.ts
   │   └── ...
   └── ...
   ```

2. **导出**: 确保你的工具在 `src/index.ts` 或其他被应用加载的地方被导入。
   ```typescript
   // src/index.ts
   export * from './tools/my_new_tool'; 
   ```
