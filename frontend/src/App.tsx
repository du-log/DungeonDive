import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './components/layout/NavBar'
import TownView from './views/TownView'
import DungeonView from './views/DungeonView'

function App() {
  const [view, setView] = useState('town')
  const [infoData, setInfo] = useState<any>(null)
  const [rosterData, setRoster] = useState<any>(null)

  const partyData = rosterData ? rosterData.adventurers.filter((adv) => adv.in_party).map((adv) => adv.id) : []


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
