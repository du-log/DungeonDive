import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './components/layout/NavBar'
import TownView from './views/TownView'
import DungeonView from './views/DungeonView'
import BattleView from './views/BattleView'
import CombatPartySetup from './components/combat_party/CombatPartySetup'
import BattleResults from './components/battle/BattleResults'
import TownViewV2 from './components/town/TownViewV2'
import GuildHallV2 from './components/town/buildings/guild_hall/GuildHallV2'

function App() {
  const [view, setView] = useState('town')
  const [infoData, setInfo] = useState<any>(null)
  const [rosterData, setRoster] = useState<any>(null)
  const [battleCombatants, setBattleCombatants] = useState<any[]>([])
  const [activeBattleId, setActiveBattleId] = useState<number | null>(null)
  const [activeUnitId, setActiveUnitId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [battleOver, setBattleOver] = useState(false)
  const [resultOfBattle, setResultOfBattle] = useState<string | null>(null)
  const [endRewards, setEndRewards] = useState<any>(null)

  const partyData = rosterData ? rosterData.adventurers.filter((adv) => adv.in_party).map((adv) => adv.id) : []
  const combatPartyData = rosterData ? rosterData.adventurers.filter((adv) => adv.in_combat_party).map((adv) => adv.id) : []

  const [battleLogs, setBattleLogs] = useState<string[]>([])

  const viewInDb = async (viewSet: any) => {
    const res = await fetch(`http://127.0.0.1:8000/user/view/${viewSet}`, {
      method: 'POST'
    })
    if (res.ok) {
      console.log("DB View: " + viewSet + "Current View: " + view)
    }
  }

  const fetchLogs = async () => {
    const res = await fetch('http://127.0.0.1:8000/battle/logs')
    const data = await res.json()
    setBattleLogs(data.logs.map((l: any) => l.message))
  }

  const fetchAllData = async() => {
    const infoRes = await fetch('http://127.0.0.1:8000/user/info')
    setInfo(await infoRes.json())

    const rosterRes = await fetch('http://127.0.0.1:8000/adventurer/roster')
    setRoster(await rosterRes.json())

    const combatRes = await fetch('http://127.0.0.1:8000/battle/combatants')
    const combatData = await combatRes.json()

    if (combatData.combatants && combatData.combatants.length > 0) {
      setBattleCombatants(combatData.combatants)
      setActiveBattleId(combatData.combatants[0].battle_id)
    } else {
      setActiveBattleId(null)
    }
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

  const handleStartBattle = async (id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/battle/start/${id}`, {
      method: 'POST'
    })
    if (res.ok) {
      setBattleOver(false)
      await fetchBattleData()
      await fetchLogs()
      setView('battle')
      viewInDb('battle')
    }
  }

  const fetchBattleData = async () => {
    const res = await fetch('http://127.0.0.1:8000/battle/combatants')
    const data = await res.json()
    setBattleCombatants(data.combatants)
    return data.combatants
  }

  const handleBattleTick = async () => {
    if(battleOver) { 
      return 
    }
    const res = await fetch('http://127.0.0.1:8000/battle/turn-tick', {
      method: 'POST',
    })
    const data = await res.json()
    if(data.turn_ready) {
      setActiveUnitId(data.active_unit_id)

      if(data.unit_type === 'enemy') {
        const combatRes = await fetch('http://127.0.0.1:8000/battle/combatants')
        const combatData = await combatRes.json()

        const livingAdv = combatData.combatants.filter(c => c.unit_type === 'adventurer' && c.is_dead === 0)
        if (livingAdv.length > 0) {
          const randomIndex = Math.floor(Math.random() * livingAdv.length)

          const playerTarget = livingAdv[randomIndex]
          if(playerTarget) {
            setTargetId(playerTarget.id)
          }

          setTimeout(async () => {
            if(playerTarget) {
              executeAttack(playerTarget.id, data.active_unit_id)
            } else {
              console.log("No valid player targets found!")
              setActiveUnitId(null)
            }
          }, 1000)
        }
      }
    }
    await fetchBattleData()
  }

  const executeAttack = async (forcedTargetId?: number, forcedAttackerId?: number) => {
    const finalAttackerId = forcedAttackerId || activeUnitId
    const finalTargetId = forcedTargetId || targetId

    if(!finalAttackerId || !finalTargetId) return

    const res = await fetch(`http://127.0.0.1:8000/battle/attack-enemy?attacker_id=${finalAttackerId}&target_id=${finalTargetId}`, {
      method: 'POST'
    })

    if (res.ok) {
      const fresh = await fetchBattleData()
      fetchLogs()
      setActiveUnitId(null)
      setTargetId(null)
      
      checkBattleEnd(fresh)
    }
  }

  const checkBattleEnd = async (combatants: any[]) => {
    const aliveEnemies = combatants.filter(c => c.unit_type === 'enemy' && c.current_hp > 0)
    const aliveHeroes = combatants.filter(c => c.unit_type === 'adventurer' && c.current_hp > 0)

    if(aliveEnemies.length === 0) {
      const battleRes = await fetch('http://127.0.0.1:8000/battle/status')
      const battleData = await battleRes.json()
      if(battleData.is_final_wave) {
        setResultOfBattle('Victory!')
        setBattleOver(true)
        const f_rew = await fetch('http://127.0.0.1:8000/battle/next-wave', {
          method: 'POST'
        })
        const res = await fetch('http://127.0.0.1:8000/battle/process-rewards', {
          method: 'POST'
        })
        const data = await res.json()
        setEndRewards(data)

        setTimeout(() => {
          setView('results')
          viewInDb('results')
        }, 1500)
      } else {
        const nextWave = await fetch('http://127.0.0.1:8000/battle/next-wave', {
          method: 'POST'
        })
        if (nextWave.ok) {
          console.log("Successfully transitioned to next wave in encounter ID " + battleData.encounter_id + ".")
          fetchLogs()
        }
      }
    } else if (aliveHeroes.length === 0) {
      setResultOfBattle('Defeat...')
      setBattleOver(true)

      setTimeout(() => {
        setView('results')
        viewInDb('results')
      }, 1500)
    }
  }

  const fleeFromBattle = async () => {
    setBattleOver(true)
    setResultOfBattle('Defeat')
    setView('results')
    viewInDb('results')
  }

  const endBattle = async () => {
    await fetch('http://127.0.0.1:8000/battle/clear', { method: 'POST' })

    setResultOfBattle(null)
    setActiveBattleId(null)
    setActiveUnitId(null)
    setBattleCombatants([])
    setEndRewards(null)

    setView('town')
    viewInDb('town')
    await fetchAllData()
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    const sync = async () => {
      const res = await fetch('http://127.0.0.1:8000/user/info')
      const data = await res.json()
      if (data.current_view !== view) {
        setView(data.current_view)
      }
    }
    sync()
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
        setView={setView}
        />
      </header>
      <main className='relative overflow-hidden h-full'>
          {view === 'town' && 
        <TownView 
        rosterData={rosterData}
        refreshData={fetchAllData}
        partyData={partyData}
        togglePartyMember={togglePartyMember} 
        setView={setView}
        activeBattleId={activeBattleId}
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
        combatants={battleCombatants}
        activeUnitId={activeUnitId}
        targetId={targetId}
        setTargetId={setTargetId}
        handleBattleTick={handleBattleTick}
        battleLogs={battleLogs}
        executeAttack={executeAttack}
        endBattle={endBattle}
        fleeFromBattle={fleeFromBattle}
        />}

        {view === 'results' &&
        <BattleResults
        endBattle={endBattle}
        resultOfBattle={resultOfBattle}
        combatants={battleCombatants}
        endRewards={endRewards}
        />}

        {view === 'town2' &&
        <TownViewV2
        setView={setView}
        />}

        {view === 'guildhall' &&
        <GuildHallV2
        setView={setView}
        rosterData={rosterData} />}

        {view === 'infirmary'}

        {view === 'tavern'}

        {view === 'market'}

        {view ==='dungeonlobby'}
      </main>
      <footer className='flex-end relative h-fit border-t'>
        <p className='text-xs'>Dungeon Dive &copy; 2026</p>
        <p className='text-xs'>Made with ❤️ by Brandon Dulog</p>
      </footer>
    </div>
  )
}

export default App
