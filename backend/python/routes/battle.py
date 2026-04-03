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

    monster_count = random.randint(1, 4)
    monsters_choice = con.execute(
        'SELECT * FROM enemies'
    ).fetchall()

    for i in range(monster_count):
        monster = random.choice(monsters_choice)
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

    coalesce_query = """
        SELECT
            c.*,
            COALESCE(a.name, e.name) AS name,
            COALESCE(a.level, e.level) AS level,
            a.class AS adventurer_class
        FROM combatants c
        LEFT JOIN adventurers a ON c.unit_id = a.id AND c.unit_type = 'adventurer'
        LEFT JOIN enemies e ON c.unit_id = e.id AND c.unit_type = 'enemy'
    """

    try:
        all_rows = cur.execute(coalesce_query).fetchall()
        if not all_rows:
            return {"combatants": []}
            raise HTTPException(status_code=404, detail="Combatants not found")

        return { "combatants": [dict(row) for row in all_rows] }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()

@router.post('/turn-tick')
def battle_turn_tick():
    con = get_db_con()
    cur = con.cursor()

    try:
        query = """
            SELECT c.id, c.readiness, COALESCE(a.speed, e.speed) as speed
            FROM combatants c
            LEFT JOIN adventurers a ON c.unit_id = a.id AND c.unit_type = 'adventurer'
            LEFT JOIN enemies e ON c.unit_id = e.id AND c.unit_type = 'enemy'
            WHERE c.is_dead = 0
        """

        combatants = cur.execute(query).fetchall()

        for unit in combatants:
            new_readiness = unit['readiness'] + (unit['speed'] * 0.1)
            cur.execute("UPDATE combatants SET readiness = ? WHERE id = ?", (new_readiness, unit['id']))

        con.commit()

        active_unit = cur.execute("""
            SELECT id, unit_type, unit_id
            FROM combatants
            WHERE readiness >= 100 AND is_dead = 0
            ORDER BY readiness DESC LIMIT 1
        """).fetchone()

        if active_unit:
            return {
                "turn_ready": True,
                "active_unit_id": active_unit['id'],
                "unit_type": active_unit['unit_type']
            }

        return { "turn_ready": False }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()

@router.post('/attack-enemy')
def battle_attack(attacker_id: int, target_id: int):
    con = get_db_con()
    cur = con.cursor()

    query = """
        SELECT 
        COALESCE(a.str, e.str) AS str,
        COALESCE(a.name, e.name) AS name
        FROM combatants c
        LEFT JOIN adventurers a ON c.unit_id = a.id AND c.unit_type = 'adventurer'
        LEFT JOIN enemies e ON c.unit_id = e.id AND c.unit_type = 'enemy'
        WHERE c.id = ?
    """

    t_query = """
        SELECT 
        c.*,
        COALESCE(a.name, e.name) AS name
        FROM combatants c
        LEFT JOIN adventurers a ON c.unit_id = a.id AND c.unit_type = 'adventurer'
        LEFT JOIN enemies e ON c.unit_id = e.id AND c.unit_type = 'enemy'
        WHERE c.id = ?
    """

    try:
        attacker = cur.execute(query, (attacker_id,)).fetchone()
        target = cur.execute(t_query, (target_id,)).fetchone()

        damage = attacker['str']
        new_hp = max(0, target['current_hp'] - damage)
        is_dead = 1 if new_hp <= 0 else 0

        cur.execute("UPDATE combatants SET current_hp = ?, is_dead = ? WHERE id = ?", (new_hp, is_dead, target_id))
        cur.execute("UPDATE combatants SET readiness = 0 WHERE id = ?", (attacker_id,))

        con.commit()

        return {
            "message": f"{attacker['name']} dealt {damage} damage to {target['name']}!",
            "target_hp": new_hp,
            "is_dead": is_dead
        }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post('/clear')
async def battle_end():
    con = get_db_con()
    try:
        con.execute('DELETE FROM combatants')
        con.commit()
        return { "status": "cleared" }
    finally:
        con.close()
#