# ==========================================
# React 前端 Dockerfile (多阶段构建)
# 构建阶段 + Nginx运行阶段
# ==========================================

# ========== 阶段1: 构建 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 清理并重新安装依赖（包含所有依赖以确保rollup正常工作）
RUN rm -rf node_modules package-lock.json \
    && npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# ========== 阶段2: 运行 ==========
FROM nginx:alpine

# 复制构建产物到Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
