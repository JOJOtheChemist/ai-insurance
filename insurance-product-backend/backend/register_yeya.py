from core.database import SessionLocal
from models.user import User
from models.user_profile import UserProfile
from models.invite_code import InviteCode
from core.security import get_password_hash
from core.invite_logic import use_invite_code

db = SessionLocal()

# 1. Identify User 1
print("--- Identifying User 1 ---")
user1 = db.query(User).filter(User.id == 1).first()
if user1:
    print(f"User 1: Username='{user1.username}', Email='{user1.email}'")
else:
    print("User 1 not found.")

# 2. Register 'yeya'
print("\n--- Registering User 'yeya' ---")
existing_user = db.query(User).filter(User.username == "yeya").first()
if existing_user:
    print(f"User 'yeya' already exists. ID: {existing_user.id}")
else:
    # Find unused invite code
    invite_code_obj = db.query(InviteCode).filter(InviteCode.is_used == False).first()
    
    if not invite_code_obj:
        print("No unused invite codes found!")
        exit(1)
        
    invite_code = invite_code_obj.code
    print(f"Found unused invite code: {invite_code}")
    
    # Create User
    new_user = User(
        username="yeya",
        email="yeya@example.com", # Mock email
        password_hash=get_password_hash("yeya123"),
        invite_code=invite_code
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create Profile
    profile = UserProfile(user_id=new_user.id)
    db.add(profile)
    
    # Consume invite code
    use_invite_code(db, invite_code, new_user.id)
    
    db.commit()
    print(f"User 'yeya' registered successfully. ID: {new_user.id}")

db.close()
