# 🚀 快速更新指南 - Docker部署

> **适用场景**：服务器已有Docker部署运行，只需更新代码/内容

---

## 📋 更新前检查清单

在开始更新前，先确认：

```bash
# 1. 检查服务器Docker状态
ssh yue "sudo docker ps"

# 应该看到4个容器在运行：
# - insurance-postgres (15432端口)
# - insurance-api (18000端口)  
# - kode-backend (13001端口)
# - insurance-frontend (80端口)
```

---

## ⚡ 快速更新流程（3步）

### 情况1️⃣：只更新了**前端代码** (React/Vite)

```bash
# 一键更新前端
./quick-update.sh frontend
```

<details>
<summary>📖 详细步骤（点击展开）</summary>

```bash
# 1. 本地构建前端
cd react-app
npm run build

# 2. 重新构建并推送前端镜像
cd ..
docker-compose build frontend
docker save insurance-frontend:latest | ssh yue 'docker load'

# 3. 重启前端容器
ssh yue "cd /home/ubuntu/insurance && sudo docker-compose restart frontend"
```
</details>

---

### 情况2️⃣：只更新了**Kode-SDK后端** (AI Agent逻辑)

```bash
# 一键更新Kode-SDK
./quick-update.sh kode
```

<details>
<summary>📖 详细步骤（点击展开）</summary>

```bash
# 1. 重新构建并推送Kode镜像
docker-compose build kode-backend
docker save kode-backend:latest | ssh yue 'docker load'

# 2. 重启Kode容器
ssh yue "cd /home/ubuntu/insurance && sudo docker-compose restart kode-backend"
```
</details>

---

### 情况3️⃣：更新了**数据库表结构** (新增表/字段)

```bash
# 一键更新数据库+后端
./quick-update.sh db
```

<details>
<summary>📖 详细步骤（点击展开）</summary>

```bash
# 1. 导出最新数据库schema
pg_dump -h localhost -p 5432 -U yeya -d insurance_products \
  --schema-only --no-owner --no-privileges \
  > database/insurance_products_dump.sql

# 2. 上传新的SQL文件
scp database/insurance_products_dump.sql yue:/home/ubuntu/insurance/database/

# 3. 在服务器上应用更新
ssh yue << 'EOF'
cd /home/ubuntu/insurance
# 进入PostgreSQL容器执行SQL
sudo docker exec -i insurance-postgres psql -U insurance_user -d insurance_products < database/insurance_products_dump.sql
EOF

# 4. 重启后端API
ssh yue "cd /home/ubuntu/insurance && sudo docker-compose restart insurance-api"
```
</details>

---

### 情况4️⃣：需要同步**用户数据** (新用户/客户/积分等)

```bash
# 导出并上传数据
pg_dump -h localhost -p 5432 -U yeya -d insurance_products \
  --data-only --inserts \
  -t users -t user_profiles -t invite_codes -t clients \
  -t family_members -t follow_ups -t chat_sessions \
  -t session_client_links -t credit_transactions \
  > /tmp/insurance_data.sql

scp /tmp/insurance_data.sql yue:/tmp/
ssh yue "sudo docker exec -i insurance-postgres psql -U insurance_user -d insurance_products < /tmp/insurance_data.sql"
```

---

### 情况5️⃣：更新了**Python后端代码** (FastAPI/工具)

```bash
# 一键更新后端
./quick-update.sh backend
```

<details>
<summary>📖 详细步骤（点击展开）</summary>

```bash
# 1. 重新构建并推送后端镜像
docker-compose build insurance-api
docker save insurance-api:latest | ssh yue 'docker load'

# 2. 重启后端容器
ssh yue "cd /home/ubuntu/insurance && sudo docker-compose restart insurance-api"
```
</details>

---

## 🔥 全量更新（所有服务）

```bash
# 如果多个部分都改了，使用全量更新
./quick-update.sh all
```

---

## 🛠️ 快速更新脚本

将以下内容保存为 `quick-update.sh`：

```bash
#!/bin/bash
set -e

COMPONENT="${1:-all}"
SERVER="yue"
REMOTE_DIR="/home/ubuntu/insurance"

case "$COMPONENT" in
  frontend)
    echo "🔄 更新前端..."
    cd react-app && npm run build && cd ..
    docker-compose build frontend
    docker save insurance-frontend:latest | ssh $SERVER 'docker load'
    ssh $SERVER "cd $REMOTE_DIR && sudo docker-compose restart frontend"
    ;;
  kode)
    echo "🔄 更新Kode-SDK..."
    docker-compose build kode-backend
    docker save kode-backend:latest | ssh $SERVER 'docker load'
    ssh $SERVER "cd $REMOTE_DIR && sudo docker-compose restart kode-backend"
    ;;
  backend)
    echo "🔄 更新Python后端..."
    docker-compose build insurance-api
    docker save insurance-api:latest | ssh $SERVER 'docker load'
    ssh $SERVER "cd $REMOTE_DIR && sudo docker-compose restart insurance-api"
    ;;
  db)
    echo "🔄 更新数据库..."
    pg_dump -h localhost -p 5432 -U yeya -d insurance_products \
      --schema-only --no-owner --no-privileges \
      > database/insurance_products_dump.sql
    scp database/insurance_products_dump.sql $SERVER:$REMOTE_DIR/database/
    ssh $SERVER "cd $REMOTE_DIR && sudo docker exec -i insurance-postgres psql -U insurance_user -d insurance_products < database/insurance_products_dump.sql"
    ssh $SERVER "cd $REMOTE_DIR && sudo docker-compose restart insurance-api"
    ;;
  all)
    echo "🔄 全量更新所有服务..."
    cd react-app && npm run build && cd ..
    pg_dump -h localhost -p 5432 -U yeya -d insurance_products \
      --schema-only --no-owner --no-privileges \
      > database/insurance_products_dump.sql
    docker-compose build
    docker save insurance-frontend:latest kode-backend:latest insurance-api:latest | ssh $SERVER 'docker load'
    scp database/insurance_products_dump.sql $SERVER:$REMOTE_DIR/database/
    ssh $SERVER "cd $REMOTE_DIR && sudo docker-compose up -d"
    ;;
  *)
    echo "用法: $0 {frontend|kode|backend|db|all}"
    exit 1
    ;;
esac

echo "✅ 更新完成！"
```

---

## 📝 常见问题

### Q: 更新后如何验证？

```bash
# 查看容器状态
ssh yue "sudo docker ps"

# 查看最新日志
ssh yue "cd /home/ubuntu/insurance && sudo docker-compose logs -f --tail=50"

# 测试访问
curl http://140.143.194.215
```

### Q: 如果更新失败了怎么办？

```bash
# 回滚到之前的镜像
ssh yue "cd /home/ubuntu/insurance && sudo docker-compose down && sudo docker-compose up -d"
```

### Q: 数据库更新会丢失数据吗？

不会！`--schema-only` 参数只导出表结构，不会影响已有数据。

---

## ⏱️ 各更新方式耗时参考

| 更新类型 | 预计耗时 | 网络传输 |
|---------|---------|---------|
| 仅前端 | ~2分钟 | ~200MB |
| 仅Kode | ~3分钟 | ~400MB |
| 仅后端 | ~3分钟 | ~300MB |
| 数据库 | ~30秒 | ~1MB |
| 全量更新 | ~8分钟 | ~900MB |
