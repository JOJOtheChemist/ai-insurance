import requests
import json
import time

BASE_URL = "http://localhost:8080/api/v1/clients"

def test_create_client_no_id():
    print("Testing client creation WITHOUT clientId...")
    
    unique_name = f"TestUser_{int(time.time())}"
    
    payload = {
        "targetClient": unique_name,
        # NO clientId here!
        "sessionId": f"session-test-{int(time.time())}",
        "salespersonId": 1,
        "profileUpdates": {
            "name": unique_name,
            "age": 25,
            "role": "Tester"
        }
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/update-intelligence", json=payload)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
        
        if resp.status_code == 200:
            data = resp.json()
            client_id = data.get("client_id")
            print(f"✅ Created/Updated Client ID: {client_id}")
            
            if client_id == 1:
                print("❌ FAILED: Still returned ID 1! The fix did not work or name collision occurred.")
            else:
                print("✅ SUCCESS: Returned a new ID (not 1). Fix verified.")
                
            # Verify details
            verify_resp = requests.get(f"{BASE_URL}/{client_id}")
            print(f"Verify Data: {verify_resp.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_create_client_no_id()
