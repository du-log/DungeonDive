import CombatSetupCard from "./CombatSetupCard"

function CombatPartySetup( {setView, rosterData, combatPartyData, toggleCombatMember, handleStartBattle} ) {
    const squadCount = combatPartyData.length

    return (
        <div className="relative flex flex-col h-full w-full gap-5 p-5 justify-center items-center">
            <h2 className="text-2xl font-bold text-center">Form Combat Party</h2>
            <div className="overflow-y-auto flex-grow w-fit grid grid-cols-4 gap-5 p-5 border border-white rounded-xl justify-items-center">
                {rosterData.filter(adv => !adv.in_combat_party).map(adv => (
                    <CombatSetupCard key={adv.id} data={adv} toggleCombatMember={toggleCombatMember} isSelected={false} />
                ))}
            </div>
            <div>
                <h2>Current Party ({squadCount}/4)</h2>
                <div className="relative h-60 w-200 flex flex-end justify-center items-center gap-5 p-2 border border-white rounded-xl relative">
                    {rosterData.filter(adv => adv.in_combat_party).map(adv => (
                        <CombatSetupCard key={adv.id} data={adv} toggleCombatMember={toggleCombatMember} isSelected={true} />
                    ))}
                </div>
            </div>
            <button disabled={squadCount === 0} className="btn btn-primary h-fit text-2xl p-2" onClick={() => handleStartBattle()}>
                BEGIN ENCOUNTER
            </button>
            <button className="btn btn-secondary h-fit text-xl p-2" onClick={() => setView('town')}>
                Back
            </button>
        </div>
    )
}
export default CombatPartySetup