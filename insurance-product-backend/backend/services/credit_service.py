from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user import User
from models.credit_transaction import CreditTransaction


class CreditService:
    """积分服务"""
    
    @staticmethod
    def estimate_tokens(text: str) -> int:
        """
        估算文本的 token 数量
        简化估算：中文字符*2 + 英文单词数
        """
        if not text:
            return 0
        chinese_chars = sum(1 for c in text if '\u4e00' <= c <= '\u9fff')
        # 简单估算非中文部分的词数
        non_chinese = ''.join(c if not ('\u4e00' <= c <= '\u9fff') else ' ' for c in text)
        english_words = len(non_chinese.split())
        return chinese_chars * 2 + english_words
    
    @staticmethod
    def calculate_credits(input_tokens: int, output_tokens: int) -> int:
        """
        计算本次对话消耗的积分
        基础费用1积分 + 每1000 token 1积分
        """
        total_tokens = input_tokens + output_tokens
        return 1 + (total_tokens // 1000)
    
    @staticmethod
    def get_balance(db: Session, user_id: int) -> int:
        """获取用户积分余额"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        return user.balance or 0
    
    @staticmethod
    def deduct_credits(
        db: Session, 
        user_id: int, 
        amount: int, 
        session_id: str = None, 
        token_count: int = None, 
        description: str = "AI对话消费"
    ) -> dict:
        """扣除用户积分"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        
        current_balance = user.balance or 0
        if current_balance < amount:
            raise HTTPException(status_code=402, detail="积分不足，请充值")
        
        # 扣除积分
        user.balance = current_balance - amount
        
        # 记录流水
        transaction = CreditTransaction(
            user_id=user_id,
            transaction_type="consume",
            amount=-amount,
            balance_after=user.balance,
            description=description,
            session_id=session_id,
            token_count=token_count
        )
        db.add(transaction)
        db.commit()
        
        return {"success": True, "balance": user.balance, "deducted": amount}
    
    @staticmethod
    def topup_credits(
        db: Session, 
        user_id: int, 
        amount: int, 
        description: str = "积分充值"
    ) -> dict:
        """充值积分"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        
        current_balance = user.balance or 0
        user.balance = current_balance + amount
        
        transaction = CreditTransaction(
            user_id=user_id,
            transaction_type="topup",
            amount=amount,
            balance_after=user.balance,
            description=description
        )
        db.add(transaction)
        db.commit()
        
        return {"success": True, "balance": user.balance, "added": amount}
    
    @staticmethod
    def get_transactions(
        db: Session, 
        user_id: int, 
        limit: int = 20, 
        offset: int = 0
    ) -> list:
        """获取交易记录"""
        transactions = db.query(CreditTransaction).filter(
            CreditTransaction.user_id == user_id
        ).order_by(CreditTransaction.create_time.desc()).offset(offset).limit(limit).all()
        
        return [
            {
                "id": t.id,
                "type": t.transaction_type,
                "amount": t.amount,
                "balance_after": t.balance_after,
                "description": t.description,
                "session_id": t.session_id,
                "token_count": t.token_count,
                "time": t.create_time.strftime("%Y-%m-%d %H:%M") if t.create_time else None
            }
            for t in transactions
        ]
