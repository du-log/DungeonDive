This document outlines the architecture of Dungeon Dive.
## Architecture: Client Server (REST API)
- Frontend: React (Vite/SWC(SpeedyWebCompiler)), UI and State Management
- Backend: Python (FastAPI), game logic and RNG
- Database: SQLite, local persistence storage

## Libraries and Packages
- Lucide, icons
- TailwindCSS, styling
- DaisyUI, additional plugin for TailwindCSS

## Old Data Flow
1. Click "Enter Dungeon"
2. Send POST request to /dungeon/start
3. Python generates floor, saves to DB, returns floor data
4. React updates UI state with new floor

## Flow for Town State
1. Main Town state, navigation bar with multiple buttons
2. Navigation Ideas: Guild, Tavern, Dungeon, Storage
3. Guild hosts the views regarding overall roster, adventurer information
4. Tavern provides way to recruit new adventurers
5. Possible option to gain new adventurer from two "parent" adventurers
6. Dungeon leads to a menu to choose team of up to five adventurers, then an option to return to town or dive (start) into dungeon.

## Flow for Dungeon Diving State
1. Options for allocating skill points and stat points, changing equipment, beginning battle states
2. Allocating lets you choose an adventurer in current team, then brings up respective menus
3. Equipment changing is equivalent to allocating
4. Battle states: 10 Stages per Dungeon Level, Stages 1-4 are auto-battle, Stage 5 is a Rest giving the usual options, Stage 6-9 are auto-battle, Stage 10 is boss, possibly auto-battle or dictated on stats.