import { useState, useEffect } from 'react'
import GuildHall from '../components/guild/GuildHall'
import Tavern from '../components/tavern/Tavern'

import { Castle, Beer, Hospital, Swords } from 'lucide-react'
import Infirmary from '../components/infirmary/Infirmary'

function TownView( {rosterData, refreshData, partyData, togglePartyMember, setView} ) {
    const [activeTab, setTab] = useState('map')
    const [activeSubTab, setSubTab] = useState<boolean | null>(false)

    return (
        <div className='p-10 relative w-full h-full flex flex-col items-center justify-center gap-10'>
            {activeTab === 'map' && (
                <div className='relative flex flex-col items-center gap-20 p-10 m-10 w-150 border-4 rounded-4xl'>
                    <button onClick={() => setTab('guild')} className='btn btn-xl btn-primary w-fit h-fit text-xl p-2'>
                        <Castle size={40} />
                        Guild Hall
                    </button>
                    <button onClick={() => setTab('tavern')} className='btn btn-xl btn-primary w-fit h-fit text-xl p-2'>
                        <Beer size={40} />
                        Tavern
                    </button>
                    <button onClick={() => setTab('infirmary')} className='btn btn-xl btn-primary w-fit h-fit text-xl p-2'>
                        <Hospital size={40} />
                        Infirmary
                    </button>
                    <button onClick={() => setView('dungeon')}
                    className={`btn btn-xl w-fit h-fit text-xl p-2 ${partyData.length === 0 ? 'btn-disabled' : 'btn-error'}`}>
                        <Swords size={40} />
                        Enter Dungeon
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
                    setSubTab={setSubTab}
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
            {activeTab === 'infirmary' && (
                <div>

                    {rosterData ? 
                    <Infirmary 
                    rosterData={rosterData}
                    refreshData={refreshData} 
                    /> : <p>Loading...</p>}

                </div>
            )}
            {activeTab !== 'map' && !activeSubTab && (
                <button onClick={() => setTab('map')} className='btn btn-lg btn-secondary'>Back to Town</button>
            )}
        </div>
    )
}
export default TownView