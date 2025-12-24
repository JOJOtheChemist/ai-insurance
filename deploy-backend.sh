#!/bin/bash
# 部署后端服务到远程服务器

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

REMOTE_HOST="140.143.194.215"
REMOTE_USER="ubuntu"
REMOTE_PROJECT_DIR="/home/ubuntu/ai保险-产品详情页"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 部署后端服务到 ${REMOTE_HOST}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 1. 同步后端代码
echo -e "${YELLOW}步骤 1/3: 同步后端代码到远程服务器...${NC}"

# 确保远程目录存在
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_PROJECT_DIR}"

# 上传 kode-sdk 目录
echo "  📦 上传 Kode-SDK..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '*.log' \
    --exclude '.kode' \
    --exclude 'dist' \
    kode-sdk/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PROJECT_DIR}/kode-sdk/

# 上传 insurance-product-backend 目录
echo "  📦 上传 FastAPI 工具后端..."
rsync -avz --progress \
    --exclude 'venv' \
    --exclude '__pycache__' \
    --exclude '*.log' \
    insurance-product-backend/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PROJECT_DIR}/insurance-product-backend/

# 上传数据库文件
echo "  📦 上传数据库文件..."
rsync -avz --progress \
    database/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PROJECT_DIR}/database/

echo -e "${GREEN}✓ 后端代码同步完成${NC}\n"

# 2. 在远程服务器上安装依赖并启动服务
echo -e "${YELLOW}步骤 2/3: 在远程服务器上安装依赖并启动服务...${NC}"

ssh ${REMOTE_USER}@${REMOTE_HOST} bash << 'ENDSSH'
    set -e
    
    cd /home/ubuntu/ai保险-产品详情页/kode-sdk
    
    echo "  📦 安装 Node.js 依赖..."
    npm install
    
    echo "  🔨 编译 TypeScript..."
    npm run build || true
    
    echo "  📦 设置 Python 虚拟环境..."
    cd ../insurance-product-backend/backend
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt || true
    deactivate
    
    cd ../../kode-sdk
    
    echo "  🛑 停止旧服务..."
    pkill -f "tsx.*server" 2>/dev/null || true
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 2
    
    echo "  🚀 启动后端服务..."
    chmod +x START.sh
    nohup ./START.sh > /tmp/startup.log 2>&1 &
    
    echo "  ⏳ 等待服务启动..."
    sleep 10
    
    echo "  ✅ 检查服务状态："
    lsof -i:3001 && echo "    ✓ Kode-SDK 后端 (3001) 已启动" || echo "    ✗ Kode-SDK 后端未启动"
    lsof -i:8000 && echo "    ✓ FastAPI 工具后端 (8000) 已启动" || echo "    ✗ FastAPI 工具后端未启动"
ENDSSH

echo -e "\n${GREEN}✓ 后端服务已启动${NC}\n"

# 3. 配置 Nginx
echo -e "${YELLOW}步骤 3/3: 配置 Nginx...${NC}"

# 创建 Nginx 配置
cat > /tmp/insurance-app.nginx.conf << 'NGINX_EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # 前端静态文件
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }

    # AI 对话 API
    location /api/chat {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # SSE 流式响应
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # 工具 API
    location /api/tools/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINXEOF

# 上传并应用 Nginx 配置
scp /tmp/insurance-app.nginx.conf ${REMOTE_USER}@${REMOTE_HOST}:/tmp/

ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
    sudo cp /tmp/insurance-app.nginx.conf /etc/nginx/sites-available/default
    sudo nginx -t && sudo systemctl reload nginx
    echo "  ✓ Nginx 配置已更新"
ENDSSH

rm /tmp/insurance-app.nginx.conf

echo -e "${GREEN}✓ Nginx 配置完成${NC}\n"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📍 访问地址：${NC}"
echo -e "  🌐 ${BLUE}http://140.143.194.215${NC}\n"

echo -e "${YELLOW}🔍 验证服务（在远程服务器）：${NC}"
echo -e "  ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo -e "  lsof -i:3001  # Kode-SDK 后端"
echo -e "  lsof -i:8000  # 工具后端\n"

echo -e "${YELLOW}📋 查看日志：${NC}"
echo -e "  ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo -e "  tail -f ${REMOTE_PROJECT_DIR}/kode-sdk/server.log"
echo -e "  tail -f /tmp/startup.log\n"
