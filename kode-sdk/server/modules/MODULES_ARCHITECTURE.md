# Server Modules 架构说明

> 🎯 **模块化设计** - 清晰的职责分离，易于维护和扩展

---

## 📁 目录结构

```
server/
├── modules/                        # 业务模块（新增）
│   └── session-management/         # 会话管理模块
│       ├── types.ts                # 类型定义
│       ├── auto-naming.ts          # 自动命名逻辑
│       ├── storage.ts              # 存储操作
│       ├── service.ts              # 主服务类
│       ├── index.ts                # 统一导出
│       ├── README.md               # 模块文档
│       └── FEATURE_DEMO.md         # 功能演示
│
├── routes/                         # 路由层（HTTP 处理）
│   ├── chat.ts                     # 聊天路由
│   ├── health.ts                   # 健康检查
│   ├── sessions.ts                 # 会话管理路由
│   └── index.ts                    # 路由汇总
│
├── services/                       # 服务层（业务逻辑）
│   └── agent-service.ts            # Agent 管理服务
│
├── agents/                         # Agent 定义
│   ├── calculator-agent.ts
│   ├── schedule-assistant.ts
│   ├── types.ts
│   └── index.ts
│
├── tools/                          # 工具定义
│   ├── calculator/
│   ├── create_schedules/
│   ├── get_schedule/
│   └── ...
│
└── config/                         # 配置
    └── index.ts
```

---

## 🎯 设计理念

### 1. 分层架构

```
┌─────────────────────────────────────┐
│         Routes Layer (路由层)        │  ← HTTP 请求处理
│  职责：接收请求、调用服务、返回响应   │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│    Services/Modules Layer (服务层)  │  ← 业务逻辑
│  职责：业务逻辑、数据处理、状态管理   │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Storage Layer (存储层)         │  ← 数据持久化
│  职责：文件系统、数据库、缓存操作     │
└─────────────────────────────────────┘
```

### 2. 职责分离

| 层级 | 职责 | 示例 |
|------|------|------|
| **Routes** | HTTP 协议处理 | 解析请求、验证参数、返回响应 |
| **Services/Modules** | 业务逻辑 | 数据处理、业务规则、状态管理 |
| **Storage** | 数据持久化 | 文件读写、数据库操作 |

---

## 📦 Modules vs Services

### 何时使用 Modules？

**Modules** 适用于：
- ✅ 复杂的业务领域（如会话管理）
- ✅ 需要多个子模块协作
- ✅ 有独立的类型系统
- ✅ 需要详细的文档和示例

**示例：`session-management/`**
```
session-management/
├── types.ts          # 独立的类型定义
├── auto-naming.ts    # 子功能模块
├── storage.ts        # 数据访问层
├── service.ts        # 业务逻辑层
└── index.ts          # 统一导出
```

### 何时使用 Services？

**Services** 适用于：
- ✅ 单一职责的服务
- ✅ 不需要复杂的子模块
- ✅ 简单的业务逻辑

**示例：`agent-service.ts`**
```typescript
// 单文件服务，职责清晰
export class AgentManager {
  async getOrCreateAgent() { ... }
  getAgent() { ... }
  setProcessing() { ... }
}
```

---

## 🏗️ 模块化设计模式

### 会话管理模块（参考实现）

```
session-management/
├── types.ts                # 1️⃣ 类型定义
│   ├── Session
│   ├── SessionMessage
│   ├── SessionMeta
│   └── ...
│
├── auto-naming.ts          # 2️⃣ 功能模块
│   ├── generateSessionTitle()
│   ├── extractMessageContent()
│   └── ...
│
├── storage.ts              # 3️⃣ 数据访问层
│   ├── SessionStorage class
│   ├── readMeta()
│   ├── writeMeta()
│   ├── deleteSession()
│   └── ...
│
├── service.ts              # 4️⃣ 业务逻辑层
│   ├── SessionManagementService class
│   ├── getAllSessions()
│   ├── renameSession()
│   ├── deleteSession()
│   └── ...
│
└── index.ts                # 5️⃣ 统一导出
    └── export { sessionService }
```

### 优势

1. **单一职责**
   - 每个文件只做一件事
   - 易于理解和维护

2. **可测试性**
   - 独立的模块可以单独测试
   - Mock 依赖更容易

3. **可复用性**
   - 子模块可以被其他模块使用
   - 减少代码重复

4. **可扩展性**
   - 添加新功能只需添加新文件
   - 不影响现有代码

---

## 🔄 数据流示例

### 会话重命名流程

```
1. 用户请求
   ↓
2. Routes Layer (routes/sessions.ts)
   router.patch('/api/sessions/:id/rename')
   ↓ 调用
3. Service Layer (modules/session-management/service.ts)
   sessionService.renameSession(id, name)
   ↓ 调用
4. Storage Layer (modules/session-management/storage.ts)
   sessionStorage.renameSession(id, name)
   ↓ 写入
5. File System
   .kode/{id}/meta.json
   ↓ 返回
6. 响应给用户
   { ok: true, newName: "..." }
```

