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

        if roll > 50: event = "COMBAT"
        elif roll > 25 and roll <= 50: event = "HEAL"
        else: event = "LOOT"

        if event == "LOOT":
            user_row = cur.execute('SELECT * FROM users WHERE id = 1').fetchone()
            if not user_row:
                con.close()
                raise HTTPException(status_code=404, detail="User not found")

            gold_amount = random.randint(100, 500)
            cur.execute('UPDATE users SET gold = gold + ? WHERE id = 1', (gold_amount,))

            con.commit()
            return {
                "message": f"Found a chest! +{gold_amount} Gold",
                "gold": gold_amount,
                "type": "loot",
                "roll": {roll}
            }

        if event == "HEAL":
            heal_amount = random.randint(10, 30)
            for adv_id in data.party_ids:
                res = cur.execute('SELECT name, current_hp, max_hp FROM adventurers WHERE id = ?', (adv_id,)).fetchone()
                if res:
                    name, current_hp, max_hp = res['name'], res['current_hp'], res['max_hp']

                    new_hp = min(current_hp + heal_amount, max_hp)
                    cur.execute('UPDATE adventurers SET current_hp = ? WHERE id = ?', (new_hp, adv_id))

            con.commit()
            return {
                "message": f"Found a healing fountain! +{heal_amount} HP to all adventurers",
                "type": "heal",
                "roll": {roll}
            }
        
        if event == "COMBAT":
            combat_logs = dungeon_combat(data.party_ids, cur)
            logs_display = "\n".join(combat_logs)

            con.commit()
            return {
                "message": logs_display,
                "type": "combat",
                "roll": {roll},
                "outcome": "defeat" if "wiped out" in combat_logs[-1] else "victory"
            }

    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()
    
def dungeon_combat(party_ids, cur):
    #monster_atk = random.randint(5, 15)
    #monster_hp = random.randint(50, 100)
    combat_logs = []
    ko_count = 0

    for adv_id in party_ids:
        res = cur.execute('SELECT name, current_hp FROM adventurers WHERE id = ?', (adv_id,)).fetchone()
        if res:
            name, current_hp = res['name'], res['current_hp']

            if current_hp <= 0:
                ko_count += 1
                continue

            damage = random.randint(5, 15)
            new_hp = max(current_hp - damage, 0)

            cur.execute('UPDATE adventurers SET current_hp = ? WHERE id = ?', (new_hp, adv_id))

            if new_hp == 0:
                combat_logs.append(f"{name} took {damage} damage and was defeated!\n")
                ko_count += 1
            else:
                combat_logs.append(f"{name} took {damage} damage.\n")

    if ko_count == len(party_ids):
        combat_logs.append("All adventurers were defeated! The party has been wiped out.\n")
        
    return combat_logs
