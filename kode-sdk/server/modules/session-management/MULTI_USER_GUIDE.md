

# 多用户会话管理系统 - 完整指南

> 🔐 **支持 JWT 认证、用户隔离、权限控制的会话管理系统**

---

## 📋 目录

1. [架构设计](#架构设计)
2. [安装依赖](#安装依赖)
3. [启用多用户模式](#启用多用户模式)
4. [API 使用示例](#api-使用示例)
5. [前端集成](#前端集成)
6. [安全最佳实践](#安全最佳实践)
7. [迁移指南](#迁移指南)

---

## 🏗️ 架构设计

### 核心组件

```
server/
├── middleware/
│   └── auth.ts                              # JWT 认证中间件
│
├── modules/session-management/
│   ├── multi-user-storage.ts               # 多用户存储层
│   └── ...
│
└── routes/
    ├── sessions.ts                          # 单用户路由（旧）
    └── sessions-multi-user.ts               # 多用户路由（新）
```

### 存储结构

**单用户模式：**
```
.kode/
├── calculator-agent/
├── schedule-assistant/
└── demo-session/
```

**多用户模式：**
```
.kode/
└── users/
    ├── user-123/                    # 用户 1
    │   ├── calculator-agent/
    │   └── my-chat/
    │
    ├── user-456/                    # 用户 2
    │   ├── project-discussion/
    │   └── meeting-notes/
    │
    └── admin/                       # 管理员
        └── admin-sessions/
```

---

## 📦 安装依赖

### 1. 安装 jsonwebtoken

```bash
cd /path/to/kode-sdk
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# JWT 配置
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# 服务器配置
PORT=2500
NODE_ENV=production
```

**⚠️ 重要：生产环境必须使用强密钥！**

```bash
# 生成随机密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 启用多用户模式

### 步骤 1: 更新主路由

编辑 `server/routes/index.ts`：

```typescript
import { Router } from 'express';
import chatRouter from './chat';
import healthRouter from './health';
// import sessionsRouter from './sessions';  // 旧的单用户路由
import sessionsMultiUserRouter from './sessions-multi-user';  // 新的多用户路由

const router = Router();

router.use(chatRouter);
router.use(healthRouter);
// router.use(sessionsRouter);  // 禁用
router.use(sessionsMultiUserRouter);  // 启用多用户

export default router;
```

### 步骤 2: 创建登录 API

创建 `server/routes/auth.ts`：

```typescript
import { Router } from 'express';
import { generateToken } from '../middleware/auth';

const router = Router();

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // TODO: 验证用户凭据（从数据库）
  // 这里是示例代码
  if (username === 'admin' && password === 'admin123') {
    const token = generateToken({
      userId: 'admin',
      username: 'admin',
      role: 'admin'
    });

    return res.json({
      ok: true,
      token,
      user: {
        userId: 'admin',
        username: 'admin',
        role: 'admin'
      }
    });
  }

  if (username === 'user1' && password === 'password123') {
    const token = generateToken({
      userId: 'user-123',
      username: 'user1',
      role: 'user'
    });

    return res.json({
      ok: true,
      token,
      user: {
        userId: 'user-123',
        username: 'user1',
        role: 'user'
      }
    });
  }

  res.status(401).json({
    ok: false,
    error: '用户名或密码错误'
  });
});

/**
 * 验证 Token
 * GET /api/auth/verify
 */
router.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    ok: true,
    user: req.user
  });
});

export default router;
```

### 步骤 3: 重启服务

```bash
bash restart-backend.sh
```

---

## 🔌 API 使用示例

### 1. 用户登录

```bash
curl -X POST http://localhost:2500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "password": "password123"
  }'
```

**响应：**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "user-123",
    "username": "user1",
    "role": "user"
  }
}
```

---

### 2. 获取会话列表（需要认证）

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:2500/api/sessions \
  -H "Authorization: Bearer $TOKEN"
```

**响应：**
```json
{
  "ok": true,
  "sessions": [
    {
      "id": "my-chat-001",
      "name": "项目讨论",
      "messagesCount": 15,
      "userId": "user-123"
    }
  ],
  "total": 1,
  "userId": "user-123",
  "username": "user1"
}
```

---

### 3. 创建会话

```bash
curl -X POST http://localhost:2500/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "my-chat-002",
    "customName": "每日站会"
  }'
```

---

### 4. 重命名会话

```bash
curl -X PATCH http://localhost:2500/api/sessions/my-chat-001/rename \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "重要项目讨论"
  }'
```

---

### 5. 删除会话

```bash
curl -X DELETE http://localhost:2500/api/sessions/my-chat-001 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. 管理员：查看所有用户

```bash
export ADMIN_TOKEN="..."

curl http://localhost:2500/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**响应：**
```json
{
  "ok": true,
  "users": [
    { "userId": "user-123", "sessionCount": 5 },
    { "userId": "user-456", "sessionCount": 3 },
    { "userId": "admin", "sessionCount": 2 }
  ],
  "total": 3
}
```

---

## 🎨 前端集成

### React 示例

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // 从 localStorage 恢复登录状态
  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
      setToken(savedToken);
      // 验证 token
      verifyToken(savedToken);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch('http://localhost:2500/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    
    if (data.ok) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jwt_token', data.token);
    } else {
      throw new Error(data.error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
  };

  return { token, user, login, logout };
}
```

