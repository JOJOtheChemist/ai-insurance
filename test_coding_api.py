
import requests
import json
import time
import hmac
import hashli
import jwt

# Note: BigModel PAAS V4 usually uses JWT for authentication if calling /chat/completions directly
# But for their "Anthropic/OpenAI compatible" endpoints, they often use a simpler header.
# Let's try the simple header first, then JWT if it fails.

URL = "https://open.bigmodel.cn/api/coding/paas/v4/chat/completions"
API_KEY = "073c3d9b687d4d35ba856d0459028763.R2bvcZ8z3FDQ1cty"

def generate_token(id, secret):
    payload = {
        "api_key": id,
        "exp": int(time.time() * 1000) + 3600 * 1000,
        "timestamp": int(time.time() * 1000),
    }
    return jwt.encode(
        payload,
        secret,
        algorithm="HS256",
        headers={"alg": "HS256", "sign_type": "SIGN"},
    )

def test_coding_api():
    print(f"🚀 Testing Coding API: {URL}")
    
    api_id, api_secret = API_KEY.split(".")
    token = generate_token(api_id, api_secret)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "glm-4",
        "messages": [
            {"role": "user", "content": "你好，请用中文回复我，确认由于是编码套餐，你现在工作正常。"}
        ],
        "stream": False
    }
    
    try:
        response = requests.post(URL, headers=headers, json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n🤖 AI Response (Coding API):")
            print(result['choices'][0]['message']['content'])
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_coding_api()
