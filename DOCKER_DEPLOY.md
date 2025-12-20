# Docker部署指南 - AI保险系统

本项目采用 **本地构建 + 传输** 的Docker部署方案，适用于4GB内存服务器。

---

## 📋 前置要求

### 本地环境（Mac）
- ✅ Docker Desktop已安装
- ✅ Git已安装
- ✅ 可SSH访问服务器

### 服务器环境
- ✅ Ubuntu/Debian/CentOS（推荐Ubuntu 22.04）
- ✅ 4GB内存 + 2核CPU
- ✅ Docker + Docker Compose已安装
- ✅ 端口15173, 13001, 18000, 15432未被占用

---

## 🚀 快速部署（3步完成）

### 步骤1：配置环境变量

```bash
cd ai保险-产品详情页

# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
nano .env  # 或使用 vim/code
```

**必须配置的项目**：
```bash
GEMINI_API_KEY=your_api_key_here  # 从 https://aistudio.google.com/apikey 获取
SERVER_IP=123.456.789.0           # 你的服务器IP
```

### 步骤2：执行部署脚本

```bash
chmod +x deploy-docker.sh
./deploy-docker.sh <服务器IP> <用户名> [端口]
```

**示例**：
```bash
# 使用root用户，默认22端口
./deploy-docker.sh 123.456.789.0 root

# 使用ubuntu用户，自定义SSH端口
./deploy-docker.sh 123.456.789.0 ubuntu 2222
```

### 步骤3：验证部署

部署完成后，访问以下地址：

- **前端页面**: http://服务器IP:15173
- **后端健康检查**: http://服务器IP:13001/api/health  
- **保险API文档**: http://服务器IP:18000/docs
- **数据库**: 服务器IP:15432 (仅容器内访问)

---

## 📊 资源占用（4GB服务器）

| 服务 | 内存 | CPU | 端口 |
|------|------|-----|------|
| PostgreSQL | ~100MB | 低 | 15432 |
| 保险API | ~200MB | 低 | 18000 |
| Kode后端 | ~300MB | 中 | 13001 |
| Nginx前端 | ~20MB | 极低 | 15173 |
| **总计** | **~620MB** | **中低** | - |
| **剩余可用** | **~3.4GB** | - | - |

---

## 🔧 常用命令

### 在服务器上执行

```bash
# 进入项目目录
cd /opt/insurance

# 查看所有容器状态
docker-compose ps

# 查看实时日志（所有服务）
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f kode-backend
docker-compose logs -f insurance-api

# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart kode-backend

# 停止所有服务
docker-compose stop

# 启动所有服务
docker-compose start

# 完全停止并删除容器（数据保留）
docker-compose down

# 完全删除（包含数据卷）
docker-compose down -v  # ⚠️ 危险：会删除数据库数据
```

### 在本地执行

```bash
# 重新部署（有代码更新时）
./deploy-docker.sh <服务器IP>

# 仅测试本地构建
docker-compose build

# 查看本地镜像
docker images | grep insurance
```

---

## 🐛 故障排查

### 问题1：部署脚本卡在"构建镜像"

**原因**：npm install下载依赖慢

**解决**：
```bash
# 配置npm国内镜像（仅首次）
npm config set registry https://registry.npmmirror.com
```

### 问题2：服务器无法访问15173端口

**原因**：防火墙未开放端口

**解决**（Ubuntu）：
```bash
sudo ufw allow 15173
sudo ufw allow 13001
sudo ufw allow 18000
```

### 问题3：数据库连接失败

**检查步骤**：
```bash
# 1. 检查数据库容器是否运行
docker-compose ps postgres

# 2. 检查数据库日志
docker-compose logs postgres

# 3. 手动连接测试
docker exec -it insurance-postgres psql -U insurance_user -d insurance_products
```

### 问题4：.env文件未生效

**检查**：
```bash
# 查看容器环境变量
docker exec kode-backend env | grep GEMINI
```

**解决**：
```bash
# 重新加载环境变量
docker-compose down
docker-compose up -d
```

---

## 📦 架构说明

```
┌─────────────────────────────────────────┐
│         Nginx (端口15173)               │
│     React前端（静态文件）                 │
└──────────────┬──────────────────────────┘
               │ API请求
┌──────────────▼──────────────────────────┐
│      Kode SDK后端 (端口13001)            │
│    Node.js + TypeScript + Agent         │
└──────────────┬──────────────────────────┘
               │ 工具调用
┌──────────────▼──────────────────────────┐
│      保险API (端口18000)                 │
│      FastAPI + Python                    │
└──────────────┬──────────────────────────┘
               │ SQL查询
┌──────────────▼──────────────────────────┐
│      PostgreSQL (端口15432)              │
│      保险产品数据库                       │
└──────────────────────────────────────────┘
```

**网络通信**：
- 前端 → 后端：通过Nginx代理 `/api/*`
- 后端 → 保险API：容器内网络 `http://insurance-api:8000`
- 保险API → 数据库：容器内网络 `postgres:5432`

---

## 🔐 安全建议

1. **修改默认密码**：编辑`.env`中的`POSTGRES_PASSWORD`
2. **使用HTTPS**：在Nginx前配置SSL证书（推荐Let's Encrypt）
3. **限制端口访问**：
   ```bash
   # 仅允许特定IP访问（可选）
   sudo ufw allow from 你的IP to any port 13001
   ```
4. **不要提交.env到Git**：已在`.gitignore`中排除

---

## 📝 更新部署

当代码有更新时：

```bash
# 1. 本地拉取最新代码
git pull

# 2. 重新部署
./deploy-docker.sh <服务器IP>
```

脚本会自动：
- 重新构建镜像
- 上传到服务器
- 替换旧容器（数据保留）
- 启动新容器

---

## 💡 高级配置

### 自定义端口映射

编辑 `docker-compose.yml`：
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # 改为8080端口
```

### 增加资源限制

编辑 `docker-compose.yml`：
```yaml
services:
  kode-backend:
    mem_limit: 1g      # 增加到1GB
    cpus: 2            # 使用2个CPU核心
```

### 配置Nginx反向代理

在服务器安装Nginx，将所有服务统一到80/443端口：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:15173;
    }

    location /api/ {
        proxy_pass http://localhost:13001;
    }
}
```

---

## 📞 支持

遇到问题？
1. 查看本文档的故障排查部分
2. 检查容器日志：`docker-compose logs -f`
3. 提交Issue到项目仓库

---

**祝部署顺利！🎉**
