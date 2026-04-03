import SkillTray from "./SkillTray"

function CombatHUD( {activeAdventurer, onUseSkill, onAttack, party, targetId} ) {
    return (
        <div className="flex h-full w-full">
            <div className="flex-grow grid grid-cols-2 gap-2 p-2">
                {party.map(hero => (
                    <div key={hero.id} 
                    className={`p-2 w-40 h-40 border rounded-lg 
                    ${hero.id === activeAdventurer?.id ? 'border-primary' : 'border-base-100'}
                    ${hero.is_dead ? 'grayscale' : ''}`}>
                        <p>{hero.name}</p>
                        <progress className="progress progress-success h-2 w-full"
                        value={hero.current_hp} max={hero.max_hp} />
                        <progress className="progress progress-info h-1 w-full"
                        value={hero.readiness} max={100} />
                    </div>
                ))}
            </div>
            <div className="w-1/3 border-l border-base-100">
                <SkillTray 
                activeAdventurer={activeAdventurer}
                onUseSkill={onUseSkill}
                onAttack={onAttack}
                targetId={targetId} />
            </div>
        </div>
    )
}
export default CombatHUD