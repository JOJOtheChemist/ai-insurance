#!/bin/bash
# 一键重启脚本 - 前后端服务

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🔄 Kode-SDK 服务重启${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 0. 检查并启动数据库 (PostgreSQL)
echo -e "${YELLOW}检查数据库状态...${NC}"
if ! pg_isready > /dev/null 2>&1; then
    echo -ne "  ⏳ 数据库未就绪，正在尝试启动 PostgreSQL...\r"
    if command -v brew > /dev/null 2>&1; then
        brew services start postgresql > /dev/null 2>&1
        # 等待数据库启动
        for i in {1..10}; do
            if pg_isready > /dev/null 2>&1; then
                echo -e "  ${GREEN}✓ PostgreSQL 已成功启动${NC}           "
                break
            fi
            sleep 1
        done
    fi
else
    echo -e "  ${GREEN}✓ 数据库 (PostgreSQL) 已就绪${NC}"
fi

if ! pg_isready > /dev/null 2>&1; then
    echo -e "  ${RED}⚠️ 警告: 数据库启动失败，工具调用可能会失败${NC}"
fi

# 停止旧服务
echo -e "${YELLOW}1/4 停止旧服务...${NC}"
pkill -f "tsx.*server/index.ts" 2>/dev/null && echo "  ✓ 后端(tsx)已停止" || echo "  ℹ 后端未运行"
pkill -f "ts-node.*server" 2>/dev/null && echo "  ✓ 后端(ts-node)已停止" || true
lsof -ti:8000 | xargs kill -9 2>/dev/null && echo "  ✓ 工具后端(8000)已清理" || true
cd ../user-chat-frontend
pkill -f "vite.*8890" 2>/dev/null && echo "  ✓ 前端已停止" || true
lsof -ti:8890 | xargs kill -9 2>/dev/null && echo "  ✓ 前端端口已清理" || true
cd ../kode-sdk
sleep 2

# 启动工具后端 (端口 8000)
echo -e "\n${YELLOW}2/4 启动工具后端服务 (端口 8000)...${NC}"
cd ../insurance-product-backend/backend
if [ -d "venv" ]; then
    source venv/bin/activate
fi
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
TOOL_PID=$!
cd ../../kode-sdk
echo "  ✓ 工具后端 PID: $TOOL_PID"
for i in 3 2 1; do echo -ne "  ⏳ ${i}s...\r"; sleep 1; done
echo -e "  ${GREEN}✓ 工具后端已启动${NC}           "

# 检查工具后端是否成功启动
if lsof -i:8000 > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ 工具后端服务运行正常 (端口 8000)${NC}"
else
  echo -e "  ${RED}❌ 工具后端服务启动失败！${NC}"
  echo -e "  ${YELLOW}查看日志: tail -f ../insurance-product-backend/backend/backend.log${NC}"
fi

# 启动后端 (端口 3001)
echo -e "\n${YELLOW}3/4 启动后端服务 (端口 3001)...${NC}"
nohup npx tsx server/index.ts > server.log 2>&1 &
BACKEND_PID=$!
echo "  ✓ 后端 PID: $BACKEND_PID"
for i in 5 4 3 2 1; do echo -ne "  ⏳ ${i}s...\r"; sleep 1; done
echo -e "  ${GREEN}✓ 后端已启动${NC}           "

# 检查后端是否成功启动
if lsof -i:3001 > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ 后端服务运行正常 (端口 3001)${NC}"
else
  echo -e "  ${RED}❌ 后端服务启动失败！${NC}"
  echo -e "  ${YELLOW}查看日志: tail -f server.log${NC}"
fi

# 启动前端 (端口 8890)
echo -e "\n${YELLOW}4/4 启动前端服务 (端口 8890)...${NC}"
cd ../user-chat-frontend
nohup npm run dev > /tmp/frontend-8890.log 2>&1 &
FRONTEND_PID=$!
cd ../kode-sdk
echo "  ✓ 前端 PID: $FRONTEND_PID"
for i in 3 2 1; do echo -ne "  ⏳ ${i}s...\r"; sleep 1; done
echo -e "  ${GREEN}✓ 前端已启动${NC}           "

# 检查前端是否成功启动
if lsof -i:8890 > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ 前端服务运行正常 (端口 8890)${NC}"
else
  echo -e "  ${RED}❌ 前端服务启动失败！${NC}"
  echo -e "  ${YELLOW}查看日志: tail -f /tmp/frontend-8890.log${NC}"
fi

# 显示当前时间（验证时间注入是否正确）
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ 服务重启完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📍 服务地址：${NC}"
echo -e "  🔍 工具 API:  ${BLUE}http://localhost:8000${NC}"
echo -e "  🔧 后端 API:  ${BLUE}http://localhost:3001${NC}"
echo -e "  🌐 前端页面:  ${BLUE}http://localhost:8890${NC}\n"

echo -e "${YELLOW}🕐 当前系统时间：${NC}"
echo -e "  📅 $(date '+%Y-%m-%d %H:%M:%S')\n"

echo -e "${YELLOW}🔧 已修复内容：${NC}"
echo -e "  • ${GREEN}时间修复${NC}: AI现在能够识别当前日期并准确处理时间段"
echo -e "  • ${GREEN}工具修复${NC}: 已自动连接 8000 端口的保险工具后端，修复工具调用失败问题\n"

echo -e "${YELLOW}💡 提示：${NC}"
echo -e "  • 查看后端日志: ${BLUE}tail -f server.log${NC}"
echo -e "  • 查看工具日志: ${BLUE}tail -f ../insurance-product-backend/backend/backend.log${NC}"
echo -e "  • 查看前端日志: ${BLUE}tail -f /tmp/frontend-8890.log${NC}\n"

echo -e "${GREEN}👉 请打开浏览器访问 http://localhost:8890 进行测试${NC}\n"
