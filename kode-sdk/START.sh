#!/bin/bash
# 一键启动脚本 - 前后端全部服务

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$(dirname "$0")"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 Kode-SDK 一键启动${NC}"
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
    echo -e "  ${RED}⚠️ 警告: 数据库启动失败或未安装，工具调用可能会失败${NC}"
    echo -e "  ${YELLOW}请确保 PostgreSQL 已安装并手动启动：brew services start postgresql${NC}\n"
fi

# 停止旧服务
echo -e "${YELLOW}1/4 清理旧服务...${NC}"
pkill -f "tsx.*server" 2>/dev/null && echo "  ✓ 后端(tsx)已停止" || true
pkill -f "ts-node.*server" 2>/dev/null && echo "  ✓ 后端(ts-node)已停止" || echo "  ℹ 后端未运行"
lsof -ti:8890 | xargs kill -9 2>/dev/null && echo "  ✓ 前端已停止" || echo "  ℹ 前端未运行"
lsof -ti:8000 | xargs kill -9 2>/dev/null && echo "  ✓ 工具后端(8000)已停止" || true
sleep 2

# 启动工具后端 (端口 8000)
echo -e "\n${YELLOW}2/4 启动工具后端服务 (端口 8000)...${NC}"
cd ../insurance-product-viewer/backend
# 检查是否存在虚拟环境并激活
if [ -d "venv" ]; then
    source venv/bin/activate
fi
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
TOOL_PID=$!
cd ../../kode-sdk
echo "  ✓ 工具后端 PID: $TOOL_PID"
for i in 3 2 1; do echo -ne "  ⏳ ${i}s...\r"; sleep 1; done
echo -e "  ${GREEN}✓ 工具后端已启动${NC}           "

# 启动后端 (端口 3001)
echo -e "\n${YELLOW}3/4 启动后端服务 (端口 3001)...${NC}"
# 🔥 使用 tsx 而不是 ts-node，避免缓存问题
nohup npx tsx server/index.ts > server.log 2>&1 &
BACKEND_PID=$!
echo "  ✓ 后端 PID: $BACKEND_PID"
for i in 5 4 3 2 1; do echo -ne "  ⏳ ${i}s...\r"; sleep 1; done
echo -e "  ${GREEN}✓ 后端已启动${NC}           "

# 启动前端 (端口 8890) - user-chat-frontend React应用
echo -e "\n${YELLOW}4/4 启动前端服务 (端口 8890)...${NC}"
cd ../user-chat-frontend
nohup npm run dev > /tmp/frontend-8890.log 2>&1 &
FRONTEND_PID=$!
cd ../kode-sdk
echo "  ✓ 前端 PID: $FRONTEND_PID"
for i in 3 2 1; do echo -ne "  ⏳ ${i}s...\r"; sleep 1; done
echo -e "  ${GREEN}✓ 前端已启动${NC}           "

# 测试服务
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ 所有服务已启动！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📍 服务地址：${NC}"
echo -e "  🔍 工具 API:  ${BLUE}http://localhost:8000${NC}"
echo -e "  🔧 后端 API:  ${BLUE}http://localhost:3001${NC}"
echo -e "  🌐 前端页面:  ${BLUE}http://localhost:8890${NC}\n"

echo -e "${YELLOW}📖 功能特性：${NC}"
echo -e "  • 多会话管理 - 支持创建、删除、重命名会话"
echo -e "  • SSE 流式对话 - 实时显示 AI 回复"
echo -e "  • 工具调用显示 - 展示工具执行过程 (已连接 8000 端口)"
echo -e "  • 用户隔离 - yeya 用户独立会话空间\n"

echo -e "${YELLOW}💡 提示：${NC}"
echo -e "  • 查看后端日志: ${BLUE}tail -f server.log${NC}"
echo -e "  • 查看工具日志: ${BLUE}tail -f ../insurance-product-viewer/backend/backend.log${NC}"
echo -e "  • 查看前端日志: ${BLUE}tail -f /tmp/frontend-8890.log${NC}"
echo -e "  • 停止所有服务: ${BLUE}pkill -f 'tsx.*server'; lsof -ti:8890 | xargs kill -9; lsof -ti:8000 | xargs kill -9${NC}\n"

echo -e "${GREEN}👉 请打开浏览器访问上述页面进行测试${NC}\n"

