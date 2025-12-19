# Agent 测试错误诊断报告

## 🔍 问题诊断

### 错误现象
```
❌ [错误] undefined
⏳ 状态检查: state=READY (无法继续执行)
```

### 根本原因
**API Key 已过期或无效**

完整错误信息：
```
Anthropic API error: 401 
{"error":{"message":"令牌已过期或验证不正确","type":"401"}}
```

### 为什么错误显示为 undefined？
在 Agent 的流式调用（stream）过程中，API 认证失败：
1. `model.stream()` 调用时 API 返回 401 错误
2. 在 async generator 中抛出的异常没有完整的错误信息传递
3. 错误事件监听器接收到的 `error.message` 为 undefined
4. Agent 状态变为 READY 但未能完成任务

## ✅ 解决方案

### 方案 1: 使用智谱 GLM API（推荐）

1. 访问 https://open.bigmodel.cn/
2. 注册/登录账号
3. 创建 API Key
4. 配置环境变量：

```bash
export ANTHROPIC_API_KEY="你的GLM_API_KEY"
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
export ANTHROPIC_MODEL_ID="glm-4.5-air"
```

### 方案 2: 更新 Z.AI API Key

如果你使用 Z.AI 服务：
1. 访问 https://api.z.ai/ 获取新的 API Key
2. 更新环境变量：

```bash
export ANTHROPIC_API_KEY="新的API_KEY"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/paas/v4/"
export ANTHROPIC_MODEL_ID="glm-4.5-air"
```

### 方案 3: 使用原生 Anthropic Claude API

```bash
export ANTHROPIC_API_KEY="你的Claude_API_KEY"
export ANTHROPIC_BASE_URL="https://api.anthropic.com"
export ANTHROPIC_MODEL_ID="claude-3-5-sonnet-20241022"
```

## 🧪 测试步骤

### 1. 测试 API 连接

```bash
cd /Users/yeya/FlutterProjects/ai-time/kode-sdk-deploy/kode-sdk

# 设置环境变量（使用上面的任一方案）
export ANTHROPIC_API_KEY="你的API_KEY"
export ANTHROPIC_BASE_URL="你的BASE_URL"
export ANTHROPIC_MODEL_ID="你的MODEL_ID"

# 测试连接
npx ts-node server/test-api-connection.ts
```

期望输出：
```
✅ Provider 创建成功
✅ Complete 请求成功
✅ Stream 请求成功
✅ 所有测试通过！API 连接正常
```

### 2. 测试 create_timetable 工具

```bash
# 继续使用上面的环境变量，添加用户认证
export TEST_USER_ID="4"
export TEST_USER_TOKEN="你的JWT_TOKEN"

# 运行工具测试
npx ts-node server/test-timetable-agent.ts
```

### 3. 测试日程助手 Agent

```bash
npx ts-node server/test-schedule-assistant.ts
```

## 📝 快速配置模板

创建 `test-env.sh` 文件：

```bash
#!/bin/bash
# 填写你的配置
export ANTHROPIC_API_KEY="你的API_KEY"
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
export ANTHROPIC_MODEL_ID="glm-4.5-air"

export TEST_USER_ID="4"
export TEST_USER_TOKEN="你的JWT_TOKEN"

export BACKEND_API_URL="http://localhost:8000"
```

使用方法：
```bash
source test-env.sh
npx ts-node server/test-api-connection.ts
```

## 🎯 总结

**问题根源**: API Key 认证失败（401 错误）
**表面现象**: Agent 错误显示 undefined
**解决方法**: 获取有效的 API Key 并正确配置环境变量

更新 API Key 后，所有测试应该能正常运行。

## 📚 相关文件

- `server/test-api-connection.ts` - API 连接诊断脚本
- `server/test-timetable-agent.ts` - create_timetable 工具测试
- `server/test-schedule-assistant.ts` - 日程助手测试
- `test-env-template.sh` - 环境变量配置模板

