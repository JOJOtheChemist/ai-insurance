import json
import psycopg2
import sys
import datetime

# Database Config (Internal Docker)
DB_CONFIG = {
    'host': 'postgres',
    'database': 'insurance_products',
    'user': 'insurance_user',
    'password': 'insurance_password_2024',
    'port': 5432
}

def setup_data():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # 1. Insert Users
        print("👤 Creating Default Users...")
        # Check if users exist
        cursor.execute("SELECT count(*) FROM users WHERE id IN (1, 2)")
        if cursor.fetchone()[0] == 0:
            # Insert Admin (1) and User (2)
            # Password hash is dummy for now or reused if known. Using a placeholder.
            # Assuming 'hashed_password'
            cursor.execute("""
                INSERT INTO users (id, username, email, password_hash, is_active, is_superuser, balance)
                VALUES 
                (1, 'admin', 'admin@example.com', 'scrypt:32768:8:1$dummyhash$admin', true, true, 100),
                (2, 'yeya', 'yeya@example.com', 'scrypt:32768:8:1$dummyhash$yeya', true, false, 9999)
                ON CONFLICT (id) DO NOTHING;
            """)
            print("✅ Users created (Admin, Yeya)")
        else:
            print("ℹ️ Users already exist")

        # 2. Insert Client (from client_1.json content)
        print("\n👥 Creating Client...")
        client_data = {
            "id": 1,
            "name": "王宝强",
            "role": "互联网精英",
            "age": 30,
            "annual_budget": "50000",
            "annual_income": "500000",
            "location": "上海",
            "marital_status": "未婚",
            "risk_factors": ["健康保障", "熬夜", "子女教育", "猝死风险", "加班"],
            "needs": ["健康保障", "重疾保障", "猝死保障", "健康医疗保障", "医疗保障", "子女教育"],
            "resistances": [],
            "contacts": []
        }
        
        # Check if client 1 exists
        cursor.execute("SELECT count(*) FROM clients WHERE id = 1")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO clients (
                    id, salesperson_id, name, role, age, annual_budget, 
                    annual_income, location, marital_status, 
                    risk_factors, needs, resistances, contacts, 
                    create_time, update_time
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, 
                    %s, %s, %s, 
                    %s, %s, %s, %s,
                    NOW(), NOW()
                )
            """, (
                client_data['id'],
                2, # salesperson_id (link to user yeya)
                client_data['name'],
                client_data['role'],
                client_data['age'],
                client_data['annual_budget'],
                client_data['annual_income'],
                client_data['location'],
                client_data['marital_status'],
                json.dumps(client_data['risk_factors']),
                json.dumps(client_data['needs']),
                json.dumps(client_data['resistances']),
                json.dumps(client_data['contacts'])
            ))
            print(f"✅ Client '{client_data['name']}' created")
            
            # 3. Insert Client Family
            print("👨‍👩‍👧 Creating Family Members...")
            family = [{"relation": "子女", "name": "张伟儿子", "age": 3, "status": "缺口"}]
            for fm in family:
                 cursor.execute("""
                    INSERT INTO client_family (client_id, relation, name, age, status)
                    VALUES (%s, %s, %s, %s, %s)
                 """, (client_data['id'], fm['relation'], fm['name'], fm['age'], fm['status']))
            print("✅ Family members added")
            
            # 4. Insert Follow-ups (Sample)
            print("📝 Creating Follow-ups...")
            follow_ups = [
                {"type": "AI", "content": "30岁上海互联网精英王宝强，年收入50万...", "session_id": "session-init"}
            ]
            for fu in follow_ups:
                cursor.execute("""
                    INSERT INTO follow_ups (client_id, type, content, session_id, create_time)
                    VALUES (%s, %s, %s, %s, NOW())
                """, (client_data['id'], fu['type'], fu['content'], fu['session_id']))
            print("✅ Follow-ups added")

        else:
            print("ℹ️ Client 1 already exists")

        # 5. Reset Sequences (Important!)
        print("\n🔄 Resetting Sequences...")
        sequences = ['users_id_seq', 'clients_id_seq', 'client_family_id_seq', 'follow_ups_id_seq', 'insurance_product_id_seq']
        for seq in sequences:
            # Setval to max id or 1
            table = seq.replace('_id_seq', '')
            try:
                cursor.execute(f"SELECT setval('{seq}', (SELECT COALESCE(MAX(id), 1) FROM {table}) + 1);")
            except Exception as e:
                print(f"⚠️ Failed to reset {seq}: {e}")
                conn.rollback()
                continue
        print("✅ Sequences reset")

        conn.commit()
        print("\n🎉 Setup completed successfully!")
        
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    setup_data()
