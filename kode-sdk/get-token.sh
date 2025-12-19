#!/bin/bash
# 快速获取测试Token的脚本

echo "======================================"
echo "  获取测试Token"
echo "======================================"
echo ""

# 后端API地址
API_URL="${API_URL:-http://140.143.194.215:8000}"

# 测试用户凭证
USERNAME="${TEST_USERNAME:-test_user}"
PASSWORD="${TEST_PASSWORD:-test_password}"

echo "正在登录后端API..."
echo "API地址: $API_URL"
echo "用户名: $USERNAME"
echo ""

# 发送登录请求
RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

# 提取Token
TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo $RESPONSE | grep -o '"user_id":[0-9]*' | cut -d':' -f2)

if [ -z "$TOKEN" ]; then
  echo "❌ 获取Token失败"
  echo "响应: $RESPONSE"
  echo ""
  echo "💡 请检查："
  echo "  1. 后端API是否正常运行"
  echo "  2. 用户名密码是否正确"
  echo "  3. API地址是否正确"
  exit 1
fi

echo "✅ Token获取成功！"
echo ""
echo "用户ID: $USER_ID"
echo "Token: $TOKEN"
echo ""
echo "======================================"
echo "  设置环境变量"
echo "======================================"
echo ""
echo "在当前终端执行以下命令："
echo ""
echo "export TEST_USER_ID=\"$USER_ID\""
echo "export TEST_USER_TOKEN=\"$TOKEN\""
echo ""
echo "或者直接运行测试："
echo ""
echo "TEST_USER_ID=\"$USER_ID\" TEST_USER_TOKEN=\"$TOKEN\" ./test-timetable.sh"
echo ""

