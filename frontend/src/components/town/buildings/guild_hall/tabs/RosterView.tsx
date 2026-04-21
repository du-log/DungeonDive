import { useState } from "react"
import { Star } from "lucide-react"
import StatsView from "./roster_tabs/StatsView"

function RosterView( {advData} ) {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [cardTab, setCardTab] = useState<string>('stats')
    const selectedAdv = advData.find(h => h.id === selectedId)

    return (
        <div className="flex flex-row gap-2 h-[calc(80vh)]">
            <div className="flex-1 space-y-2 pr-2 border-r-5 border-base-300 overflow-y-auto">
                {advData.map(hero => (
                    <div key={hero.id}
                    onClick={() => setSelectedId(hero.id)}
                    className={`flex bg-base-200 shadow-sm cursor-pointer border-2 rounded transition-all
                    ${selectedId === hero.id ? 'border-yellow-500' : 'border-gray-500'}`}>
                        <div className="flex p-2 gap-5 items-center text-sm">
                            <h2 className="font-bold">{hero.name}</h2>
                            <p className="">Lvl {hero.level} {hero.class_name} </p>
                            {hero.current_hp < hero.max_hp && (
                                    <div className="badge bg-orange-700 badge-xs mx-5 p-2 font-bold">Injured!</div>
                                )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-2 flex flex-col h-full bg-base-100 rounded-box py-3 shadow-inner">
                {selectedAdv ? (
                    <div className="flex flex-col h-full text-lg">
                        <div className="grid grid-cols-2 pb-2 justify-center border-b-3 border-base-300 text-xl">
                            <div className="flex flex-col col-1 items-center gap-1">
                                <h1>Name: {selectedAdv.name}</h1>
                                <p>Class: {selectedAdv.class_name}</p>
                                {selectedAdv.tier === 1 && <div className="flex items-center gap-1"><p>Tier:</p> <Star size={20}/></div>}
                                {selectedAdv.tier === 2 && <div className="flex gap-1"><p>Tier:</p> <div className="flex items-center gap-1"><Star size={20}/> <Star size={20}/></div> </div>}
                                {selectedAdv.tier === 3 && <div className="flex gap-1"> <p>Tier:</p> <div className="flex items-center gap-1"><Star size={20}/> <Star size={20}/> <Star size={20}/></div> </div>}
                            </div>
                            <div className="flex flex-col col-2 items-center">
                                <div className="badge badge-primary badge-xl">Level: {selectedAdv.level}</div>
                                <p>HP: {selectedAdv.current_hp} / {selectedAdv.max_hp}</p>
                                <p>XP: {selectedAdv.experience} / {selectedAdv.required_experience}</p>
                            </div>
                        </div>
                        <div className="tabs tabs-lift tabs-xl flex py-2">
                            <a className={`tab flex-1 ${cardTab === 'stats' ? 'tab-active' : ''}`}
                            onClick={() => setCardTab('stats')}>Stats</a>
                            <a className={`tab flex-1 ${cardTab === 'equip' ? 'tab-active' : ''}`}
                            onClick={() => setCardTab('equip')}>Equipment</a>
                            <a className={`tab flex-1 ${cardTab === 'skills' ? 'tab-active' : ''}`}
                            onClick={() => setCardTab('skills')}>Skills</a>
                        </div>
                        <div className="flex flex-grow">
                            {cardTab === 'stats' && <StatsView selectedAdv={selectedAdv} />}
                            {cardTab === 'equip'}
                            {cardTab === 'skills'}
                        </div>
                        <div className="flex gap-1 justify-center py-2 border-t-3 border-base-300 mt-auto">
                            <button className="btn btn-lg rounded-lg">Retire</button>
                            <button className="btn btn-lg rounded-lg">Options</button>
                            <button className="btn btn-lg rounded-lg">Promote</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full justify-center">
                        <p className="text-xl">Select an adventurer to view details.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default RosterView