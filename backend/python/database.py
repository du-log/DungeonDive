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
            gold INTEGER DEFAULT 100
        )
    ''')

    # Create Adventurer Table (One-to-Many)
    cur.execute('''
        CREATE TABLE IF NOT EXISTS adventurers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            experience INTEGER DEFAULT 0,
            class TEXT NOT NULL,
            tier INTEGER DEFAULT 1,
            current_hp INTEGER DEFAULT 100,
            max_hp INTEGER DEFAULT 100,
            str INTEGER DEFAULT 10,
            dex INTEGER DEFAULT 10,
            int INTEGER DEFAULT 10,
            will INTEGER DEFAULT 10,
            luck INTEGER DEFAULT 10,
            speed INTEGER DEFAULT 100,
            stat_points INTEGER DEFAULT 0,
            skill_points INTEGER DEFAULT 0,
            in_party BOOLEAN DEFAULT FALSE,
            in_combat_party BOOLEAN DEFAULT FALSE,
            current_energy INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
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
            xp_reward INTEGER DEFAULT 50
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
            target_type TEXT CHECK(target_type IN ('single', 'all', 'self'))
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

    # Seed initial data
    cur.execute('SELECT count(*) FROM users')
    if cur.fetchone()[0] == 0:
        cur.execute('INSERT INTO users (username, gold) VALUES (?, ?)', ("Player", 500))
        user_id = cur.lastrowid
        #cur.execute('INSERT INTO adventurers (user_id, name, class) VALUES (?, ?, ?)', (user_id, "John", "Warrior"))
        #cur.execute('INSERT INTO adventurers (user_id, name, class) VALUES (?, ?, ?)', (user_id, "Mary", "Mage"))
        cur.execute('INSERT INTO enemies (name, max_hp, str) VALUES (?, ?, ?)', ("Goblin", 50, 8))
        cur.execute('INSERT INTO enemies (name, max_hp, str) VALUES (?, ?, ?)', ("Orc", 100, 12))
        cur.execute('INSERT INTO enemies (name, max_hp, str) VALUES (?, ?, ?)', ("Troll", 150, 15))
        cur.execute('INSERT INTO skills (name, description, base_multiplier, cooldown_turns, energy_gain, effect_type, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                    ("Power Strike", "A strong attack that deals extra damage.", 1.5, 3, 20, "damage", "single"))
    
    con.commit()
    con.close()
    print("DB initialized and seeded")

if __name__ == "__main__":
    init_db()
