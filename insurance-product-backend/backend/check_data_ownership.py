from core.database import SessionLocal
from models.client import Client
from models.chat_session import ChatSession
from models.user import User
from models.family_member import FamilyMember
from models.follow_up import FollowUp
from sqlalchemy import func

db = SessionLocal()

def check_stats(uid, name):
    c_count = db.query(func.count(Client.id)).filter(Client.salesperson_id == uid).scalar()
    # Corrected attribute: salesperson_id
    s_count = db.query(func.count(ChatSession.id)).filter(ChatSession.salesperson_id == uid).scalar()
    print(f"User {uid} ({name}): {c_count} Clients, {s_count} Sessions")

print("--- Data Distribution Check ---")
check_stats(1, "Old User")
check_stats(2, "Demon")

db.close()
