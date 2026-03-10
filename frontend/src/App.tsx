import { useState, useEffect } from 'react'
import './App.css'
import { Coins, UserCircle } from 'lucide-react'

function App() {
  const [data, setData] = useState<any>(null)
  
  const recruit = async () => {
    const response = await fetch('http://127.0.0.1:8000/adventurer/recruit', {
      method: 'POST',
    })
    if (response.ok) {
      const updatedData = await fetch('http://127.0.0.1:8000/player/roster').then(res => res.json())
      setData(updatedData)
    } else {
      const err = await response.json()
      alert(err.detail)
    }
  }

  const addGold = async () => {
    const response = await fetch('http://127.0.0.1:8000/user/add-gold', {
    method: 'POST',
  })
  if (response.ok) {
      setData((prevData: any) => ({
        ...prevData,
        total_gold: prevData.total_gold + 100
      }))
    } else {
      const err = await response.json()
      alert(err.detail)
    }
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/player/roster')
    .then(res => res.json())
    .then(data => setData(data))
  }, [])

  if (!data) return <div className='p-10'>Server Offline.</div>

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Management</h1>
        <div className='badge badge-warning gap-2 p-4 text-lg'>
          <Coins size={20} />
          {data.total_gold} Gold
        </div>
        <button className='btn btn-primary btn-sm' onClick={recruit}>Recruit (1000G)</button>
        <button className='btn btn-sm' onClick={addGold}>Add Gold(100G)</button>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {data.adventurers.map((adv:any)=>(
          <div key={adv.id} className='card bg-base-200 shadow-xl'>
            <div className='card-body'>
              <div>
                <UserCircle size={32}/>
                <h2 className='card-title'>{adv.name}</h2>
                <h2 className='card-title'>Class: {adv.class}</h2>
              </div>
              <p>Level: {adv.level}</p>
              <progress className='progress progress-error w-full' value={adv.current_hp} max={adv.max_hp} />
              <div className='card-actions justify-start mt-4'>
                <button className='btn btn-primary btn-sm'>Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
