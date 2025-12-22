# AI 保险项目 Docker 部署实战经验总结

## 1. 硬件架构与平台兼容性 (CPU Architecture)
*   **问题**：开发机为 Mac (M 芯片/ARM64)，服务器为 Linux (x86_64/AMD64)。
*   **现象**：直接构建的镜像在服务器上报错 `exec format error` 或找不到特定平台的二进制文件（如 rollup）。
*   **经验**：
    *   在 `docker-compose.yml` 中显式声明 `platform: linux/amd64`。
    *   跨架构构建（Cross-build）在本地非常消耗内存和 CPU，若构建复杂镜像，优先考虑 **“上传源码 -> 服务器原生构建”**。

## 2. SSH 身份与权限陷阱
*   **问题**：连接时混淆了 `root` 和 `ubuntu` 用户。
*   **现象**：`rsync` 报错 `Permission denied`，无法在 `/opt` 创建目录。
*   **经验**：
    *   查看 `~/.ssh/config` 确认 `yue` 服务器配置为 `User ubuntu`。
    *   优先在用户 Home 目录 (`~/insurance`) 部署，避免复杂的权限管理。

## 3. 核心依赖与版本匹配
*   **前端 (Vite 7)**：必须使用 `node:20` 或更高版本。Dockerfile 若使用 `node:18` 会直接导致 `npm install` 警告和运行失败。
*   **后端 (FastAPI)**：
    *   **去冗余**：应用连接数据库只需要 `psycopg2-binary` 驱动。**不需要**在 Dockerfile 里安装 `postgresql-client` 系统包，这会显著增加构建时间并增加网络超时风险。
*   **构建脚本**：Node 项目如果存在 `prepare` 脚本（如运行 `tsc`），在生产环境安装时应使用 `npm install --production --ignore-scripts` 以跳过不必要的构建步骤。

## 4. 网络环境优化 (Docker Hub)
*   **问题**：国内服务器无法稳定访问 Docker Hub 导致镜像拉取失败。
*   **经验**：
    *   必须配置 `/etc/docker/daemon.json` 加速器。
    *   推荐镜像源：`https://docker.m.daocloud.io`。

## 5. 部署稳健性策略
*   **问题**：SSH 连接在构建期间频繁断开。
*   **经验**：对于超过 2 分钟的任务，必须使用 `nohup ... &` 或 `screen` 会话，确保任务在后台持久运行。

## 6. 一键启动参考
```bash
# 1. 上传
rsync -avz --exclude='.git' . yue:~/insurance/

# 2. 构建与启动
ssh yue "cd ~/insurance && sudo docker compose build && sudo docker compose up -d"
```
