from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os
import random

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'game.db')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

@app.get("/")
def read_root():
    return{"status": "Server Online"}

@app.get("/player/roster")
def get_stats():
    con = get_db_con()
    cur = con.cursor()

    try:
        user_row = cur.execute('SELECT * FROM users WHERE id = 1').fetchone()
        if not user_row:
            con.close()
            raise HTTPException(status_code=404, detail="User not found")
    
        adventurer_rows = cur.execute(
            'SELECT * FROM adventurers WHERE user_id = ?', (user_row['id'],)
        ).fetchall()

        roster = {
            "username": user_row['username'],
            "total_gold": user_row['gold'],
            "adventurers": [dict(row) for row in adventurer_rows]
        }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()

    return roster

@app.post("/adventurer/recruit")
def recruit():
    con = get_db_con()
    RECRUIT_COST = 1000

    try:
        user = con.execute('select gold from users where id = 1').fetchone()
        if user['gold'] < RECRUIT_COST:
            raise HTTPException(status_code=400, detail='Not enough gold!')
        
        con.execute('update users set gold = gold - ? where id = 1', (RECRUIT_COST,))

        names = ['John', 'Sarah', 'Mary', 'Henry', 'Sam', 'Jane']
        new_name = random.choice(names)

        classes = ['Warrior', 'Mage', 'Cleric', 'Paladin']
        new_class = random.choice(classes)

        con.execute(
            'insert into adventurers (user_id, name, class) values (?, ?, ?)', 
            (1, new_name, new_class)
        )

        con.commit()
        return {"message": f"Recruited {new_class}, {new_name}!", "cost": RECRUIT_COST}
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@app.post("/user/add-gold")
def add_gold():
    con = get_db_con()
    gold_amount = 100

    try:
        user = con.execute('select gold from users where id = 1').fetchone()
        con.execute('update users set gold = gold + ? where id = 1', (gold_amount,))
        con.commit()
        return{"message": f"Gained {gold_amount} gold!"}
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()
