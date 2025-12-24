# ==========================================
# Kode SDK 后端 Dockerfile
# Node.js + TypeScript
# ==========================================

FROM node:20-alpine

WORKDIR /app

# 使用阿里云镜像源并安装必要依赖
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk add --no-cache curl

# 复制package文件
COPY package*.json ./

# 安装依赖（使用npm install支持跨平台构建，忽略build脚本）
RUN npm install --production --ignore-scripts

# 复制源代码
COPY . .

# 创建会话存储目录
RUN mkdir -p .kode

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# 启动应用（使用tsx运行TypeScript）
CMD ["npx", "tsx", "server/index.ts"]
