function EnemyCard( {enemy, isTargeted, onSelect}  ) {
    return (
        <div className="relative md:scale-70 h-full w-full">
            <div onClick={ () => !enemy.is_dead && onSelect(enemy.id) }
                className={`card bg-base-100 shadow-xl w-60 h-full cursor-pointer ${isTargeted ? 'ring-4 ring-red-500' : ''}
                ${enemy.is_dead ? 'grayscale' : ''}`}>
                <div className="card-body">
                    <h2 className="card-title justify-center">{enemy.name}</h2>
                    <p>Level: {enemy.level}</p>

                    <progress className="progress progress-error w-full"
                    value={enemy.current_hp} max={enemy.max_hp}>
                    </progress>

                    <div className="w-full flex items-center gap-1 mt-1">
                        <span>CR</span>
                        <progress className="progress progress-info h-1 w-full"
                        value={enemy.readiness} max={100}>
                        </progress>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default EnemyCard