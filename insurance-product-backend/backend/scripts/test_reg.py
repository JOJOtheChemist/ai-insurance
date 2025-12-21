import requests
import json

def test_registration():
    url = "http://localhost:8000/api/v1/users/auth/register"
    payload = {
        "username": "testuser_01",
        "email": "test01@example.com",
        "password": "Password123!",
        "invite_code": "INV-3HBHZQCQ44LS"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("Registration test PASSED")
        else:
            print("Registration test FAILED")
            
    except Exception as e:
        print(f"Error during registration test: {e}")

if __name__ == "__main__":
    # 需要先安装 requests
    import os
    os.system("pip install requests")
    test_registration()
