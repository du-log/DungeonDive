from fastapi import APIRouter, HTTPException
import sqlite3
import os

router = APIRouter(prefix='/user', tags=['users'])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", 'game.db')

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

@router.get("/info")
def get_info():
    con = get_db_con()
    cur = con.cursor()

    try:
        user_row = cur.execute('SELECT * FROM users WHERE id = 1').fetchone()
        if not user_row:
            con.close()
            raise HTTPException(status_code=404, detail="User not found")

        user_info = {
            "username": user_row['username'],
            "gold": user_row['gold'],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()
    
    return user_info

@router.post("/add-gold")
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