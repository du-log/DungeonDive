import CombatSetupCard from "./CombatSetupCard"

function CombatPartySetup( {setView, rosterData, combatPartyData, toggleCombatMember, handleStartBattle} ) {
    const squadCount = combatPartyData.length

    return (
        <div className="relative flex flex-col h-full w-full gap-1 p-5 justify-center items-center">
            <h2 className="text-2xl font-bold text-center">Form Combat Party</h2>
            <div className="overflow-y-scroll flex-grow w-full grid grid-cols-4 gap-5 p-5 border border-white rounded-xl justify-items-center">
                {rosterData.filter(adv => !adv.in_combat_party).map(adv => (
                    <CombatSetupCard key={adv.id} data={adv} toggleCombatMember={toggleCombatMember} isSelected={false} />
                ))}
            </div>
            <div>
                <h2>Current Party ({squadCount}/4)</h2>
                <div className="relative h-fit w-200 flex flex-end justify-center items-center gap-5 py-5 border border-primary rounded-xl relative">
                    {rosterData.filter(adv => adv.in_combat_party).map(adv => (
                        <CombatSetupCard key={adv.id} data={adv} toggleCombatMember={toggleCombatMember} isSelected={true} squadCount={squadCount} />
                    ))}
                    <div className={`{squadCount === 0 ? 'skeleton h-40 w-40' : ''}`} />
                </div>
            </div>
            <div className="flex gap-5 scale-80 justify-center items-center">
                <button disabled={squadCount === 0}
                className="btn btn-primary h-fit text-2xl py-2 px-4"
                onClick={() => handleStartBattle(1)}>
                    BEGIN ENCOUNTER (Easy)
                </button>
                <button disabled={squadCount === 0}
                className="btn btn-primary h-fit text-2xl py-2 px-4"
                onClick={() => handleStartBattle(2)}>
                    BEGIN ENCOUNTER (Hard)
                </button>
            </div>
            <button className="btn btn-secondary h-fit text-xl py-2 px-4 scale-80" onClick={() => setView('town')}>
                Back
            </button>
        </div>
    )
}
export default CombatPartySetup