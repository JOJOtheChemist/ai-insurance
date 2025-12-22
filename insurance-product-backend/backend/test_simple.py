import sys
import os

print("Hello from python", flush=True)
print(f"CWD: {os.getcwd()}", flush=True)
print(f"Python: {sys.version}", flush=True)

try:
    from core.database import SessionLocal
    print("Import successful", flush=True)
except Exception as e:
    print(f"Import failed: {e}", flush=True)
