function BattleResults( {endBattle, resultOfBattle, combatants} ) {
    return (
        <div className="relative h-full w-full border border-white rounded-xl justify-items-center">
            <div className="flex flex-col h-fit w-fit justify-center items-center border border-white rounded-xl px-5 pb-5 gap-5">
                <h2 className="text-lg border-x-2 border-b-2 border-white rounded-b-xl p-2 font-bold">Battle Results</h2>
                <h1 className={`p-4 text-5xl ${resultOfBattle === 'Victory!' ? 'text-green-500' : 'text-red-500'}`}>{resultOfBattle}</h1>
                <div className="flex flex-wrap gap-5 justify-center">
                    {combatants.filter(c => c.unit_type === 'adventurer').map(hero => (
                        <div key={hero.id} className="rounded-xl border border-white p-5">
                            <p className="font-bold">{hero.name}</p>
                            <progress 
                                className={`progress w-full ${hero.current_hp > 0 ? 'progress-success' : 'progress-error'}`} 
                                value={hero.current_hp} 
                                max={hero.max_hp} 
                            />
                            <p className="text-xs mt-1">{hero.current_hp} / {hero.max_hp} HP</p>
                        </div>
                    ))}
                </div>
                <button className="btn btn-success text-2xl w-fit h-fit p-2" onClick={() => endBattle()}>
                    Return to Town
                </button>
            </div>
        </div>
    )
}
export default BattleResults