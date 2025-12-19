#!/bin/bash
# 
# 环境变量配置模板
# 使用方法：
# 1. 复制此文件并重命名为 test-env.sh
# 2. 填写你的 API Key
# 3. 运行: source test-env.sh
# 4. 然后运行测试脚本
#

# ====================================
# AI API 配置（必填）
# ====================================
# 选择一个可用的 API 服务

# 选项 1: Z.AI API (如果你的 Key 是 sk-iqx... 开头)
export ANTHROPIC_API_KEY="<你的API_KEY>"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/paas/v4/"
export ANTHROPIC_MODEL_ID="glm-4.5-air"

# 选项 2: 智谱 GLM API (推荐使用，访问 https://open.bigmodel.cn/ 获取)
# export ANTHROPIC_API_KEY="<你的GLM_API_KEY>"
# export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
# export ANTHROPIC_MODEL_ID="glm-4.5-air"

# 选项 3: 原生 Anthropic Claude API
# export ANTHROPIC_API_KEY="<你的Claude_API_KEY>"
# export ANTHROPIC_BASE_URL="https://api.anthropic.com"
# export ANTHROPIC_MODEL_ID="claude-3-5-sonnet-20241022"

# ====================================
# 后端 API 配置
# ====================================
export BACKEND_API_URL="http://localhost:8000"

# ====================================
# 测试用户配置（使用 yue/yue 登录获取）
# ====================================
export TEST_USER_ID="4"
export TEST_USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoieXVlIn0.IeM74Ndy8d6oyGscuJmH0_0fpr0FOBgyzXN3C5MomHE"

echo "✅ 环境变量已设置"
echo ""
echo "📋 当前配置:"
echo "  API Key: ${ANTHROPIC_API_KEY:0:20}..."
echo "  Base URL: $ANTHROPIC_BASE_URL"
echo "  Model ID: $ANTHROPIC_MODEL_ID"
echo "  User ID: $TEST_USER_ID"
echo ""
echo "💡 接下来可以运行:"
echo "  npx ts-node server/test-api-connection.ts     # 测试 API 连接"
echo "  npx ts-node server/test-timetable-agent.ts    # 测试 create_timetable 工具"
echo "  npx ts-node server/test-schedule-assistant.ts # 测试日程助手"
echo ""

