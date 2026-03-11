import { useState, useEffect } from 'react'
import Roster from '../components/guild/Roster'
import Tavern from '../components/tavern/Tavern'

function TownView( {rosterData, refreshData} ) {
    const [activeTab, setTab] = useState('map')
    const [tavern, setTavern] = useState('tavern')

    return (
        <div className='flex-column p-2'>
            {activeTab === 'map' && (
                <div>
                    <button onClick={() => setTab('guild')} className='btn btn-xl btn-primary w-48 h-32 text-xl'>
                        Guild Hall
                    </button>
                    <button onClick={() => setTab('tavern')} className='btn btn-xl btn-primary w-47 h-32 text-xl'>
                        Tavern
                    </button>
                </div>
            )}
            {activeTab === 'guild' && (
                <div>
                    { rosterData ? <Roster adventurers={rosterData.adventurers} refreshData = {refreshData} /> : <p>Loading...</p> }
                </div>
            )}
            {activeTab === 'tavern' && (
                <div>
                    {tavern ? <Tavern refreshData={refreshData} /> : <p>Loading...</p>}
                </div>
            )}
            {activeTab !== 'map' && (
                <button onClick={() => setTab('map')} className='btn btn-lg btn-secondary'>Back to Town</button>
            )}
        </div>
    )
}
export default TownView