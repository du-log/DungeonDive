import sqlite3

def init_db():
    # Connect to game.db, create if does not exist
    con = sqlite3.connect('game.db')
    cur = con.cursor()

    # Create User Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            gold INTEGER DEFAULT 100,
            current_view TEXT DEFAULT 'town',
            encounter_id INTEGER,
            current_wave INTEGER,
            battle_id INTEGER,
            pending_xp INTEGER DEFAULT 0,
            pending_gold INTEGER DEFAULT 0
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_name TEXT NOT NULL,
            tier INTEGER DEFAULT 1,
            base_hp INTEGER,
            base_str INTEGER,
            base_dex INTEGER,
            base_int INTEGER,
            base_will INTEGER,
            base_luck INTEGER,
            base_speed INTEGER,
            hp_growth INTEGER,
            str_growth INTEGER,
            dex_growth INTEGER,
            int_growth INTEGER,
            will_growth INTEGER,
            luck_growth INTEGER,
            speed_growth FLOAT,
            recruitment_cost INTEGER DEFAULT 50,
            parent_class_id INTEGER DEFAULT NULL
        )
    ''')

    # Create Adventurer Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS adventurers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            experience INTEGER DEFAULT 0,
            required_experience INTEGER DEFAULT 100,
            class_id INTEGER NOT NULL,
            current_hp INTEGER DEFAULT 100,
            max_hp INTEGER DEFAULT 100,
            str INTEGER DEFAULT 10,
            dex INTEGER DEFAULT 10,
            int INTEGER DEFAULT 10,
            will INTEGER DEFAULT 10,
            luck INTEGER DEFAULT 10,
            speed FLOAT DEFAULT 100.0,
            stat_points INTEGER DEFAULT 0,
            skill_points INTEGER DEFAULT 0,
            in_party BOOLEAN DEFAULT FALSE,
            in_combat_party BOOLEAN DEFAULT FALSE,
            current_energy INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (class_id) REFERENCES classes (id)
        )
    ''')

    # Enemy Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS enemies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            max_hp INTEGER DEFAULT 100,
            str INTEGER DEFAULT 10,
            dex INTEGER DEFAULT 10,
            int INTEGER DEFAULT 10,
            will INTEGER DEFAULT 10,
            luck INTEGER DEFAULT 10,
            speed INTEGER DEFAULT 100,
            xp_reward INTEGER DEFAULT 50,
            gold_reward INTEGER DEFAULT 50,
            rank INTEGER DEFAULT 1,
            location_id INTEGER DEFAULT 1,
            min_level INTEGER
        )
    ''')

    # Skills Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            base_multiplier FLOAT DEFAULT 1.0,
            cooldown_turns INTEGER DEFAULT 3,
            energy_gain INTEGER DEFAULT 10,
            effect_type TEXT,
            target_type TEXT CHECK(target_type IN ('single', 'all', 'self')),
            required_level INTEGER DEFAULT 1,
            required_tier INTEGER DEFAULT 1,
            class_id INTEGER DEFAULT 0
        )
    ''')

    # Status Effects Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS status_effects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_id INTEGER,
            target_type TEXT CHECK(target_type IN ('adventurer', 'enemy')),
            effect_type TEXT,
            magnitude FLOAT,
            duration INTEGER
        )
    ''')

    # Skills Association Table (Many-to-Many)
    cur.execute('''
        CREATE TABLE IF NOT EXISTS adventurer_skills (
            adventurer_id INTEGER,
            skill_id INTEGER,
            slot_number INTEGER,
            current_cooldown INTEGER DEFAULT 0,
            PRIMARY KEY (adventurer_id, skill_id),
            FOREIGN KEY (adventurer_id) REFERENCES adventurers (id),
            FOREIGN KEY (skill_id) REFERENCES skills (id)
        )
    ''')

    #Battle Instance Table (Live Data for Combat)
    cur.execute('''
        CREATE TABLE IF NOT EXISTS combatants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            battle_id INTEGER DEFAULT 1,
            unit_type TEXT CHECK(unit_type IN ('adventurer', 'enemy')),
            unit_id INTEGER,
            current_hp INTEGER,
            max_hp INTEGER,
            current_energy INTEGER DEFAULT 0,
            readiness FLOAT DEFAULT 0,
            position INTEGER,
            is_dead BOOLEAN DEFAULT 0
        )
    ''')

    #Battle Logs Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS battle_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        battle_id INTEGER,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    #Encounters Table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location_id INTEGER,
        total_waves INTEGER DEFAULT 1,
        min_level INTEGER DEFAULT 1,
        reward_multiplier FLOAT DEFAULT 1.0
        )
    ''')

    #Encounter Waves (Bridging)
    cur.execute('''
        CREATE TABLE IF NOT EXISTS encounter_waves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER,
        wave_number INTEGER,
        enemy_template_id INTEGER,
        enemy_count INTEGER,
        FOREIGN KEY (encounter_id) REFERENCES encounters(id),
        FOREIGN KEY (enemy_template_id) REFERENCES enemies(id)
        )
    ''')

    # Seeding functions
    def seed_classes(cur):
        # Tier 1 Bases
        classes_t1 = [
            ("Knight", 1, 120, 15, 8, 5, 12, 5, 90.0, 15, 3, 1, 1, 2, 1, 0.5, 50, None),
            ("Mage", 1, 80, 5, 10, 18, 15, 8, 105.0, 8, 1, 2, 4, 3, 2, 1.2, 75, None),
            ("Rogue", 1, 100, 10, 15, 8, 8, 15, 120.0, 10, 2, 3, 2, 1, 4, 2.5, 60, None)
        ]
        
        for c in classes_t1:
            cur.execute('''INSERT INTO classes (class_name, tier, base_hp, base_str, base_dex, 
                        base_int, base_will, base_luck, base_speed, hp_growth, str_growth, 
                        dex_growth, int_growth, will_growth, luck_growth, speed_growth, 
                        recruitment_cost, parent_class_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', c)
        
        # Tier 2 Promotions (Assuming Knight is ID 1, Mage is ID 2, Rogue is ID 3)
        classes_t2 = [
            ("Paladin", 2, 200, 22, 10, 12, 20, 10, 95.0, 25, 4, 1, 2, 3, 2, 0.7, 500, 1),
            ("Archmage", 2, 140, 8, 12, 35, 25, 12, 110.0, 12, 1, 2, 6, 5, 3, 1.5, 750, 2),
            ("Assassin", 2, 160, 18, 25, 10, 12, 25, 140.0, 15, 3, 5, 2, 2, 5, 3.5, 600, 3)
        ]
        
        for c in classes_t2:
            cur.execute('''INSERT INTO classes (class_name, tier, base_hp, base_str, base_dex, 
                        base_int, base_will, base_luck, base_speed, hp_growth, str_growth, 
                        dex_growth, int_growth, will_growth, luck_growth, speed_growth, 
                        recruitment_cost, parent_class_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', c)
    
    def seed_enemies(cur):
        # (Name, Level, HP, STR, DEX, INT, WILL, LUCK, SPD, XP, Gold, Rank, Location, Min_Lvl)
        enemies = [
            # Grasslands (Loc 1)
            ("Slime", 1, 30, 5, 5, 2, 2, 10, 90, 25, 10, 1, 1, 1),
            ("Wolf", 1, 50, 9, 12, 2, 4, 5, 115, 55, 30, 1, 1, 2),
            ("Bandit Leader", 1, 150, 20, 15, 8, 10, 12, 100, 250, 500, 3, 1, 4), # Rank 3 (Boss)
            
            # Cave (Loc 2)
            ("Cave Bat", 1, 25, 8, 18, 4, 4, 8, 130, 40, 15, 1, 2, 2),
            ("Goblin Warrior", 1, 100, 10, 12, 5, 8, 6, 105, 80, 45, 1, 2, 3),
            ("Stone Golem", 1, 200, 25, 5, 2, 20, 2, 60, 150, 250, 2, 2, 6), # Rank 2 (Elite)

            # Special
            ("Leprechaun", 1, 1, 1, 1, 1, 1, 1, 400, 7777, 7777, 4, 1, 1)
        ]
        cur.executemany('''INSERT INTO enemies (name, level, max_hp, str, dex, int, will, luck, speed, 
                        xp_reward, gold_reward, rank, location_id, min_level) 
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', enemies)
    
    def seed_skills(cur):
    # (Name, Desc, Mult, CD, Energy, Effect, Target, Req_Lvl, Req_Tier, Class_id)
        skills = [
            ("Shield Bash", "Physical strike + high threat", 1.3, 3, 15, "damage", "single", 1, 1, 1),
            ("Magic Missile", "Guaranteed arcane hit", 1.5, 2, 20, "damage", "single", 1, 1, 2),
            ("Quick Slash", "Two fast hits", 0.8, 1, 10, "damage", "single", 1, 1, 3),
            # Tier 2 Skills
            ("Holy Wrath", "Massive AOE damage", 2.5, 6, 50, "damage", "all", 10, 2, 4) # Paladin
        ]
        cur.executemany('''INSERT INTO skills (name, description, base_multiplier, cooldown_turns, 
                        energy_gain, effect_type, target_type, required_level, required_tier, 
                        class_id) VALUES (?,?,?,?,?,?,?,?,?,?)''', skills)

    def seed_encounters(cur):
        # 1. The Encounter (Mission Header)
        # Name, Location_id (1=Grasslands), Total_waves, Min_level, Reward_mult
        encounters = [
            ("Grassland Patrol", 1, 3, 1, 1.0),
            ("The Bandit Fortress", 1, 3, 5, 1.5)
        ]
        cur.executemany('''INSERT INTO encounters (name, location_id, total_waves, 
                        min_level, reward_multiplier) VALUES (?,?,?,?,?)''', encounters)
        
        # 2. The Waves (The actual enemies)
        # encounter_id, wave_number, enemy_template_id, enemy_count
        waves = [
            # Mission 1 (ID 1): 2 Waves
            (1, 1, 1, 2), # Wave 1: 2 Slimes
            (1, 2, 2, 1), # Wave 2: 1 Wolf
            (1, 3, 7, 3), # Wave 3: 3 Leprechauns
            
            # Mission 2 (ID 2): 3 Waves
            (2, 1, 2, 2), # Wave 1: 2 Wolves
            (2, 2, 2, 3), # Wave 2: 3 Wolves (Aggressive!)
            (2, 3, 3, 1)  # Wave 3: 1 Bandit Leader (Boss)
        ]
        cur.executemany('''INSERT INTO encounter_waves (encounter_id, wave_number, 
                        enemy_template_id, enemy_count) VALUES (?,?,?,?)''', waves)

    # Seed initial data
    cur.execute('SELECT count(*) FROM users')
    if cur.fetchone()[0] == 0:
        cur.execute('INSERT INTO users (username, gold) VALUES (?, ?)', ("Player", 500))
        user_id = cur.lastrowid
        seed_classes(cur)
        seed_enemies(cur)
        seed_skills(cur)
        seed_encounters(cur)
        print("World Data Seeded: Classes (T1/T2), Enemies (Common/Boss), and Basic Skills.")
    
    con.commit()
    con.close()
    print("Database initialization and seeding completed.")

if __name__ == "__main__":
    init_db()
