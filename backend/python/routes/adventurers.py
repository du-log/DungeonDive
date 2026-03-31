from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
import os
import random

router = APIRouter(prefix='/adventurer', tags=['adventurers'])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", 'game.db')

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

@router.get("/roster")
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
            "adventurers": [dict(row) for row in adventurer_rows]
        }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()

    return roster

@router.post("/recruit")
def recruit():
    con = get_db_con()
    RECRUIT_COST = 100

    try:
        user = con.execute('SELECT gold FROM users WHERE id = 1').fetchone()
        if user['gold'] < RECRUIT_COST:
            raise HTTPException(status_code=400, detail='Not enough gold!')
        
        con.execute('UPDATE users SET gold = gold - ? WHERE id = 1', (RECRUIT_COST,))

        names = ['John', 'Sarah', 'Mary', 'Henry', 'Sam', 'Jane']
        new_name = random.choice(names)

        classes = ['Warrior', 'Mage', 'Cleric', 'Paladin']
        new_class = random.choice(classes)

        con.execute(
            'INSERT INTO adventurers (user_id, name, class) VALUES (?, ?, ?)',
            (1, new_name, new_class,)
        )

        con.commit()
        return {"message": f"Recruited {new_class}, {new_name}!", "cost": RECRUIT_COST}
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.delete("/retire/{adv_id}")
def retire_adventurer(adv_id: int):
    con = get_db_con()
    print(f"DEBUG: Attempting to retire adventurer ID: {adv_id}")

    try:
        adv = con.execute(
            'SELECT * FROM adventurers WHERE id = ? AND user_id = 1',
            (adv_id,)
        ).fetchone()

        if not adv:
            print("DEBUG: Adventurer not found in DB")
            raise HTTPException(status_code=404, detail="Adventurer not found")
        
        print(str(adv_id))

        adv_name = adv['name']
        adv_level = adv['level']
        REFUND_AMOUNT = adv_level * 100

        print(str(REFUND_AMOUNT))

        con.execute('DELETE FROM adventurers WHERE id = ?', (adv_id,))
        print("Deleted adventurer.")
        con.execute('UPDATE users SET gold = gold + ? WHERE id = 1', (REFUND_AMOUNT,))
        print("Refunded gold.")

        con.commit()
        return {
            "message": f"Retired {adv_name}. Received {REFUND_AMOUNT} gold.",
            "refund": REFUND_AMOUNT,
        }
    except Exception as e:
        con.rollback()
        print(f"SQLERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

class HealRequest(BaseModel):
    healing_ids: list[int]

@router.post("/heal")
def heal_adventurers(data: HealRequest):
    con = get_db_con()
    HEAL_COST = 100

    total_healing_cost = len(data.healing_ids) * HEAL_COST

    try:
        for adv_id in data.healing_ids:
            res = con.execute('SELECT name, current_hp, max_hp FROM adventurers WHERE id = ?', (adv_id,)).fetchone()
            if res:
                name, current_hp, max_hp = res['name'], res['current_hp'], res['max_hp']

                new_hp = max_hp
                con.execute('UPDATE adventurers SET current_hp = ? WHERE id = ?', (new_hp, adv_id,))

        user = con.execute('SELECT gold FROM users WHERE id = 1').fetchone()
        if user['gold'] < total_healing_cost:
            raise HTTPException(status_code=400, detail='Not enough gold to heal!')
        else:
            con.execute('UPDATE users SET gold = gold - ? WHERE id = 1', (total_healing_cost,))

        con.commit()
        return {"message": f"Healed {len(data.healing_ids)} adventurers back to full health!"}
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post("/toggle/party/{adv_id}")
def toggle_party_member(adv_id: int):
    con = get_db_con()
    try:
        adv = con.execute('SELECT in_party FROM adventurers WHERE id = ? AND user_id = 1', (adv_id,)).fetchone()
        if not adv:
            raise HTTPException(status_code=404, detail="Adventurer not found")
        
        if adv['in_party']:
            con.execute('UPDATE adventurers SET in_party = FALSE WHERE id = ?', (adv_id,))
            message = "Adventurer removed from party."
        else:
            party_count = con.execute('SELECT COUNT(*) FROM adventurers WHERE user_id = 1 AND in_party = TRUE').fetchone()[0]
            if party_count >= 4:
                raise HTTPException(status_code=400, detail="Party is full! Max 4 adventurers allowed.")
            con.execute('UPDATE adventurers SET in_party = TRUE WHERE id = ?', (adv_id,))
            message = "Adventurer added to party."

        con.commit()
        return {"message": message}
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()


@router.post("/toggle/combat_party/{adv_id}")
def toggle_combat_party_member(adv_id: int):
    con = get_db_con()
    try:
        adv = con.execute('SELECT in_combat_party FROM adventurers WHERE id = ? AND user_id = 1', (adv_id,)).fetchone()
        if not adv:
            raise HTTPException(status_code=404, detail="Adventurer not found")
        
        if adv['in_combat_party']:
            con.execute('UPDATE adventurers SET in_combat_party = FALSE WHERE id = ?', (adv_id,))
            message = "Adventurer removed from combat party."
        else:
            combat_party_count = con.execute('SELECT COUNT(*) FROM adventurers WHERE user_id = 1 AND in_combat_party = TRUE').fetchone()[0]
            if combat_party_count >= 4:
                raise HTTPException(status_code=400, detail="Combat party is full! Max 4 adventurers allowed.")
            con.execute('UPDATE adventurers SET in_combat_party = TRUE WHERE id = ?', (adv_id,))
            message = "Adventurer added to combat party."

        con.commit()
        return {"message": message}
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()
#
