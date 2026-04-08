from fastapi import APIRouter, HTTPException
import sqlite3
import os
import random
import math

router = APIRouter(prefix='/battle', tags=['battle'])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", 'game.db')

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def linear_enemy_scaling(base_enemy, target_level):
    lvl_multiplier = 1 + ((target_level - 1) * 0.9)
    if base_enemy['rank'] == 2: #elite
        rank_multiplier = 1.5
    elif base_enemy['rank'] == 3: #boss
        rank_multiplier = 2.0
    elif base_enemy['rank'] >= 4: #raid
        rank_multiplier = 4.0
    else:
        rank_multiplier = 1.0 #common
    
    total_multi = lvl_multiplier * rank_multiplier

    return {
        "name": f"Lvl {target_level} {base_enemy['name']}",
        "level": target_level,
        "max_hp": math.floor(base_enemy['max_hp']*total_multi),
        "str": math.floor(base_enemy['str']*total_multi),
        "dex": math.floor(base_enemy['dex']*total_multi),
        "int": math.floor(base_enemy['int']*total_multi),
        "will": math.floor(base_enemy['will']*total_multi),
        "luck": math.floor(base_enemy['luck']*total_multi),
        "speed": base_enemy['speed'] + ((target_level - 1) * 0.5),
        "xp_reward": math.floor(base_enemy['xp_reward']*total_multi),
        "gold_reward": math.floor(base_enemy['gold_reward']*total_multi)
    }

def spawn_enemy(battle_id, enemy_template_id, target_level, position):
    con = get_db_con()
    try:
        base_enemy = con.execute("SELECT * FROM enemies WHERE id = ?", (enemy_template_id,)).fetchone()
        scaled_enemy = linear_enemy_scaling(base_enemy, target_level)

        con.execute("""
            INSERT INTO combatants 
            (battle_id, unit_type, unit_id, current_hp, max_hp, current_energy, readiness, position, is_dead)
            VALUES (?, 'enemy', ?, ?, ?, 0, 0, ?, 0)
        """, (battle_id, enemy_template_id, scaled_enemy['max_hp'], scaled_enemy['max_hp'], position))
    
        con.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

def _initialize_wave(encounter_id, wave_number, min_level):
    con = get_db_con()
    try:
        con.execute("DELETE FROM combatants WHERE unit_type = 'enemy'")

        battle_id = con.execute("SELECT battle_id FROM users WHERE id = 1").fetchone()

        wave_data = con.execute("SELECT * FROM encounter_waves WHERE encounter_id = ? AND wave_number = ?", (encounter_id, wave_number,)).fetchall()

        t_pos = 0
        for entry in wave_data:
            for _ in range(entry['enemy_count']):
                spawn_enemy(battle_id, entry['enemy_template_id'], min_level, t_pos)
                t_pos += 1
        
        con.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post('/start/{encounter_id}')
async def battle_start(encounter_id: int):
    con = get_db_con()
    cur = con.cursor()

    try:
        new_battle_id = random.randint(1, 999999)
        encounter = cur.execute("SELECT * FROM encounters WHERE id = ?", (encounter_id,)).fetchall()
        if not encounter:
            raise HTTPException(status_code=500, detail="Encounter not found.")
        
        cur.execute("""
            UPDATE users SET current_view = 'battle', encounter_id = ?, current_wave = 1, battle_id = ?
            WHERE id = 1
        """, (encounter_id, new_battle_id,))

        cur.execute('DELETE FROM combatants')
        squad = cur.execute('SELECT * FROM adventurers WHERE in_combat_party = 1').fetchall()
        for i, hero in enumerate(squad):
            initial_cr = random.uniform(0, 5.0)
            con.execute("""
                INSERT INTO combatants (unit_type, unit_id, current_hp, max_hp, readiness, position)
                VALUES (?, ?, ?, ?, ?, ?)
            """, ('adventurer', hero['id'], hero['current_hp'], hero['max_hp'], initial_cr, i))

        _initialize_wave(encounter_id, 1, encounter['min_level'])
            
        con.commit()
        log_battle_event(new_battle_id, "Starting battle...")

        return {"status": "battle_started", "current_wave": 1}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post('/next-wave')
