#!/bin/bash
# ==========================================
# 快速更新脚本 - Docker增量部署
# 用法: ./quick-update.sh {frontend|kode|backend|db|all}
# ==========================================

set -e

COMPONENT="${1:-all}"
SERVER="yue"
REMOTE_DIR="/home/ubuntu/insurance"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 快速更新 Docker 部署${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

case "$COMPONENT" in
  frontend)
    echo -e "${YELLOW}🔄 更新前端...${NC}"
    cd react-app && npm run build && cd ..
    docker-compose build frontend
    echo -e "${YELLOW}📤 上传镜像到服务器...${NC}"
    docker save insurance-frontend:latest | ssh $SERVER 'docker load'
    echo -e "${YELLOW}♻️  重启前端容器...${NC}"
    ssh $SERVER "cd $REMOTE_DIR && sudo docker compose restart frontend"
    ;;
    
  kode)
    echo -e "${YELLOW}🔄 更新Kode-SDK...${NC}"
    docker-compose build kode-backend
    echo -e "${YELLOW}📤 上传镜像到服务器...${NC}"
    docker save kode-backend:latest | ssh $SERVER 'docker load'
    echo -e "${YELLOW}♻️  重启Kode容器...${NC}"
    ssh $SERVER "cd $REMOTE_DIR && sudo docker compose restart kode-backend"
    ;;
    
  backend)
    echo -e "${YELLOW}🔄 更新Python后端...${NC}"
    docker-compose build insurance-api
    echo -e "${YELLOW}📤 上传镜像到服务器...${NC}"
    docker save insurance-api:latest | ssh $SERVER 'docker load'
    echo -e "${YELLOW}♻️  重启后端容器...${NC}"
    ssh $SERVER "cd $REMOTE_DIR && sudo docker compose restart insurance-api"
    ;;
    
  db)
    echo -e "${YELLOW}🔄 更新数据库schema...${NC}"
    pg_dump -h localhost -p 5432 -U yeya -d insurance_products \
      --schema-only --no-owner --no-privileges \
      > database/insurance_products_dump.sql
    echo -e "${YELLOW}📤 上传SQL文件...${NC}"
    scp database/insurance_products_dump.sql $SERVER:$REMOTE_DIR/database/
    echo -e "${YELLOW}🗄️  应用数据库更新...${NC}"
    ssh $SERVER "cd $REMOTE_DIR && sudo docker exec -i insurance-postgres psql -U insurance_user -d insurance_products < database/insurance_products_dump.sql"
    echo -e "${YELLOW}♻️  重启后端API...${NC}"
    ssh $SERVER "cd $REMOTE_DIR && sudo docker compose restart insurance-api"
    ;;
    
  all)
    echo -e "${YELLOW}🔄 全量更新所有服务...${NC}"
    
    echo -e "${YELLOW}📦 1/5 构建前端...${NC}"
    cd react-app && npm run build && cd ..
    
    echo -e "${YELLOW}🗄️  2/5 导出数据库schema...${NC}"
    pg_dump -h localhost -p 5432 -U yeya -d insurance_products \
      --schema-only --no-owner --no-privileges \
      > database/insurance_products_dump.sql
    
    echo -e "${YELLOW}🔨 3/5 构建所有Docker镜像...${NC}"
    docker-compose build
    
    echo -e "${YELLOW}📤 4/5 上传镜像和配置到服务器...${NC}"
    docker save insurance-frontend:latest kode-backend:latest insurance-api:latest | ssh $SERVER 'docker load'
    scp database/insurance_products_dump.sql $SERVER:$REMOTE_DIR/database/
    scp docker-compose.yml $SERVER:$REMOTE_DIR/
    scp .env $SERVER:$REMOTE_DIR/
    
    echo -e "${YELLOW}♻️  5/5 更新并重启服务...${NC}"
    ssh $SERVER << 'EOF'
cd /home/ubuntu/insurance
sudo docker exec -i insurance-postgres psql -U insurance_user -d insurance_products < database/insurance_products_dump.sql 2>/dev/null || true
sudo docker compose up -d
EOF
    ;;
    
  *)
    echo -e "${RED}❌ 错误: 未知的组件类型${NC}"
    echo "用法: $0 {frontend|kode|backend|db|all}"
    echo ""
    echo "示例:"
    echo "  $0 frontend    # 只更新前端"
    echo "  $0 kode        # 只更新Kode-SDK"
    echo "  $0 backend     # 只更新Python后端"
    echo "  $0 db          # 只更新数据库schema"
    echo "  $0 all         # 全量更新"
    exit 1
    ;;
esac

echo -e "\n${GREEN}✅ 更新完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📋 验证部署:${NC}"
echo "  访问前端: http://140.143.194.215"
echo "  查看日志: ssh $SERVER 'cd $REMOTE_DIR && sudo docker-compose logs -f --tail=50'"
echo "  查看状态: ssh $SERVER 'sudo docker ps'"
