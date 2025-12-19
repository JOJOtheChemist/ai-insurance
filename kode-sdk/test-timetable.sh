#!/bin/bash
# 测试 create_timetable 工具

echo "======================================"
echo "  Create Timetable 工具测试脚本"
echo "======================================"
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查 .env 文件
if [ ! -f ".env" ]; then
  echo "❌ 未找到 .env 配置文件"
  echo "💡 请先创建 .env 文件，参考 server/tools/config.env.example"
  exit 1
fi

# 检查 node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
fi

# 运行测试
echo "🚀 开始测试..."
echo ""

npx ts-node server/test-timetable-agent.ts

echo ""
echo "======================================"
echo "  测试完成"
echo "======================================"
echo ""
echo "💡 接下来请检查："
echo "  1. 后端API日志 - 查看请求是否成功"
echo "  2. PostgreSQL数据库 - 验证数据是否插入"
echo ""
echo "数据库检查命令："
echo "  psql -h your_host -U your_user -d ai_time -c \"SELECT * FROM time_slots ORDER BY id DESC LIMIT 10;\""
echo ""

