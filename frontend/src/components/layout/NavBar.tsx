import {useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

function NavBar({ view, setView, gold, username }) {

    return(
        <nav className='navbar bg-base-300 px-8'>
            <div className='flex-1'>
                <span className='text-xl'>DUNGEON DIVE</span>
            </div>

            <div className='flex px-8 gap-10'>
                <ul className='menu menu-horizontal gap-5'>
                    <li><button onClick={() => setView('town')} className='btn btn-md'>Town</button></li>
                    <li><button onClick={() => setView('dungeon')} className='btn btn-md'>Dungeon</button></li>
                </ul>

                <div className='flex items-center gap-5'>
                    <div className='badge badge-warning p-4 text-lg'>
                        <Coins size={20}/>
                    {gold} Gold
                    </div>
                    <div className='badge p-4 text-lg'>
                        {username}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar