import sys
import os
from sqlalchemy import func

# Add current directory to path to allow imports
sys.path.append(os.getcwd())

from core.database import SessionLocal
from models.session_client_link import SessionClientLink
from models.client import Client
from models.chat_session import ChatSession

def count_sessions():
    print("Starting count_sessions...", flush=True)
    db = SessionLocal()
    try:
        # Join Client and SessionClientLink to count sessions per client
        results = db.query(
            Client.id,
            Client.name,
            func.count(SessionClientLink.session_id).label('session_count')
        ).outerjoin(
            SessionClientLink, Client.id == SessionClientLink.client_id
        ).group_by(
            Client.id, Client.name
        ).order_by(
            func.count(SessionClientLink.session_id).desc()
        ).all()

        print(f"{'Client ID':<10} | {'Name':<20} | {'Session Count':<15}")
        print("-" * 50)
        for client_id, name, count in results:
            print(f"{client_id:<10} | {name:<20} | {count:<15}")

        # Also just print a total count of links
        total_links = db.query(SessionClientLink).count()
        print(f"\nTotal links between clients and sessions: {total_links}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    count_sessions()
