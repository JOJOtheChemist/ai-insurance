# 🚀 启动指南

## 项目概述

本项目包含：
1. **FastAPI 后端** - 提供产品和费率数据 API
2. **Vue.js 前端** - 产品查看器和费率计算器

## 前置要求

- Python 3.x
- Node.js 和 npm
- PostgreSQL 数据库

## 快速启动

### 1. 启动后端 API

```bash
cd /Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/insurance-product-viewer

# 激活虚拟环境
source venv/bin/activate

# 启动 FastAPI 后端（端口 8000）
python3 backend/main.py

# 或者在后台运行
nohup python3 backend/main.py > backend.log 2>&1 &
```

验证后端是否启动成功：
```bash
curl http://localhost:8000/
```

### 2. 启动前端开发服务器

打开新的终端窗口：

```bash
cd /Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/insurance-product-viewer

# 启动 Vite 开发服务器（端口 5173）
npm run dev
```

### 3. 访问应用

打开浏览器访问：
- 前端应用: http://localhost:5173/
- 后端 API 文档: http://localhost:8000/docs

## 功能模块

### 📋 产品列表页面
- 查看所有保险产品
- 按类型筛选产品
- 查看产品详细信息
- 显示产品扩展信息

### 💰 费率计算器
- 选择产品
- 输入投保信息（年龄、性别、缴费期限等）
- 实时计算保费
- 显示缴费时间表

## API 端点

### 产品相关
- `GET /api/products` - 获取所有产品
- `GET /api/products/{id}` - 获取单个产品详情
- `GET /api/product-types` - 获取产品类型列表

### 费率相关
- `GET /api/rates/products` - 获取有费率数据的产品列表
- `GET /api/rates/{product_name}` - 查询产品费率
- `GET /api/rates/{product_name}/options` - 获取产品的所有可用选项
- `POST /api/rates/calculate` - 计算保费

## 数据管理

### 重新导入费率数据

如果需要更新费率数据：

```bash
# 确保虚拟环境已激活
source venv/bin/activate

# 运行导入脚本
python3 import_rates.py
```

### 数据库查询

直接查询 PostgreSQL：

```bash
psql -U yeya -d insurance_products

# 查看费率记录数
SELECT COUNT(*) FROM insurance_rates;

# 查看产品列表
SELECT product_name, COUNT(*) FROM insurance_rates GROUP BY product_name;
```

## 常见问题

### Q: 后端启动失败？
A: 确保：
1. PostgreSQL 服务正在运行
2. 已激活虚拟环境
3. 数据库连接配置正确（backend/main.py）

### Q: 前端无法连接后端？
A: 检查：
1. 后端是否在 8000 端口运行
2. CORS 配置是否正确
3. 浏览器控制台是否有错误

### Q: 费率计算失败？
A: 确认：
1. 费率数据已导入数据库
2. 选择的参数组合在数据库中存在
3. 后端 API 日志中的错误信息

## 停止服务

### 停止后端
```bash
# 如果在前台运行，按 Ctrl+C

# 如果在后台运行
pkill -f "uvicorn.*main:app"
# 或
ps aux | grep "python3 backend/main.py"
kill <PID>
```

### 停止前端
按 `Ctrl+C` 停止 Vite 开发服务器

## 生产部署

### 后端部署
```bash
# 使用 Gunicorn 和 Uvicorn
pip install gunicorn

gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### 前端构建
```bash
# 构建生产版本
npm run build

# 构建产物在 dist/ 目录
# 可以使用 Nginx 或其他 Web 服务器托管
```

## 项目结构

```
insurance-product-viewer/
├── backend/
│   └── main.py              # FastAPI 后端
├── src/
│   ├── App.vue              # 主应用组件
│   ├── ProductViewer.vue    # 产品查看器
│   └── RateCalculator.vue   # 费率计算器
├── import_rates.py          # 费率数据导入脚本
├── create_rates_table.sql   # 费率表创建脚本
├── example_rate_queries.sql # 示例查询
├── README_RATES.md          # 费率导入说明
└── START_GUIDE.md           # 本文件
```

## 技术栈

- **后端**: FastAPI, PostgreSQL, psycopg2
- **前端**: Vue.js 3, Vite
- **数据库**: PostgreSQL

## 开发团队

如有问题，请联系开发团队。
