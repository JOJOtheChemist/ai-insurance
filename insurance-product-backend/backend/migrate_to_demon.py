from core.database import SessionLocal
from models.client import Client
from models.chat_session import ChatSession
from models.user import User
from models.family_member import FamilyMember
from models.follow_up import FollowUp

db = SessionLocal()

OLD_USER_ID = 1
NEW_USER_ID = 2

def migrate():
    print(f"--- Migrating Data from User {OLD_USER_ID} to {NEW_USER_ID} ---")
    
    # 1. Update Clients
    clients = db.query(Client).filter(Client.salesperson_id == OLD_USER_ID).all()
    print(f"Found {len(clients)} clients to migrate.")
    for c in clients:
        c.salesperson_id = NEW_USER_ID
    
    # 2. Update Sessions
    sessions = db.query(ChatSession).filter(ChatSession.salesperson_id == OLD_USER_ID).all()
    print(f"Found {len(sessions)} sessions to migrate.")
    for s in sessions:
        s.salesperson_id = NEW_USER_ID
        
    db.commit()
    print("Migration committed successfully.")

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        db.rollback()
        print(f"Migration failed: {e}")
    finally:
        db.close()
