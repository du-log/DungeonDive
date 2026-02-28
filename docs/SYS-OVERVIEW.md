This document outlines the architecture of Dungeon Dive.
## Architecture: Client Server (REST API)
- Frontend: React (Vite/SWC(SpeedyWebCompiler)), UI and State Management
- Backend: Python (FastAPI), game logic and RNG
- Database: SQLite, local persistence storage

## Libraries and Packages
- Lucide, icons
- TailwindCSS, styling
- DaisyUI, additional plugin for TailwindCSS

## Data Flow
1. Click "Enter Dungeon"
2. Send POST request to /dungeon/start
3. Python generates floor, saves to DB, returns floor data
4. React updates UI state with new floor