function EnemyCard( {enemy, isTargeted, onSelect, activeUnitId}  ) {
    return (
        <div className="relative scale-75 h-full w-full">
            <div onClick={ () => !enemy.is_dead && onSelect(enemy.id) }
                className={`bg-base-100 shadow-xl w-40 h-fit cursor-pointer justify-center px-5 py-1 rounded-2xl
                ${isTargeted ? 'ring-4 ring-red-500' : ''}
                ${enemy.id == activeUnitId ? 'ring-4 ring-blue-500' : ''}
                ${enemy.is_dead ? 'grayscale' : ''}`}>
                <div className="card-body m-0 p-0">
                    <h2 className="card-title justify-center">{enemy.name}</h2>
                    <p>Level: {enemy.level}</p>

                    <div className="h-fit text-sm">
                        <progress className="progress progress-error w-full"
                        value={enemy.current_hp} max={enemy.max_hp}>
                        </progress>
                        <text>{enemy.current_hp} / {enemy.max_hp}</text>
                    </div>

                    <div className="w-full flex items-center gap-1 text-sm">
                        <span>CR</span>
                        <progress className={`progress progress-info h-1 w-full ${enemy.readiness >= 100 ? 'progress-error' : ''}`}
                        value={enemy.readiness} max={100}>
                        </progress>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EnemyCard