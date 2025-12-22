
# 2. Login to get Token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demon", "password": "demon123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:10}..."

# 3. Send Chat Request with Client Context
# Message is just "你好", but context has "糯糯".
# Expectation: AI should call get_client_profile(name="糯糯") because of the injected prompt.
curl -N -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "你好",
    "userId": "demon",
    "agentId": "insure-recommand-v3",
    "clientId": "9",
    "clientContext": {
        "name": "糯糯",
        "role": "互联网精英",
        "age": 30,
        "budget": "50万"
    }
  }'
