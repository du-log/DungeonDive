import EnemyCard from "./EnemyCard"

function EnemyGrip( /*{enemies, targetedEnemyId, onSelectEnemy} */ ) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {/* {enemies.map(enemy => (
                <EnemyCard key={enemy.id} enemy={enemy} isTargeted={enemy.id === targetedEnemyId} onSelect={onSelectEnemy} />
            ))} */}
            <EnemyCard />
            <EnemyCard />
            <EnemyCard />
        </div>
    )
}
export default EnemyGrip