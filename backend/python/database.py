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
            current_hp INTEGER DEFAULT 100,
            max_hp INTEGER DEFAULT 100,
            str INTEGER DEFAULT 10,
            con INTEGER DEFAULT 10,
            int INTEGER DEFAULT 10,
            will INTEGER DEFAULT 10,
            luck INTEGER DEFAULT 10,
            in_party BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Seed initial data
    cur.execute('SELECT count(*) FROM users')
    if cur.fetchone()[0] == 0:
        cur.execute('INSERT INTO users (username, gold) VALUES (?, ?)', ("Player", 500))
        user_id = cur.lastrowid
        #cur.execute('INSERT INTO adventurers (user_id, name, class) VALUES (?, ?, ?)', (user_id, "John", "Warrior"))
        #cur.execute('INSERT INTO adventurers (user_id, name, class) VALUES (?, ?, ?)', (user_id, "Mary", "Mage"))
    
    con.commit()
    con.close()
    print("DB initialized and seeded")

if __name__ == "__main__":
    init_db()
