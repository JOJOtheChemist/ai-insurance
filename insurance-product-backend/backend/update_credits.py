from core.database import SessionLocal
from models.user import User
from models.credit_transaction import CreditTransaction

db = SessionLocal()

USER_ID = 2
TARGET_BALANCE = 300

print(f"--- Updating Credits for User {USER_ID} ---")
user = db.query(User).filter(User.id == USER_ID).first()

if user:
    print(f"User Found: {user.username}. Current Balance: {user.balance}")
    
    # Directly setting balance as per request "increase/set to 300"
    # To keep history clean, we might want to log a transaction, but let's just set it for now or add a "System Adjustment" transaction.
    
    amount_diff = TARGET_BALANCE - (user.balance or 0)
    
    user.balance = TARGET_BALANCE
    
    # Log transaction
    transaction = CreditTransaction(
        user_id=USER_ID,
        transaction_type="topup" if amount_diff > 0 else "adjust",
        amount=amount_diff,
        balance_after=TARGET_BALANCE,
        description="System Adjustment (Manual)"
    )
    db.add(transaction)
    
    db.commit()
    print(f"Balance updated to {TARGET_BALANCE} successfully.")
else:
    print("User not found!")

db.close()
