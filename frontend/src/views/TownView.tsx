import { useState, useEffect } from 'react'
import GuildHall from '../components/guild/GuildHall'
import Tavern from '../components/tavern/Tavern'

import { Castle, Beer } from 'lucide-react'

function TownView( {rosterData, refreshData, partyData, togglePartyMember} ) {
    const [activeTab, setTab] = useState('map')

    return (
        <div className='p-10'>
            {activeTab === 'map' && (
                <div className='flex flex-col items-center gap-20 p-5'>
                    <button onClick={() => setTab('guild')} className='btn btn-xl btn-primary w-fit h-fit text-xl'>
                        <Castle size={40} />
                        Guild Hall
                    </button>
                    <button onClick={() => setTab('tavern')} className='btn btn-xl btn-primary w-fit h-fit text-xl'>
                        <Beer size={40} />
                        Tavern
                    </button>
                </div>
            )}
            {activeTab === 'guild' && (
                <div>

                    { rosterData ? 
                    <GuildHall
                    rosterData={rosterData}
                    refreshData = {refreshData}
                    partyData={partyData}
                    togglePartyMember={togglePartyMember} 
                    /> : <p>Loading...</p> }

                </div>
            )}
            {activeTab === 'tavern' && (
                <div>

                    {rosterData ? 
                    <Tavern 
                    refreshData={refreshData} 
                    /> : <p>Loading...</p>}

                </div>
            )}
            {activeTab !== 'map' && (
                <button onClick={() => setTab('map')} className='btn btn-lg btn-secondary'>Back to Town</button>
            )}
        </div>
    )
}
export default TownView