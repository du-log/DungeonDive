import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './components/layout/NavBar'
import TownView from './views/TownView'
import DungeonView from './views/DungeonView'
import BattleView from './views/BattleView'
import CombatPartySetup from './components/combat_party/CombatPartySetup'

function App() {
  const [view, setView] = useState('town')
  const [infoData, setInfo] = useState<any>(null)
  const [rosterData, setRoster] = useState<any>(null)
  const [battleCombatants, setBattleCombatants] = useState<any[]>([])

  const partyData = rosterData ? rosterData.adventurers.filter((adv) => adv.in_party).map((adv) => adv.id) : []
  const combatPartyData = rosterData ? rosterData.adventurers.filter((adv) => adv.in_combat_party).map((adv) => adv.id) : []

  const fetchAllData = async() => {
    const infoRes = await fetch('http://127.0.0.1:8000/user/info')
    setInfo(await infoRes.json())

    const rosterRes = await fetch('http://127.0.0.1:8000/adventurer/roster')
    setRoster(await rosterRes.json())
  }

  const togglePartyMember = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/adventurer/toggle/party/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await res.json()
      await fetchAllData()
    } catch (error) {
      console.error('Error toggling party member:', error)
    }
  }

  const toggleCombatMember = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/adventurer/toggle/combat_party/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await res.json()
      await fetchAllData()
    } catch (error) {
      console.error('Error toggling combat party member:', error)
    }
  }

  const handleStartBattle = async() => {
    const res = await fetch('http://127.0.0.1:8000/battle/start', {
      method: 'POST'
    })
    if (res.ok) {
      await fetchBattleData()
      setView('battle')
    }
  }

  const fetchBattleData = async () => {
    const res = await fetch('http://127.0.0.1:8000/battle/combatants')
    const data = await res.json()
    setBattleCombatants(data.combatants)
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  if(!infoData || !rosterData) return (
    <div>
      <h1 className='text-xl border p-20 alert alert-error justify-center'>Server Offline</h1>
    </div>
  )

  return (
    
    <div className="flex flex-col bg-base-200 h-screen w-full overflow-hidden">
      <header className='flex-start relative h-fit'>
        <NavBar
        view={view}
        infoDataGold={infoData?.gold || 0}
        infoDataUsername={infoData?.username || 'Player'}
        partyData={partyData} 
        />
      </header>
      <main className='flex-grow relative overflow-hidden h-full'>
          {view === 'town' && 
        <TownView 
        rosterData={rosterData}
        refreshData={fetchAllData}
        partyData={partyData}
        togglePartyMember={togglePartyMember} 
        setView={setView}
        />}

        {view === 'dungeon' && 
        <DungeonView
        partyData={partyData}
        rosterData={rosterData}
        refreshData={fetchAllData}
        setView={setView}
        />}

        {view === 'battle-setup' &&
        <CombatPartySetup 
        setView={setView}
        rosterData={rosterData.adventurers}
        combatPartyData={combatPartyData}
        toggleCombatMember={toggleCombatMember}
        handleStartBattle={handleStartBattle}
        />}

        {view === 'battle' && 
        <BattleView
        setView={setView}
        combatants={battleCombatants}
        activeUnitId={battleCombatants.find(c => c.readiness >= 100)?.id || null}
        />}
      </main>
      <footer className='flex-end relative h-fit border-t'>
        <p className='text-xs'>Dungeon Dive &copy; 2026</p>
        <p className='text-xs'>Made with ❤️ by Brandon Dulog</p>
      </footer>
    </div>
  )
}

export default App