---

## 📚 模块创建指南

### 步骤 1: 规划模块结构

```typescript
// 确定模块边界
modules/
└── your-module/
    ├── types.ts        # 必须：类型定义
    ├── service.ts      # 必须：主服务类
    ├── storage.ts      # 可选：如果需要数据持久化
    ├── utils.ts        # 可选：工具函数
    ├── index.ts        # 必须：统一导出
    └── README.md       # 推荐：模块文档
```

### 步骤 2: 定义类型

```typescript
// types.ts
export interface YourEntity {
  id: string;
  name: string;
  // ...
}

export interface YourOptions {
  // ...
}
```

### 步骤 3: 实现服务类

```typescript
// service.ts
import { YourEntity } from './types';

export class YourService {
  async getAll(): Promise<YourEntity[]> {
    // 业务逻辑
  }

  async getById(id: string): Promise<YourEntity | null> {
    // 业务逻辑
  }

  // ...
}

export const yourService = new YourService();
```

### 步骤 4: 统一导出

```typescript
// index.ts
export * from './types';
export * from './service';
export { yourService } from './service';
```

### 步骤 5: 在路由中使用

```typescript
// routes/your-route.ts
import { yourService } from '../modules/your-module';

router.get('/api/your-entities', async (req, res) => {
  const entities = await yourService.getAll();
  res.json({ ok: true, entities });
});
```

---

## 🎨 代码风格指南

### 1. 命名规范

```typescript
// ✅ 好
export class SessionManagementService { }
export const sessionService = new SessionManagementService();

// ❌ 不好
export class sessionService { }
export const service = new SessionManagementService();
```

### 2. 文件组织

```typescript
// ✅ 好：按功能分文件
modules/
├── auth/
│   ├── types.ts
│   ├── service.ts
│   └── utils.ts

// ❌ 不好：单文件包含所有功能
modules/
└── auth.ts  (3000+ 行)
```

### 3. 导入顺序

```typescript
// ✅ 好：分组清晰
import * as fs from 'fs';          // 1. Node.js 内置模块
import * as path from 'path';

import { Router } from 'express';  // 2. 第三方模块

import { sessionService } from '../modules/session-management';  // 3. 本地模块
import { config } from '../config';
```

---

## 🧪 测试策略

### 1. 单元测试（模块内）

```typescript
// modules/session-management/__tests__/service.test.ts
import { sessionService } from '../service';

describe('SessionManagementService', () => {
  it('应该获取所有会话', async () => {
    const sessions = await sessionService.getAllSessions();
    expect(sessions).toBeInstanceOf(Array);
  });
});
```

### 2. 集成测试（跨模块）

```typescript
// routes/__tests__/sessions.test.ts
import request from 'supertest';
import app from '../../app';

describe('Sessions API', () => {
  it('GET /api/sessions', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
```

---

## 📊 当前模块状态

| 模块 | 位置 | 状态 | 说明 |
|------|------|------|------|
| **会话管理** | `modules/session-management/` | ✅ 完成 | CRUD + 自动命名 + 批量操作 |
| **Agent 管理** | `services/agent-service.ts` | ✅ 完成 | 单文件服务（简单） |

---

## 🚀 未来模块规划

### 1. 用户管理模块

```
modules/user-management/
├── types.ts              # User, UserProfile, Auth
├── auth.ts               # 认证逻辑
├── storage.ts            # 用户数据存储
├── service.ts            # 用户服务
└── index.ts
```

### 2. 工具管理模块

```
modules/tool-management/
├── types.ts              # Tool, ToolConfig
├── registry.ts           # 工具注册
├── executor.ts           # 工具执行
├── service.ts            # 工具服务
└── index.ts
```

### 3. 通知管理模块

```
modules/notification-management/
├── types.ts              # Notification
├── channels/             # 不同通知渠道
│   ├── email.ts
│   ├── sms.ts
│   └── push.ts
├── service.ts            # 通知服务
└── index.ts
```

---

## ✅ 最佳实践总结

1. **模块化优先**
   - 复杂功能使用 `modules/`
   - 简单功能使用 `services/`

2. **单一职责**
   - 每个文件只做一件事
   - 职责边界清晰

3. **类型优先**
   - 先定义类型（types.ts）
   - 再实现逻辑（service.ts）

4. **文档完善**
   - 每个模块必须有 README.md
   - 复杂功能提供示例代码

5. **测试覆盖**
   - 核心逻辑必须有测试
   - 测试文件与源文件同目录

---

**创建时间：** 2025-10-20  
**架构版本：** v2.0  
**维护者：** Kode SDK Team

