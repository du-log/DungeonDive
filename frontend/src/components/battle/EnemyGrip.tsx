import EnemyCard from "./EnemyCard"

function EnemyGrip( {enemies, targetedEnemyId, onSelectEnemy, activeUnitId} ) {
    return (
        <div className="relative">
            <div className="grid grid-cols-4">
                {enemies.map(enemy => (
                    <EnemyCard key={enemy.id} enemy={enemy} isTargeted={enemy.id === targetedEnemyId} onSelect={onSelectEnemy} activeUnitId={activeUnitId} />
                ))}
            </div>
        </div>
    )
}
export default EnemyGrip