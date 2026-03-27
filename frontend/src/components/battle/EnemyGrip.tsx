import EnemyCard from "./EnemyCard"

function EnemyGrip( /*{enemies, targetedEnemyId, onSelectEnemy} */ ) {
    return (
        <div className="relative h-full w-full">
            <div className="grid grid-cols-3 gap-4 justify-center items-center h-full w-full">
            {/* {enemies.map(enemy => (
                <EnemyCard key={enemy.id} enemy={enemy} isTargeted={enemy.id === targetedEnemyId} onSelect={onSelectEnemy} />
            ))} */}
            <EnemyCard />
            <EnemyCard />
            <EnemyCard />
        </div>
        </div>
    )
}
export default EnemyGrip