function SkillTray( {activeAdventurer, onUseSkill, onAttack, targetId} ) {
    return (
        <div className="flex flex-col relative h-full w-full items-center gap-4 bg-base-300 p-4 rounded-t-2xl border-t border-primary/30">
            <div className="flex gap-2">
                {[1, 2, 3].map(slot => (
                <button key={slot} className="btn btn-square btn-outline btn-secondary"
                /*disabled={activeAdventurer[`skill_${slot}_cd`] > 0}*/>
                    S{/*slot*/}
                </button>
                ))}
            </div>
        
            <button onClick={ () => onAttack(targetId, activeAdventurer.id) }
            disabled={!activeAdventurer || !targetId}
            className={`btn btn-primary btn-wide btn-lg shadow-lg shadow-primary/40 ${!activeAdventurer || !targetId ? 'opacity-50' : 'animate-pulse'}`}>
                ATTACK
            </button>
        </div>
    )
}
export default SkillTray