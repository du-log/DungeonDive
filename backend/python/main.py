from fastapi import FastAPI
from routes import adventurers, users, dungeon
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(adventurers.router)
app.include_router(users.router)
app.include_router(dungeon.router)

@app.get("/")
def read_root():
    return{"status": "Server Online"}
