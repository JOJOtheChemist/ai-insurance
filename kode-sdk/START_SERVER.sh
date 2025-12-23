#!/bin/bash
# Server Startup Script - Backends Only
# Usage: ./START_SERVER.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$(dirname "$0")"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 Server Backend Startup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 1. Stop old services
echo -e "${YELLOW}1/3 Stopping old services...${NC}"
pkill -f "tsx.*server" 2>/dev/null && echo "  ✓ Kode Backend stopped" || true
pkill -f "uvicorn.*main:app" 2>/dev/null && echo "  ✓ Python Backend stopped" || true
# Kill mainly by port to be sure
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# 2. Start Tool Backend (Port 8000)
echo -e "\n${YELLOW}2/3 Starting Tool Backend (Port 8000)...${NC}"
cd ../insurance-product-backend/backend

# Activate virtualenv if exists
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo -e "${RED}⚠️  Warning: No venv found in $(pwd)${NC}"
fi

# Load Environment Variables from kode-sdk/.env
if [ -f "../../kode-sdk/.env" ]; then
    echo "  Loading environment variables from ../../kode-sdk/.env"
    set -a
    source ../../kode-sdk/.env
    set +a
    echo "  Debug: DB_PASSWORD is set to '${POSTGRES_PASSWORD:0:3}***'"
    export POSTGRES_PASSWORD
    export POSTGRES_USER
    export POSTGRES_DB
    # Map to what backend expects
    export DB_PASSWORD=$POSTGRES_PASSWORD
    export DB_USER=$POSTGRES_USER
    export DB_NAME=$POSTGRES_DB
fi

# Start uvicorn in background
# Use nohup and redirect output
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
TOOL_PID=$!
echo "  ✓ Tool Backend PID: $TOOL_PID"

cd ../../kode-sdk

# 3. Start Kode Backend (Port 3001)
echo -e "\n${YELLOW}3/3 Starting Kode Backend (Port 3001)...${NC}"
# Use ts-node or tsx depending on what's installed via npm install
# server/index.ts is the entry point
# On server we probably ran npm install so ts-node/tsx should be in node_modules

if [ -f "./node_modules/.bin/tsx" ]; then
    CMD="./node_modules/.bin/tsx"
elif [ -f "./node_modules/.bin/ts-node" ]; then
    CMD="./node_modules/.bin/ts-node"
else
    CMD="npx tsx"
fi

nohup $CMD server/index.ts > server.log 2>&1 &
BACKEND_PID=$!
echo "  ✓ Kode Backend PID: $BACKEND_PID"

echo -e "\n${GREEN}✅ Services started!${NC}"
