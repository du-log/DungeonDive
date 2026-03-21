import {useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

function NavBar({ view, infoDataGold, infoDataUsername, partyData }) {

    const partySize = partyData.length

    return(
        <nav className='navbar w-full bg-base-300 items-center justify-center gap-10 p-5'>
            <div className='flex-start'>
                <span className='text-3xl font-bold items-center justify-center'>DUNGEON DIVE</span>
            </div>
            <div className='flex flex-2 items-center badge badge-primary p-5 text-xl'>
                {view === 'town' && `In Town`}
                {view === 'dungeon' && `In Dungeon with ${partySize} adventurer${partySize !== 1 ? 's' : ''}`}
            </div>
            <div className='flex flex-end items-center gap-5'>
                <div className='badge badge-warning p-5 text-xl'>
                    <Coins size={20}/>
                    {infoDataGold} Gold
                </div>
                <div className='badge p-5 text-xl'>
                    {infoDataUsername}
                </div>
            </div>
        </nav>
    )
}

export default NavBar