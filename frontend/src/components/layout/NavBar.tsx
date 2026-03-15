import {useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

function NavBar({ view, setView, infoDataGold, infoDataUsername, partyData }) {

    const partySize = partyData.length

    return(
        <nav className='navbar bg-base-300 px-8'>
            <div className='flex-1'>
                <span className='text-xl'>DUNGEON DIVE</span>
            </div>

            <div className='flex px-8 gap-10'>
                <ul className='menu menu-horizontal gap-5'>
                    <li>
                        <button onClick={() => setView('town')} 
                        className={`btn btn-md ${view === 'town' ? 'btn-success' : ''}`}>
                            Town
                        </button>
                    </li>

                    <li>
                        <button onClick={() => setView('dungeon')}
                        className={`btn btn-md ${partySize === 0 ? 'btn-disabled' : ''}
                        ${view === 'dungeon' ? 'btn-success' : ''}`}
                        disabled={partySize === 0}>
                            Enter Dungeon {partySize}/4
                        </button>
                    </li>
                </ul>

                <div className='flex items-center gap-5'>
                    <div className='badge badge-warning p-4 text-lg'>
                        <Coins size={20}/>
                        {infoDataGold} Gold
                    </div>
                    <div className='badge p-4 text-lg'>
                        {infoDataUsername}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar