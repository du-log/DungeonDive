import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './components/layout/NavBar'
import TownView from './views/TownView'
import DungeonView from './views/DungeonView'

function App() {
  const [view, setView] = useState('town')
  const [info, setInfo] = useState<any>(null)
  const [roster, setRoster] = useState<any>(null)

  const fetchAllData = async() => {
    const infoRes = await fetch('http://127.0.0.1:8000/user/info')
    setInfo(await infoRes.json())

    const rosterRes = await fetch('http://127.0.0.1:8000/player/roster')
    setRoster(await rosterRes.json())
  }

  useEffect(() => {
    fetchAllData()
  },[])

  return (
    <div className="bg-base-200">
      <NavBar view={view} setView={setView} gold={info?.gold || 0} username={info?.username || 'Player'} />
      <main>
        {view === 'town' && <TownView rosterData={roster} refreshData={fetchAllData} />}
        {view === 'dungeon' && <DungeonView />}
      </main>
    </div>
  )
}

export default App
