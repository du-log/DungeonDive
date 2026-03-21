import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './components/layout/NavBar'
import TownView from './views/TownView'
import DungeonView from './views/DungeonView'

function App() {
  const [view, setView] = useState('town')
  const [infoData, setInfo] = useState<any>(null)
  const [rosterData, setRoster] = useState<any>(null)

  const [partyData, setParty] = useState<number[]>([])

  const togglePartyMember = (id: number) => {
    setParty(prev => {
      if (prev.includes(id)) {
        return prev.filter(memberId => memberId !== id) // if id matches, remove
      } else {
        return prev.length < 4 ? [...prev, id] : prev // if room in party, add
      }
    })
  }

  const fetchAllData = async() => {
    const infoRes = await fetch('http://127.0.0.1:8000/user/info')
    setInfo(await infoRes.json())

    const rosterRes = await fetch('http://127.0.0.1:8000/adventurer/roster')
    setRoster(await rosterRes.json())
  }

  const updateGold = async () => {
    const res = await fetch('http://127.0.0.1:8000/user/info')
    setInfo(await res.json())
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
    
    <div className="flex flex-col bg-base-200 min-h-dvh">
      <NavBar
      view={view}
      infoDataGold={infoData?.gold || 0}
      infoDataUsername={infoData?.username || 'Player'}
      partyData={partyData} 
      />
      <main className='flex-grow flex flex-col items-center justify-center p-5 border'>
        <div className='w-full max-w-6xl'>
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
        </div>
      </main>
    </div>
  )
}

export default App