```typescript
// src/hooks/useSessions.ts
import { useState, useEffect } from 'react';

export function useSessions(token: string | null) {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    if (!token) return;

    const res = await fetch('http://localhost:2500/api/sessions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.ok) {
      setSessions(data.sessions);
    }
  };

  const createSession = async (agentId: string, customName?: string) => {
    const res = await fetch('http://localhost:2500/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ agentId, customName })
    });

    const data = await res.json();
    if (data.ok) {
      await fetchSessions(); // 刷新列表
    }
  };

  const deleteSession = async (agentId: string) => {
    const res = await fetch(`http://localhost:2500/api/sessions/${agentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.ok) {
      await fetchSessions(); // 刷新列表
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  return { sessions, fetchSessions, createSession, deleteSession };
}
```

```typescript
// src/components/SessionManager.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSessions } from '../hooks/useSessions';

export function SessionManager() {
  const { user, token, logout } = useAuth();
  const { sessions, createSession, deleteSession } = useSessions(token);

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <h1>欢迎, {user.username}</h1>
      <button onClick={logout}>退出</button>

      <h2>我的会话</h2>
      {sessions.map(session => (
        <div key={session.id}>
          <span>{session.name}</span>
          <button onClick={() => deleteSession(session.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 安全最佳实践

### 1. JWT 密钥管理

```bash
# ✅ 好：使用环境变量
JWT_SECRET=$(openssl rand -hex 64)

# ❌ 坏：硬编码在代码中
const JWT_SECRET = '123456';
```

### 2. Token 过期策略

```typescript
// 短期 Token（推荐）
expiresIn: '1h'

// 长期 Token + Refresh Token
accessToken: { expiresIn: '15m' }
refreshToken: { expiresIn: '7d' }
```

### 3. HTTPS 强制

```javascript
// 生产环境必须使用 HTTPS
if (process.env.NODE_ENV === 'production' && !req.secure) {
  return res.redirect('https://' + req.headers.host + req.url);
}
```

### 4. CORS 配置

```typescript
app.use(cors({
  origin: 'https://yourdomain.com',  // 只允许特定域名
  credentials: true
}));
```

### 5. 速率限制

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 最多 5 次尝试
  message: '登录尝试次数过多，请稍后再试'
});

router.post('/api/auth/login', loginLimiter, ...);
```

---

## 🔄 迁移指南

### 从单用户迁移到多用户

#### 步骤 1: 备份数据

```bash
cp -r .kode .kode-backup
```

#### 步骤 2: 迁移脚本

创建 `server/scripts/migrate-to-multi-user.ts`：

```typescript
import * as fs from 'fs';
import * as path from 'path';

const KODE_DIR = '.kode';
const USERS_DIR = path.join(KODE_DIR, 'users');
const DEFAULT_USER_ID = 'admin'; // 将所有旧会话迁移给管理员

function migrate() {
  console.log('开始迁移到多用户模式...');

  // 创建 users 目录
  if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR, { recursive: true });
  }

  // 创建默认用户目录
  const adminDir = path.join(USERS_DIR, DEFAULT_USER_ID);
  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
  }

  // 迁移所有旧会话
  const items = fs.readdirSync(KODE_DIR);
  
  for (const item of items) {
    const itemPath = path.join(KODE_DIR, item);
    
    // 跳过 users 目录
    if (item === 'users') continue;
    
    // 如果是目录，移动到 admin 用户下
    if (fs.statSync(itemPath).isDirectory()) {
      const targetPath = path.join(adminDir, item);
      
      console.log(`迁移: ${item} -> ${DEFAULT_USER_ID}/${item}`);
      fs.renameSync(itemPath, targetPath);
    }
  }

  console.log('✅ 迁移完成！');
}

migrate();
```

运行迁移：

```bash
ts-node server/scripts/migrate-to-multi-user.ts
```

---

## 📊 测试清单

- [ ] JWT Token 生成和验证
- [ ] 用户登录功能
- [ ] 用户只能访问自己的会话
- [ ] 管理员可以查看所有用户
- [ ] 会话 CRUD 操作
- [ ] Token 过期处理
- [ ] 无效 Token 拦截
- [ ] 权限验证
- [ ] 跨域配置
- [ ] 速率限制

---

## 🎓 总结

### 核心特性

✅ **JWT 认证** - 基于 Token 的无状态认证  
✅ **用户隔离** - 每个用户独立的会话存储  
✅ **权限控制** - 普通用户 vs 管理员  
✅ **所有权验证** - 用户只能操作自己的数据  
✅ **RESTful API** - 标准化的 HTTP 接口  

### 技术栈

- **认证**: JWT (jsonwebtoken)
- **中间件**: Express.js
- **存储**: 文件系统（用户隔离）
- **前端**: 任何支持 HTTP 的框架

---

**创建时间：** 2025-10-20  
**版本：** v1.0  
**维护者：** Kode SDK Team

