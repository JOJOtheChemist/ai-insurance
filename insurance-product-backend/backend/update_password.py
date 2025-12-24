from core.database import SessionLocal
from models.user import User
from core.security import get_password_hash

db = SessionLocal()

USER_ID = 1
NEW_PASSWORD = "sureai123"

print(f"--- Updating Password for User {USER_ID} ---")
user = db.query(User).filter(User.id == USER_ID).first()

if user:
    print(f"User Found: {user.username}")
    user.password_hash = get_password_hash(NEW_PASSWORD)
    db.commit()
    print("Password updated successfully.")
else:
    print("User not found!")

db.close()
