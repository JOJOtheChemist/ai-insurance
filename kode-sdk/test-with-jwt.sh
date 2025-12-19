#!/bin/bash

# =================================================================
# Agent Tools 快速测试脚本
# 
# 功能: 自动登录获取 JWT Token 并测试 get_projects 工具
# =================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BACKEND_URL="${BACKEND_API_URL:-http://localhost:8000}"
USERNAME="${TEST_USERNAME:-yue}"
PASSWORD="${TEST_PASSWORD:-yue}"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         AI Time Agent Tools 快速测试                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# 步骤 1: 登录获取 JWT Token
echo -e "${YELLOW}🔐 步骤 1: 登录获取 JWT Token${NC}"
echo "   后端地址: $BACKEND_URL"
echo "   用户名: $USERNAME"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/v1/users/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

# 检查登录是否成功
if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
    echo -e "${GREEN}✅ 登录成功${NC}"
    
    # 提取 token 和 user_id
    JWT_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    USER_NAME=$(echo "$LOGIN_RESPONSE" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
    
    echo "   用户 ID: $USER_ID"
    echo "   用户名: $USER_NAME"
    echo "   Token: ${JWT_TOKEN:0:50}..."
    echo ""
else
    echo -e "${RED}❌ 登录失败${NC}"
    echo "响应: $LOGIN_RESPONSE"
    exit 1
fi

# 步骤 2: 运行工具测试
echo -e "${YELLOW}🚀 步骤 2: 运行 get_projects 工具测试${NC}"
echo ""

export BACKEND_API_URL="$BACKEND_URL"
export TEST_USER_ID="$USER_ID"
export TEST_JWT_TOKEN="$JWT_TOKEN"

# 运行测试
npx ts-node test-get-projects-simple.ts

# 总结
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   测试完成！                          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}💡 提示:${NC}"
echo "   - JWT Token 已存储在内存中"
echo "   - 可以继续测试其他工具"
echo "   - Token 信息: ${JWT_TOKEN:0:30}..."
echo ""
echo -e "${BLUE}📚 相关文档:${NC}"
echo "   - JWT_TOKEN_使用指南.md"
echo "   - server/tools/get_projects/README.md"
echo ""

