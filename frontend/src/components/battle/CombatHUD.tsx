import SkillTray from "./SkillTray"

function CombatHUD( {activeAdventurer, onUseSkill, onAttack, party, targetId} ) {
    return (
        <div className="relative flex h-full w-full">
            <div className="flex grid grid-cols-2 text-sm">
                {party.map(hero => (
                    <div key={hero.id} 
                    className={`w-40 h-fill shadow-xl rounded-xl scale-75 px-5 py-1 m-0
                    ${hero.id === activeAdventurer?.id ? 'ring-4 ring-blue-500' : ''}
                    ${targetId === hero.id ? 'ring-4 ring-red-500' : ''}
                    ${hero.is_dead ? 'grayscale' : ''}`}>
                        <div className="card-body m-0 p-0">
                            <p className="font-bold">{hero.name}</p>
                            <p className="text-xs">Level {hero.level}</p>
                            <div className="text-xs">
                                <progress className="progress progress-success h-2 w-full"
                                value={hero.current_hp} max={hero.max_hp} />
                                <p>{hero.current_hp} / {hero.max_hp}</p>
                            </div>
                            <div className="flex items-center gap-1 w-full">
                                <span>CR</span>
                                <progress className={`progress progress-info h-1 w-full ${hero.readiness >= 100 ? 'progress-warning' : ''}`}
                                value={hero.readiness} max={100} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-full w-1/3 border-l border-base-100">
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