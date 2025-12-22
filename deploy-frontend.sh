#!/bin/bash
# 快速部署前端到远程服务器 140.143.194.215

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# 配置
REMOTE_HOST="140.143.194.215"
REMOTE_USER="ubuntu"
REMOTE_WEB_ROOT="/var/www/html"  # 默认 Nginx 路径

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 快速部署前端到 ${REMOTE_HOST}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 检查本地构建文件
echo -e "${YELLOW}步骤 1/3: 检查本地构建文件...${NC}"
if [ ! -d "react-app/dist" ]; then
    echo -e "${RED}❌ 错误: react-app/dist 目录不存在${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 构建文件已就绪${NC}\n"

# 上传前端文件
echo -e "${YELLOW}步骤 2/3: 上传前端文件到远程服务器...${NC}"
echo -e "目标: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_WEB_ROOT}/\n"

# 使用 rsync 上传（会提示输入密码）
rsync -avz --progress \
    --delete \
    react-app/dist/ \
    ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_WEB_ROOT}/

echo -e "\n${GREEN}✓ 前端文件上传完成${NC}\n"

# 验证部署
echo -e "${YELLOW}步骤 3/3: 验证部署...${NC}"
echo -e "检查远程文件..."

ssh ${REMOTE_USER}@${REMOTE_HOST} "ls -lh ${REMOTE_WEB_ROOT}/ | head -10"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ 前端部署完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📍 访问地址：${NC}"
echo -e "  🌐 ${BLUE}http://140.143.194.215${NC}\n"

echo -e "${YELLOW}⚠️  注意：${NC}"
echo -e "  前端已部署，但 AI 对话功能需要后端服务运行"
echo -e "  请确保远程服务器上运行了：${NC}"
echo -e "    - Kode-SDK 后端 (端口 3001)"
echo -e "    - FastAPI 工具后端 (端口 8000)"
echo -e "    - PostgreSQL 数据库"
echo -e "    - Nginx 已配置 /api/chat 转发到 3001\n"
