from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from typing import List, Optional, Any

from models.client import Client
from models.family_member import FamilyMember
from models.follow_up import FollowUp
from models.chat_session import ChatSession
from models.session_client_link import SessionClientLink
from schemas.client import IntelligenceUpdateSchema, PlanSubmissionSchema

class ClientService:
    @staticmethod
    def update_intelligence(data: IntelligenceUpdateSchema, db: Session):
        client_id = data.clientId
        
        # 1. 确保 Session 存在
        session = db.query(ChatSession).filter(ChatSession.id == data.sessionId).first()
        if not session:
            session = ChatSession(id=data.sessionId, salesperson_id=data.salespersonId)
            db.add(session)
            db.commit()
        
        # 2. 定位或创建客户
        if not client_id:
            if data.targetClient:
                exist_client = db.query(Client).filter(
                    Client.name == data.targetClient,
                    Client.salesperson_id == data.salespersonId
                ).first()
                
                if exist_client:
                    client_id = exist_client.id
                else:
                    new_client = Client(
                        name=data.targetClient,
                        salesperson_id=data.salespersonId,
                        create_time=datetime.utcnow()
                    )
                    db.add(new_client)
                    db.commit()
                    db.refresh(new_client)
                    client_id = new_client.id
            else:
                name_in_profile = (data.profileUpdates or {}).get("name")
                if name_in_profile:
                     new_client = Client(
                        name=name_in_profile,
                        salesperson_id=data.salespersonId,
                        create_time=datetime.utcnow()
                    )
                     db.add(new_client)
                     db.commit()
                     db.refresh(new_client)
                     client_id = new_client.id
                else:
                    raise HTTPException(status_code=400, detail="Missing clientId or targetClient to identify the customer.")
    
        # 3. 建立 Session-Client 关联
        link = db.query(SessionClientLink).filter(
            SessionClientLink.session_id == data.sessionId,
            SessionClientLink.client_id == client_id
        ).first()
        
        if not link:
            new_link = SessionClientLink(session_id=data.sessionId, client_id=client_id)
            db.add(new_link)
            db.commit()
    
        # 4. 获取客户实体进行更新
        client = db.query(Client).filter(Client.id == client_id).first()
    
        # 5. 差异化更新画像
        if data.profileUpdates:
            for key, value in data.profileUpdates.items():
                if hasattr(client, key):
                    old_val = getattr(client, key)
                    if key in ["risk_factors", "needs", "resistances"]:
                        if isinstance(old_val, list) and isinstance(value, list):
                            new_list = list(set(old_val + value))
                            setattr(client, key, new_list)
                        elif value is not None:
                            setattr(client, key, value)
                    elif key == "contacts":
                        if isinstance(old_val, list) and isinstance(value, list) and len(value) > 0:
                            contact_dict = {c.get("name"): c for c in (old_val or []) if c.get("name")}
                            for new_c in value:
                                if new_c.get("name"):
                                    contact_dict[new_c.get("name")] = new_c
                            setattr(client, key, list(contact_dict.values()))
                        elif value is not None:
                            setattr(client, key, value)
                    else:
                        if value is not None:
                            setattr(client, key, value)
            client.update_time = datetime.utcnow()
    
        # 6. 家庭成员处理
        if data.familyMembers:
            for fm_data in data.familyMembers:
                fm = db.query(FamilyMember).filter(
                    FamilyMember.client_id == client_id, 
                    FamilyMember.relation == fm_data.relation
                ).first()
                if fm:
                    fm.name = fm_data.name or fm.name
                    fm.age = fm_data.age or fm.age
                    fm.status = fm_data.status or fm.status
                else:
                    new_fm = FamilyMember(
                        client_id=client_id,
                        relation=fm_data.relation,
                        name=fm_data.name,
                        age=fm_data.age,
                        status=fm_data.status
                    )
                    db.add(new_fm)
    
        # 7. 记录跟进摘要
        if data.followUpSummary:
            new_follow_up = FollowUp(
                client_id=client_id,
                session_id=data.sessionId,
                type="AI",
                content=data.followUpSummary,
                create_time=datetime.utcnow()
            )
            db.add(new_follow_up)
    
        db.commit()
        return {"status": "success", "client_id": client_id, "linked_session": data.sessionId}

    @staticmethod
    def submit_plan(data: PlanSubmissionSchema, db: Session):
        # 1. 查找客户 (按姓名和 Session 关联)
        link = db.query(SessionClientLink).filter(
            SessionClientLink.session_id == data.sessionId
        ).order_by(SessionClientLink.id.desc()).first()
        
        client_id = None
        if link:
            client_id = link.client_id
        else:
            session = db.query(ChatSession).filter(ChatSession.id == data.sessionId).first()
            salesperson_id = 1 if not session else session.salesperson_id
            
            client = db.query(Client).filter(
                Client.name == data.targetClient,
                Client.salesperson_id == salesperson_id
            ).first()
            
            if not client:
                client = Client(
                    name=data.targetClient,
                    salesperson_id=salesperson_id,
                    create_time=datetime.utcnow()
                )
                db.add(client)
                db.commit()
                db.refresh(client)
            
            client_id = client.id
            new_link = SessionClientLink(session_id=data.sessionId, client_id=client_id)
            db.add(new_link)
            db.commit()
    
        # 2. 获取客户并追加方案
        client = db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
    
        new_plan = data.plan.dict()
        new_plan["created_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        if data.reasoning:
            new_plan["reasoning"] = data.reasoning
    
        current_plans = list(client.proposed_plans or [])
        existing_idx = -1
        for i, p in enumerate(current_plans):
            if p.get("title") == new_plan["title"]:
                existing_idx = i
                break
        
        if existing_idx >= 0:
            current_plans[existing_idx] = new_plan
        else:
            current_plans.insert(0, new_plan)
            
        client.proposed_plans = current_plans
        client.update_time = datetime.utcnow()
        
        db.commit()
        return {"status": "success", "client_id": client_id, "plan_id": len(current_plans)}

    @staticmethod
    def get_grouped_history(salesperson_id: int, db: Session):
        results = db.query(
            ChatSession,
            Client
        ).outerjoin(
            SessionClientLink, ChatSession.id == SessionClientLink.session_id
        ).outerjoin(
            Client, SessionClientLink.client_id == Client.id
        ).filter(
            ChatSession.salesperson_id == salesperson_id
        ).order_by(
            ChatSession.id.desc()
        ).all()
    
        grouped_data = {}
        unassigned_sessions = []
        
        # Get session IDs to fetch associated follow-ups (AI summaries)
        session_ids = [s.id for s, _ in results]
        follow_ups = db.query(FollowUp).filter(FollowUp.session_id.in_(session_ids)).all()
        session_summary_map = {f.session_id: f.content for f in follow_ups}

        def format_session(s):
            try:
                ts = int(s.id.split('-')[1])
                time_str = datetime.fromtimestamp(ts/1000).strftime("%Y-%m-%d %H:%M")
                delta = datetime.now() - datetime.fromtimestamp(ts/1000)
                if delta.days == 0:
                    relative_time = "今天 " + datetime.fromtimestamp(ts/1000).strftime("%H:%M")
                elif delta.days == 1:
                    relative_time = "昨天"
                elif delta.days < 7:
                    relative_time = f"{delta.days}天前"
                else:
                    relative_time = datetime.fromtimestamp(ts/1000).strftime("%Y/%m/%d")
            except:
                time_str = "Unknown"
                relative_time = "未知时间"

            # Use session summary, or fallback to FollowUp content (AI generated summary), or session title
            summary_text = s.summary
            if not summary_text:
                summary_text = session_summary_map.get(s.id)
            if not summary_text:
                summary_text = s.title or "暂无摘要"

            return {
                "id": s.id,
                "title": s.title or "新会话",
                "summary": summary_text,
                "time": relative_time,
                "full_time": time_str
            }
    
        for session, client in results:
            s_data = format_session(session)
            
            if client:
                if client.id not in grouped_data:
                    grouped_data[client.id] = {
                        "client": {
                            "id": client.id,
                            "name": client.name,
                            "avatar_char": client.name[0] if client.name else "?",
                            "role": client.role,
                            "status": "active",
                            "annual_budget": client.annual_budget
                        },
                        "sessions": []
                    }
                grouped_data[client.id]["sessions"].append(s_data)
            else:
                unassigned_sessions.append(s_data)
    
        client_groups = list(grouped_data.values())
        client_groups.sort(key=lambda x: x['sessions'][0]['id'], reverse=True)
    
        return {
            "groups": client_groups,
            "unassigned": unassigned_sessions
        }
