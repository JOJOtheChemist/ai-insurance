#!/bin/bash
# 部署到远程服务器 140.143.194.215

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# 配置
REMOTE_HOST="140.143.194.215"
REMOTE_USER="root"  # 修改为你的用户名
REMOTE_WEB_ROOT="/var/www/insurance-app"  # 修改为实际的 Nginx web 根目录
REMOTE_PROJECT_DIR="/root/ai保险-产品详情页"  # 修改为远程服务器上的项目目录

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 部署到远程服务器 ${REMOTE_HOST}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 1. 检查本地构建文件是否存在
echo -e "${YELLOW}步骤 1/5: 检查本地构建文件...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 错误: dist 目录不存在，请先运行 'npm run build'${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 构建文件已就绪${NC}\n"

# 2. 上传前端构建文件
echo -e "${YELLOW}步骤 2/5: 上传前端构建文件...${NC}"
echo -e "正在上传到 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_WEB_ROOT}/"

# 先在远程服务器上创建目录并备份旧文件
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'
    # 创建 web 根目录
    mkdir -p /var/www/insurance-app
    
    # 备份旧文件（如果存在）
    if [ -d "/var/www/insurance-app/assets" ]; then
        echo "  📦 备份旧文件..."
        mkdir -p /var/www/insurance-app-backup
        mv /var/www/insurance-app/* /var/www/insurance-app-backup/ 2>/dev/null || true
    fi
EOF

# 上传新文件
rsync -avz --progress dist/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_WEB_ROOT}/

echo -e "${GREEN}✓ 前端文件上传完成${NC}\n"

# 3. 上传并启动后端服务
echo -e "${YELLOW}步骤 3/5: 同步后端代码到远程服务器...${NC}"

# 上传 kode-sdk 目录（排除 node_modules 和日志）
rsync -avz --exclude 'node_modules' --exclude '*.log' --exclude '.kode' \
    ../kode-sdk/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PROJECT_DIR}/kode-sdk/

# 上传 insurance-product-viewer 目录
rsync -avz --exclude 'venv' --exclude '__pycache__' --exclude '*.log' \
    ../insurance-product-viewer/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PROJECT_DIR}/insurance-product-viewer/

# 上传 .env 配置文件
scp ../kode-sdk/.env ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PROJECT_DIR}/kode-sdk/.env

echo -e "${GREEN}✓ 后端代码同步完成${NC}\n"

# 4. 在远程服务器上启动服务
echo -e "${YELLOW}步骤 4/5: 在远程服务器上启动后端服务...${NC}"

ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
    cd /root/ai保险-产品详情页/kode-sdk
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        echo "  📦 安装 Node.js 依赖..."
        npm install
    fi
    
    # 安装 Python 虚拟环境（如果需要）
    cd ../insurance-product-viewer/backend
    if [ ! -d "venv" ]; then
        echo "  📦 创建 Python 虚拟环境..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    fi
    
    # 返回 kode-sdk 目录并启动服务
    cd ../../kode-sdk
    
    # 运行启动脚本
    chmod +x START.sh
    ./START.sh
ENDSSH

echo -e "${GREEN}✓ 后端服务已启动${NC}\n"

# 5. 配置 Nginx（如果需要）
echo -e "${YELLOW}步骤 5/5: 检查 Nginx 配置...${NC}"

# 创建 Nginx 配置文件
cat > /tmp/insurance-app.nginx.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name 140.143.194.215;

    # 前端静态文件
    location / {
        root /var/www/insurance-app;
        try_files $uri $uri/ /index.html;
    }

    # AI 对话 API - 转发到 Kode-SDK 后端
    location /api/chat {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # SSE 流式响应支持
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # 工具 API - 转发到 FastAPI 后端
    location /api/tools/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINX_EOF

# 上传 Nginx 配置
scp /tmp/insurance-app.nginx.conf ${REMOTE_USER}@${REMOTE_HOST}:/tmp/

# 在远程服务器上应用 Nginx 配置
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
    # 备份现有配置
    if [ -f /etc/nginx/sites-available/default ]; then
        cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
    fi
    
    # 应用新配置
    cp /tmp/insurance-app.nginx.conf /etc/nginx/sites-available/insurance-app
    ln -sf /etc/nginx/sites-available/insurance-app /etc/nginx/sites-enabled/insurance-app
    
    # 测试配置
    nginx -t
    
    # 重新加载 Nginx
    systemctl reload nginx || service nginx reload
    
    echo "✓ Nginx 配置已更新并重新加载"
ENDSSH

rm /tmp/insurance-app.nginx.conf

echo -e "${GREEN}✓ Nginx 配置完成${NC}\n"

# 完成
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📍 访问地址：${NC}"
echo -e "  🌐 前端应用: ${BLUE}http://140.143.194.215${NC}\n"

echo -e "${YELLOW}🔍 验证服务状态：${NC}"
echo -e "  ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo -e "  lsof -i:3001  # Kode-SDK 后端"
echo -e "  lsof -i:8000  # 工具后端"
echo -e "  systemctl status nginx  # Nginx 状态\n"

echo -e "${YELLOW}📋 查看日志：${NC}"
echo -e "  ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo -e "  tail -f ${REMOTE_PROJECT_DIR}/kode-sdk/server.log"
echo -e "  tail -f /var/log/nginx/error.log\n"
