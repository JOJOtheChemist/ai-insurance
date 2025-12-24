#!/bin/bash
# ==========================================
# Docker部署脚本 - 本地构建+传输方案
# 使用方法: ./deploy-docker.sh your-server-ip
# ==========================================

set -euo pipefail  # 遇到错误立即退出，并在管道中传播错误

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# 配置
SERVER_IP="${1}"
SERVER_USER="${2:-root}"
SERVER_PORT="${3:-22}"
PROJECT_NAME="insurance"
REMOTE_DIR="/opt/${PROJECT_NAME}"
TAR_FILE="/tmp/insurance-docker-images.tar"

# 检查参数
if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}❌ 错误: 请提供服务器IP地址${NC}"
    echo "使用方法: $0 <server-ip> [user] [port]"
    echo "示例: $0 192.168.1.100 ubuntu 22"
    exit 1
fi

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      保险AI系统 - Docker部署脚本 (本地构建)         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}目标服务器: ${SERVER_USER}@${SERVER_IP}:${SERVER_PORT}${NC}"
echo -e "${YELLOW}部署目录: ${REMOTE_DIR}${NC}"
echo ""

# ==========================================
# 步骤1: 检查.env文件
# ==========================================
echo -e "${YELLOW}📋 步骤1/7: 检查环境变量配置...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  未找到.env文件，复制.env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ 请先编辑 .env 文件，填入正确的配置！${NC}"
    echo -e "${YELLOW}需要配置的项目:${NC}"
    echo "  - GEMINI_API_KEY (必填)"
    echo "  - SERVER_IP (必填)"
    echo "  - POSTGRES_PASSWORD (可选)"
    exit 1
fi
echo -e "${GREEN}✓ 环境变量配置检查完成${NC}"

# ==========================================
# 步骤2: 本地构建 React 前端静态文件
# ==========================================
echo -e "\n${YELLOW}🧱 步骤2/7: 构建 React 前端静态资源...${NC}"
pushd react-app > /dev/null
if [ ! -d "node_modules" ]; then
    echo "  • 首次安装依赖..."
    npm install
fi
echo "  • 执行 npm run build..."
npm run build
popd > /dev/null
echo -e "${GREEN}✓ React 前端构建完成${NC}"

# ==========================================
# 步骤3: 本地构建Docker镜像
# ==========================================
echo -e "\n${YELLOW}🔨 步骤3/7: 本地构建Docker镜像...${NC}"
echo "这可能需要5-10分钟，请耐心等待..."

docker-compose build --no-cache 2>&1 | while read line; do
    echo "  $line"
done

echo -e "${GREEN}✓ Docker镜像构建完成${NC}"

# ==========================================
# 步骤3: 保存镜像为tar文件
# ==========================================
echo -e "\n${YELLOW}📦 步骤4/7: 保存镜像为tar文件...${NC}"
echo "  • 确保 postgres 基础镜像存在..."
docker pull postgres:15-alpine > /dev/null

docker save -o "${TAR_FILE}" \
    insurance-frontend:latest \
    insurance-api:latest \
    kode-backend:latest \
    postgres:15-alpine

# 显示文件大小
TAR_SIZE=$(du -h "${TAR_FILE}" | cut -f1)
echo -e "${GREEN}✓ 镜像已保存: ${TAR_FILE} (${TAR_SIZE})${NC}"

# ==========================================
# 步骤4: 上传tar文件到服务器
# ==========================================
echo -e "\n${YELLOW}📤 步骤5/7: 上传镜像到服务器...${NC}"
echo "正在上传 ${TAR_SIZE} 数据，这可能需要几分钟..."

scp -P "${SERVER_PORT}" "${TAR_FILE}" "${SERVER_USER}@${SERVER_IP}:/tmp/" 2>&1 | while read line; do
    echo "  $line"
done

echo -e "${GREEN}✓ 镜像上传完成${NC}"

# ==========================================
# 步骤5: 上传配置文件到服务器
# ==========================================
echo -e "\n${YELLOW}📤 步骤6/7: 上传配置文件...${NC}"

# 创建临时目录存放要上传的文件
TMP_UPLOAD_DIR="/tmp/insurance-deploy"
mkdir -p "${TMP_UPLOAD_DIR}"

# 复制需要的文件
cp docker-compose.yml "${TMP_UPLOAD_DIR}/"
cp .env "${TMP_UPLOAD_DIR}/"
cp -r database "${TMP_UPLOAD_DIR}/"

# 打包并上传
tar -czf /tmp/insurance-config.tar.gz -C "${TMP_UPLOAD_DIR}" .
scp -P "${SERVER_PORT}" /tmp/insurance-config.tar.gz "${SERVER_USER}@${SERVER_IP}:/tmp/"

echo -e "${GREEN}✓ 配置文件上传完成${NC}"

# ==========================================
# 步骤6: 在服务器上加载镜像并启动
# ==========================================
echo -e "\n${YELLOW}🚀 步骤7/7: 远程启动 Docker 服务...${NC}"

ssh -p "${SERVER_PORT}" "${SERVER_USER}@${SERVER_IP}" << 'ENDSSH'
set -e

echo "  → 创建部署目录..."
mkdir -p /opt/insurance
cd /opt/insurance

echo "  → 解压配置文件..."
tar -xzf /tmp/insurance-config.tar.gz

echo "  → 加载Docker镜像..."
docker load -i /tmp/insurance-docker-images.tar

echo "  → 停止旧容器（如果存在）..."
docker-compose down 2>/dev/null || true

echo "  → 启动新容器..."
docker-compose up -d

echo "  → 等待服务启动..."
sleep 10

echo "  → 检查服务状态..."
docker-compose ps

echo "  → 清理临时文件..."
rm -f /tmp/insurance-docker-images.tar
rm -f /tmp/insurance-config.tar.gz

ENDSSH

# ==========================================
# 清理本地临时文件
# ==========================================
echo -e "\n${YELLOW}🧹 清理本地临时文件...${NC}"
rm -f "${TAR_FILE}"
rm -f /tmp/insurance-config.tar.gz
rm -rf "${TMP_UPLOAD_DIR}"

# ==========================================
# 完成
# ==========================================
echo -e "\n${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  ✅ 部署成功！                        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🎉 保险AI系统已成功部署到服务器！${NC}"
echo ""
echo -e "${YELLOW}📍 访问地址:${NC}"
echo -e "  前端页面: ${BLUE}http://${SERVER_IP}:15173${NC}"
echo -e "  后端API:  ${BLUE}http://${SERVER_IP}:13001/api/health${NC}"
echo -e "  保险API:  ${BLUE}http://${SERVER_IP}:18000/docs${NC}"
echo ""
echo -e "${YELLOW}💡 常用命令:${NC}"
echo "  查看日志: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${REMOTE_DIR} && docker-compose logs -f'"
echo "  重启服务: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${REMOTE_DIR} && docker-compose restart'"
echo "  停止服务: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${REMOTE_DIR} && docker-compose stop'"
echo ""
