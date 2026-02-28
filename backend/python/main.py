from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'game.db')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_con():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

@app.get("/")
def read_root():
    return{"status": "Server Online"}

@app.get("/player/roster")
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
            "username": user_row['username'],
            "total_gold": user_row['gold'],
            "adventurers": [dict(row) for row in adventurer_rows]
        }
    except sqlite3.OperationError as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    finally:
        con.close()

    return roster


