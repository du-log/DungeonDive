from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
import random
import os

router = APIRouter(prefix='/dungeon', tags=['dungeon'])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", 'game.db')

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

class DungeonRequest(BaseModel):
    party_ids: list[int]

@router.post('/tick')
def dungeon_tick(data: DungeonRequest):
    con = get_db_con()
    cur = con.cursor()

    try:
        roll = random.randint(1, 100)

        if roll > 67: event = "COMBAT"
        #elif roll >= 33 and roll <= 66: event = "HEAL"
        else: event = "LOOT"

        if event == "LOOT":
            user_row = cur.execute('SELECT * FROM users WHERE id = 1').fetchone()
            if not user_row:
                con.close()
                raise HTTPException(status_code=404, detail="User not found")

            gold_amount = random.randint(100, 500)
            cur.execute('UPDATE users SET gold = gold + ? WHERE id = 1', (gold_amount,))

            con.commit()
            return {"message": f"Found a chest! +{gold_amount} Gold", "type": "loot", "roll": {roll}}
        
        if event == "COMBAT":
            return {"message": "Monsters encountered, but they ran away.", "type": "combat", "roll": {roll}}

    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()
    
