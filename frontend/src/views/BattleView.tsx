import { useState, useEffect } from 'react'
import CombatHUD from '../components/battle/CombatHUD'
import EnemyGrip from '../components/battle/EnemyGrip'
import ActionLog from '../components/battle/ActionLog'

function BattleView( {setView, combatants, activeUnitId, targetId, setTargetId, handleBattleTick, fetchBattleData, executeAttack, checkBattleEnd, endBattle} ) {
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
        checkBattleEnd(combatants)
    }, [activeUnitId])

    return (
        <div className='flex flex-col h-full w-full items-center pt-2 pb-2 overflow-hidden'>
            <div className='h-1/3 w-full p-4'>
                    <EnemyGrip enemies={enemies} targetedEnemyId={targetId} onSelectEnemy={setTargetId} />
                </div>
                <div className='flex-grow overflow-y-auto p-4'>
                    <ActionLog />
                </div>
                <div className='h-1/3 p-4'>
                    <CombatHUD 
                        activeAdventurer={activeAdventurer}
                        onUseSkill={() => {}}
                        onAttack={executeAttack} 
                        party={heroes}
                        targetId={targetId} />
                </div>
            <button onClick={() => endBattle()} className="btn btn-secondary btn-sm w-fit">Flee to Town</button>
        </div>
    );
}
export default BattleView