# 🚀 快速部署步骤（3分钟完成配置）

## ⚡ 第一步：配置环境变量（必须！）

`.env`文件已经创建好了，你只需要修改以下两个必填项：

```bash
# 打开.env文件
nano .env
# 或
code .env
```

**必须修改的配置**：

1. **GEMINI_API_KEY**（必填）
   ```bash
   GEMINI_API_KEY=你的真实API密钥
   ```
   获取地址：https://aistudio.google.com/apikey

2. **SERVER_IP**（必填）
   ```bash
   SERVER_IP=你的服务器IP
   ```
   例如：`SERVER_IP=123.456.789.0`

**其他配置都有默认值，可以不改**。

---

## ⚡ 第二步：一键部署

```bash
# 确保部署脚本有执行权限
chmod +x deploy-docker.sh

# 开始部署（替换为你的服务器IP）
./deploy-docker.sh 123.456.789.0 root
```

**部署过程**：
- ✅ 本地构建Docker镜像（5-10分钟）
- ✅ 打包并上传到服务器（2-5分钟）
- ✅ 服务器自动启动服务

**总耗时**：约10-15分钟

---

## ⚡ 第三步：访问系统

部署成功后，浏览器访问：

```
http://你的服务器IP:15173/composite-chat-full
```

即可开始使用AI保险推荐系统！

---

## 📝 .env配置文件完整说明

当前`.env`文件内容（已自动创建）：

```bash
# 数据库配置（默认值可用）
POSTGRES_USER=insurance_user
POSTGRES_PASSWORD=insurance_password_2024  # 建议修改更复杂的密码
POSTGRES_DB=insurance_products

# Gemini API（必须填写真实密钥）
GEMINI_API_KEY=your_gemini_api_key_here  # ← 改这里！
GEMINI_MODEL_ID=glm-4.5-air

# 服务器IP（必须填写）
SERVER_IP=your.server.ip.or.domain  # ← 改这里！

# 端口配置（如果服务器端口被占用才需要改）
POSTGRES_PORT=15432
INSURANCE_API_PORT=18000
KODE_BACKEND_PORT=13001
FRONTEND_PORT=15173
```

---

## 🔍 验证配置

部署前检查：
```bash
# 查看.env文件
cat .env

# 确保GEMINI_API_KEY和SERVER_IP已填写
grep "GEMINI_API_KEY" .env
grep "SERVER_IP" .env
```

---

## 💡 提示

1. **GEMINI_API_KEY不能为空**，否则Kode后端无法启动
2. **SERVER_IP填写服务器公网IP**，不要填localhost
3. **所有其他配置都有默认值**，首次部署可以不改
4. **密码建议修改**：POSTGRES_PASSWORD改成更安全的密码

---

## 🎯 准备就绪？

现在就可以执行部署了：

```bash
./deploy-docker.sh <你的服务器IP> root
```

**部署完成后，系统立即可用，无需任何额外配置！**
