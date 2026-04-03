import {useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

function NavBar({ view, infoDataGold, infoDataUsername, partyData }) {

    const partySize = partyData.length

    return(
        <nav className='navbar relative h-full w-full bg-base-300 items-center justify-center gap-[10vw] border-b pl-[1vw] pr-[1vw]'>
            <div className='flex flex-col flex-start relative h-fit w-[1/3] justify-center'>
                <span className='relative text-3xl font-bold'>DUNGEON DIVE</span>
            </div>
            <div className='flex flex-grow relative h-fit w-[1/3] items-center justify-center badge badge-primary p-2 text-xl'>
                {view === 'town' && `In Town`}
                {view === 'dungeon' && `In Dungeon`}
                {view === 'battle' && `In Battle`}
                {view === 'battle-setup' && `Setting Up`}
                {view === 'results' && `Battle Results`}
            </div>
            <div className='flex flex-end relative h-fit w-[1/3] items-center justify-center p-1 gap-[2vw]'>
                <div className='badge badge-warning p-5 relative w-fit'>
                    <Coins size={20}/>
                    <p className='w-full text-xl justify-items-center'>{infoDataGold}</p>
                </div>
                <div className='badge p-5 text-xl'>
                    {infoDataUsername}
                </div>
            </div>
        </nav>
    )
}

export default NavBar