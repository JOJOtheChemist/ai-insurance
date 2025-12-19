import requests
import json

BASE_URL = "http://localhost:8000/api/tools"

def test_search_coverage():
    # "救护车" (Ambulance) is often buried in coverage details, not description
    # Or "牙科" (Dental)
    keyword = "门急诊" 
    print(f"Searching for: {keyword}")
    
    resp = requests.get(f"{BASE_URL}/search", params={"keyword": keyword, "limit": 2})
    data = resp.json()
    
    print(json.dumps(data, indent=2, ensure_ascii=False))
    
    found = False
    for p in data.get('products', []):
        matches = p.get('matches', {})
        cov_snippet = matches.get('coverage')
        if cov_snippet:
            print(f"\n[SUCCESS] Found match in coverage for Product ID {p['id']}: {cov_snippet}")
            found = True
            
    if not found:
        print("\n[FAIL] No coverage snippet found.")

if __name__ == "__main__":
    test_search_coverage()
