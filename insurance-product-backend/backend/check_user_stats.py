from core.database import SessionLocal
from models.client import Client
from models.user import User
from models.family_member import FamilyMember # Fix: Ensure FamilyMember is loaded for relationship
from models.follow_up import FollowUp # Fix: Ensure FollowUp is loaded
from sqlalchemy import func

db = SessionLocal()
user_id = 2  # Demon

print(f"--- Stats for User {user_id} ---")
user = db.query(User).filter(User.id == user_id).first()
if user:
    print(f"User Found: {user.username} (ID: {user.id})")
else:
    print("User NOT FOUND")

# Clients Count
client_count = db.query(func.count(Client.id)).filter(Client.salesperson_id == user_id).scalar()
print(f"Clients Count: {client_count}")

# Plans Count
clients = db.query(Client).filter(Client.salesperson_id == user_id).all()
plans_count = sum(len(c.proposed_plans) if c.proposed_plans else 0 for c in clients)
print(f"Plans Count: {plans_count}")

db.close()
