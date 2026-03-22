function EnemyCard( /*{enemy, isTargeted, onSelect} */ ) {
    //const hpPercent = (enemy.current_hp / enemy.max_hp) * 100;
    return (
        <div>
            <div /*onClick={ () => onSelect(enemy.id) }*/
                className={`card bg-base-100 shadow-xl cursor-pointer`}>
                <div className="card-body">
                    <h2 className="card-title">{/*enemy.name*/}Goblin</h2>
                    <p>Level: {/*enemy.level*/}</p>

                    <progress className="progress progress-error w-full"
                    value={/*enemy.current_hp*/50} max={/*enemy.max_hp*/100}>
                    </progress>

                    <div className="w-full flex items-center gap-1 mt-1">
                        <span>CR</span>
                        <progress className="progress progress-info h-1 w-full"
                        value={/*enemy.readiness*/50} max={100}>
                        </progress>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default EnemyCard