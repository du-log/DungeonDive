import {useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

function NavBar({ view, infoDataGold, infoDataUsername, partyData }) {

    const partySize = partyData.length

    return(
        <nav className='navbar relative h-full w-full bg-base-300 items-center justify-center gap-[10vw] border-b pl-[1vw] pr-[1vw]'>
            <div className='flex flex-col flex-start relative h-full w-full justify-center'>
                <span className='relative text-3xl font-bold'>DUNGEON DIVE</span>
            </div>
            <div className='flex flex-grow relative h-fit w-full items-center justify-center badge badge-primary p-5 text-xl'>
                {view === 'town' && `In Town`}
                {view === 'dungeon' && `In Dungeon with ${partySize} adventurer${partySize !== 1 ? 's' : ''}`}
                {view === 'battle' && `In Battle`}
            </div>
            <div className='flex flex-end relative h-full w-full items-center justify-center gap-[2vw]'>
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