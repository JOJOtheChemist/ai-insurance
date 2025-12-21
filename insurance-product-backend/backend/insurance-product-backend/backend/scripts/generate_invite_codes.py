import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from core.database import SessionLocal, engine, Base
from models.invite_code import InviteCode
from core.invite_logic import generate_random_invite_code

def generate_codes(count=100):
    db = SessionLocal()
    try:
        # 确保表已创建
        Base.metadata.create_all(bind=engine)
        
        codes = []
        for _ in range(count):
            code_str = generate_random_invite_code()
            invite = InviteCode(code=code_str)
            db.add(invite)
            codes.append(code_str)
        
        db.commit()
        print(f"Successfully generated {count} codes.")
        with open("invite_codes_list.txt", "w") as f:
            for code in codes:
                f.write(code + "\n")
        print("Codes saved to invite_codes_list.txt")
        return codes
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    generate_codes()
