# ==========================================
# React 前端 Dockerfile（仅负责托管已构建的静态资源）
# 构建步骤在部署脚本中完成，这里直接用 Nginx 提供静态文件
# ==========================================

FROM nginx:alpine

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝打包产物
COPY dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
