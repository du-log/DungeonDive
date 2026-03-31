from fastapi import APIRouter, HTTPException
import sqlite3
import os
import random

router = APIRouter(prefix='/battle', tags=['battle'])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", 'game.db')

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


@router.post('/start')
async def battle_start():
    con = get_db_con()

    con.execute('DELETE FROM combatants')
    squad = con.execute('SELECT * FROM adventurers WHERE in_combat_party = 1').fetchall()

    for i, hero in enumerate(squad):
        initial_cr = random.uniform(0, 5.0)
        con.execute("""
            INSERT INTO combatants (unit_type, unit_id, current_hp, max_hp, readiness, position)
            VALUES (?, ?, ?, ?, ?, ?)
            """, ('adventurer', hero['id'], hero['current_hp'], hero['max_hp'], initial_cr, i))

    monster_count = random.randint(1, 3)
    monsters = con.execute(
        'SELECT * FROM enemies ORDER BY RANDOM() LIMIT ?', (monster_count,)
    ).fetchall()

    for i, monster in enumerate(monsters):
        initial_cr = random.uniform(0, 5.0)
        con.execute("""
            INSERT INTO combatants (unit_type, unit_id, current_hp, max_hp, readiness, position)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ('enemy', monster['id'], monster['max_hp'], monster['max_hp'], initial_cr, i))

    con.commit()
    return {"status": "battle_started", "enemy_count": monster_count}

@router.get('/combatants')
def get_combatants():
    con = get_db_con()
    cur = con.cursor()

    try:
        all_rows = cur.execute('SELECT * FROM combatants').fetchall()
        if not all_rows:
            raise HTTPException(status_code=404, detail="Combatants not found")

        combatants = {
            "combatants": [dict(row) for row in all_rows]
        }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()
    return combatants
#