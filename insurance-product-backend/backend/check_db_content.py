import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Add parent directory to path to import core
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

load_dotenv()

# Database connection info
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'insurance_products')
DB_USER = os.getenv('DB_USER', 'yeya')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_PORT = os.getenv('DB_PORT', '5432')

SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

def check_db():
    with engine.connect() as connection:
        # Check clients table
        print("--- Clients and their Plans ---")
        result = connection.execute(text("SELECT id, name, proposed_plans FROM clients"))
        rows = result.fetchall()
        for row in rows:
            print(f"ID: {row[0]}, Name: {row[1]}, Plans Count: {len(row[2]) if row[2] else 0}")
            if row[2]:
                for plan in row[2]:
                    print(f"  - Plan Title: {plan.get('title')}")

        # Check session-client links
        print("\n--- Session-Client Links ---")
        result = connection.execute(text("SELECT session_id, client_id FROM session_client_links"))
        rows = result.fetchall()
        for row in rows:
            print(f"Session: {row[0]}, Client ID: {row[1]}")

if __name__ == "__main__":
    check_db()
