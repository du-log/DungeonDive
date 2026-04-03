import { useState, useEffect } from 'react'
import CombatHUD from '../components/battle/CombatHUD'
import EnemyGrip from '../components/battle/EnemyGrip'
import ActionLog from '../components/battle/ActionLog'

function BattleView( { combatants, activeUnitId, targetId, setTargetId, handleBattleTick, battleLogs, executeAttack, endBattle, fleeFromBattle } ) {
    const enemies = combatants.filter(c => c.unit_type === 'enemy')
    const heroes = combatants.filter(h => h.unit_type === 'adventurer')
    const activeAdventurer = heroes.find(h => h.id === activeUnitId)

    useEffect(() => {
        if (activeUnitId === null) {
            const interval = setInterval(() => {
                handleBattleTick()
            }, 200)
            return () => clearInterval(interval)
        }
    }, [activeUnitId])

    return (
        <div className='flex flex-col h-full w-full items-center pt-2 pb-2 overflow-hidden'>
            <div className='h-1/3 w-full p-4 flex flex-col justify-center items-center'>
                <EnemyGrip enemies={enemies} targetedEnemyId={targetId} onSelectEnemy={setTargetId} activeUnitId={activeUnitId} />
            </div>
            <div className='h-full w-2/3 overflow-y-auto p-4'>
                <ActionLog
                    battleLogs={battleLogs} />
            </div>
            <div className='h-1/3 p-4'>
                <CombatHUD 
                    activeAdventurer={activeAdventurer}
                    onUseSkill={() => {}}
                    onAttack={executeAttack} 
                    party={heroes}
                    targetId={targetId} />
            </div>
            <button onClick={() => fleeFromBattle()} className="btn btn-secondary btn-sm w-fit">Flee from Battle</button>
        </div>
    );
}
export default BattleView