def next_wave():
    con = get_db_con()
    cur = con.cursor()

    try:
        user = cur.execute('SELECT encounter_id, current_wave, battle_id FROM users WHERE id = 1').fetchone()
        if not user:
            raise HTTPException(status_code=500, detail="Unable to get encounter id and current wave")
        next_wave_num = user['current_wave'] + 1
        next_wave_exists = cur.execute("""
            SELECT 1 FROM encounter_waves
            WHERE encounter_id = ? AND wave_number = ?
        """, (user['encounter_id'], next_wave_num,)).fetchone()
        if not next_wave_exists:
            return {
                "status": "complete",
                "message": "All Waves Cleared"
                }
        cur.execute("DELETE FROM combatants WHERE unit_type = 'enemy'")

        cur.execute("UPDATE combatants SET readiness = 0 WHERE unit_type = 'adventurer'")

        encounter = cur.execute("SELECT * FROM encounters WHERE id = ?", (user['encounter_id'],)).fetchall()

        _initialize_wave(user['encounter_id'], next_wave_num, encounter['min_level'])
        
        con.commit()

        log_battle_event(user['battle_id'], f"Wave {next_wave_num} starting...")

        return {
            "status": "next_wave",
            "wave": next_wave_num
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post('/start/random')
async def random_battle_start():
    con = get_db_con()
    cur = con.cursor()

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

    log_battle_event(1, "Starting Battle...")
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
            a.class_id AS adventurer_class
        FROM combatants c
        LEFT JOIN adventurers a ON c.unit_id = a.id AND c.unit_type = 'adventurer'
        LEFT JOIN enemies e ON c.unit_id = e.id AND c.unit_type = 'enemy'
        WHERE c.battle_id = (SELECT battle_id FROM users WHERE id = 1)
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
            WHERE c.is_dead = 0 AND c.battle_id = (SELECT battle_id FROM users WHERE id = 1)
        """

        combatants = cur.execute(query).fetchall()

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

        for unit in combatants:
            new_readiness = unit['readiness'] + (unit['speed'] * 0.1)
            cur.execute("UPDATE combatants SET readiness = ? WHERE id = ?", (new_readiness, unit['id']))

        con.commit()

        return { "turn_ready": False }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()

def log_battle_event(battle_id: int, message: str):
    con = get_db_con()
    con.execute('INSERT INTO battle_logs (battle_id, message) VALUES(?, ?)', (battle_id, message,))
    con.commit()
    con.close()

@router.get('/logs')
def get_logs():
    con = get_db_con()
    cur = con.cursor()

    try:
        rows = cur.execute('SELECT message, created_at FROM battle_logs ORDER BY id DESC LIMIT 50').fetchall()
        if not rows:
            raise HTTPException(status_code=500, detail="Logs not found")

        return { "logs": [dict(row) for row in reversed(rows)] }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

def sync_combatant_hp():
    con = get_db_con()
    cur = con.cursor()

    try:
        cur.execute("""
            UPDATE adventurers
            SET current_hp = (
                SELECT current_hp
                FROM combatants
                WHERE combatants.unit_id = adventurers.id
                AND combatants.unit_type = 'adventurer'
            )
            WHERE EXISTS (
                SELECT 1
                FROM combatants
                WHERE combatants.unit_id = adventurers.id
                AND combatants.unit_type = 'adventurer'
            )
        """)
        con.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
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

        msg = f"{attacker['name']} dealt {damage} damage to {target['name']}!"
        log_battle_event(1, msg)

        if is_dead == 1:
            log_battle_event(1, f"{target['name']} has been slain!")

        return {
            "message": msg,
            "target_hp": new_hp,
            "is_dead": is_dead
        }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.get('/status')
def battle_status():
    con = get_db_con()
    encounter = con.execute("SELECT encounter_id, current_wave FROM users WHERE id = 1").fetchone()
    total_waves = con.execute("SELECT total_waves FROM encounters WHERE id = ?", (encounter['encounter_id'])).fetchone()
    if encounter['current_wave'] == total_waves:
        is_final_wave = True
    else:
        is_final_wave = False
    
    return {
        "encounter_id": encounter['encounter_id'],
        "current_wave": encounter['current_wave'],
        "total_waves": total_waves,
        "is_final_wave": is_final_wave
    }

def calculate_level_up(adventurer_id, gained_xp):
    con = get_db_con()
    cur = con.cursor()

    try:
        # 1. Fetch Adventurer and their Class Growth rates
        query = """
            SELECT 
                a.*,
                c.hp_growth,
                c.str_growth,
                c.dex_growth,
                c.int_growth, 
                c.will_growth,
                c.luck_growth,
                c.speed_growth
            FROM adventurers a
            JOIN classes c ON a.class_id = c.id
            WHERE a.id = ?
        """
        adv = cur.execute(query, (adventurer_id,)).fetchone()
        
        new_xp = adv['experience'] + gained_xp
        new_level = adv['level']
        prev_level = adv['level']
        req_xp = adv['required_experience']
        
        # Trackers for the "Results" screen
        levels_gained = 0
        stats_gained = {"hp": 0, "str": 0, "dex": 0, "int": 0, "will": 0, "luck": 0, "spd": 0.0}

        # 2. Recursive Overflow Loop
        while new_xp >= req_xp:
            new_xp -= req_xp
            new_level += 1
            levels_gained += 1
            
            # Apply Growths
            stats_gained["hp"] += adv['hp_growth']
            stats_gained["str"] += adv['str_growth']
            stats_gained["dex"] += adv['dex_growth']
            stats_gained["int"] += adv['int_growth']
            stats_gained["will"] += adv['will_growth']
            stats_gained["luck"] += adv['luck_growth']
            stats_gained["spd"] += adv['speed_growth']
            
            # Optional: Increase the requirement for the next level
            # req_xp = int(req_xp * 1.2) 

        # 3. Update the Database
        if levels_gained > 0:
            cur.execute("""
                UPDATE adventurers SET 
                    level = ?, experience = ?, required_experience = ?,
                    max_hp = max_hp + ?, current_hp = current_hp + ?,
                    str = str + ?, dex = dex + ?, int = int + ?,
                    will = will + ?, luck = luck + ?, speed = speed + ?,
                    stat_points = stat_points + ?, skill_points = skill_points + ?
                WHERE id = ?
            """, (
                new_level, new_xp, req_xp,
                stats_gained["hp"], stats_gained["hp"], # Heal for the amount gained
                stats_gained["str"], stats_gained["dex"], stats_gained["int"],
                stats_gained["will"], stats_gained["luck"], stats_gained["spd"],
                levels_gained * 5, levels_gained * 1, # Grant points per level
                adventurer_id
            ))
        else:
            # Just update XP if no level up occurred
            cur.execute("UPDATE adventurers SET experience = ? WHERE id = ?", (new_xp, adventurer_id))

        con.commit()
        
        return {
            "levels_gained": levels_gained,
            "prev_level": prev_level,
            "new_level": new_level,
            "stats_gained": stats_gained
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post('/process-rewards')
async def process_rewards():
    con = get_db_con()
    cur = con.cursor()

    try:
        query = """
            SELECT SUM(e.xp_reward) as total_xp, SUM(e.gold_reward) as total_gold
            FROM combatants c
            JOIN enemies e ON c.unit_id = e.id
            WHERE c.unit_type = 'enemy' AND c.is_dead = 1
        """
        user = cur.execute("SELECT encounter_id, current_wave FROM users WHERE id = 1").fetchall()
        this_encounter = cur.execute("SELECT total_waves FROM encounters WHERE id = ?", (user['encounter_id'],)).fetchall()

        if user['current_wave'] != this_encounter['total_waves']:
            return {"message": "Battle still in progress."}

        rewards = cur.execute(query).fetchone()
        total_xp = rewards['total_xp'] or 0
        total_gold = rewards['total_gold'] or 0

        heroes = cur.execute("SELECT unit_id FROM combatants WHERE unit_type = 'adventurer'").fetchall()
        divisor = len(heroes)
        per_hero_xp = total_xp / divisor

        party_reports = []
        for hero in heroes:
            report = calculate_level_up(hero['unit_id'], per_hero_xp)
            party_reports.append({
                "hero_id": hero['unit_id'],
                "report": report
            })

        cur.execute("UPDATE users SET gold = gold + ? WHERE id = 1", (total_gold,))

        con.commit()

        return {
            "total_xp": total_xp,
            "xp_per_hero": per_hero_xp,
            "total_gold": total_gold,
            "party_reports": party_reports
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()

@router.post('/clear')
async def battle_end():
    con = get_db_con()
    try:
        sync_combatant_hp()

        con.execute('DELETE FROM combatants')
        con.commit()

        con.execute('DELETE FROM battle_logs')
        con.commit()

        con.execute("UPDATE users SET battle_id = 0 WHERE id = 1")
        con.commit()

        return { "status": "cleared" }
    finally:
        con.close()
#