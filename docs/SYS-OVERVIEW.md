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

## App Root
1. Provides state management for Town and Dungeon states/views.
2. Provides partyData state for when initializing Dungeon state. Is passed into Town and Dungeon states.
3. Provides rosterData and infoData states that are passed into Town state.
4. Provides constants for updating data. Has useEffect to update all data using fetchAllData function when first initializing the application.
 - updateGold is passed into Dungeon state to update gold amount whenever associated event is ticked.
 - fetchAllData is passed into Town state for when we recruit/retire adventurers and need to update roster and associated user info.

## Flow for Town State
1. Main Town state, navigation bar with multiple buttons
2. Navigation Ideas: Guild, Tavern, Dungeon, Storage
3. Guild hosts the views regarding overall roster, adventurer information
4. Tavern provides way to recruit new adventurers
5. Possible option to gain new adventurer from two "parent" adventurers
6. Dungeon leads to a menu to choose team of up to five adventurers, then an option to return to town or dive (start) into dungeon.
### Current Flow
1. Takes in fetchAllData for data updating, rosterData to get roster, partyData hold list of ad_id in party, togglePartyMember to add/remove adventurers (associated IDs, rather) to party_ids list.
2. Contains a activeTab state for which part of "Town" we are in. Starts at 'map', can be set to 'guild' or 'tavern'.
 - 'map' provides buttons to navigate to 'guild' tab or 'tavern' tab
 - 'guild' tab enables a nested Guild view that contains a button to enable 'roster' state that displays a grid list of AdventurerCard objects. Each card shows information of an adventurer and has buttons to manage (not enabled), retire, or add/remove from party.
 - 'tavern' tab enables a nested Tavern view that contains a button to 'recruit' adventurers for 100 Gold.

## Flow for Dungeon Diving State
1. Options for allocating skill points and stat points, changing equipment, beginning battle states
2. Allocating lets you choose an adventurer in current team, then brings up respective menus
3. Equipment changing is equivalent to allocating
4. Battle states: 10 Stages per Dungeon Level, Stages 1-4 are auto-battle, Stage 5 is a Rest giving the usual options, Stage 6-9 are auto-battle, Stage 10 is boss, possibly auto-battle or dictated on stats.

### Current Flow
1. Button that allows dungeon ticks to start running based on an interval of 3 seconds.
2. Each interval sends a POST request to /dungeon/tick with a list of party IDs, and each tick determines an event.
3. Button can be clicked to pause/end the requests.