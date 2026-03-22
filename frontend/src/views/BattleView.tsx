import { useState } from 'react'
import CombatHUD from '../components/battle/CombatHUD'
import EnemyGrip from '../components/battle/EnemyGrip'
import ActionLog from '../components/battle/ActionLog'

function BattleView( {setView} ) {
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleTargetSelect = (instanceId: number) => {
        setTargetId(instanceId);
    }

    return (
        <div>
            <div className='flex flex-col relative h-full w-full'>
                <div className='flex-1 p-4'>
                    <EnemyGrip enemies={{}} targetedEnemyId={targetId} onSelectEnemy={handleTargetSelect} />
                </div>
                <div className='h-48 p-4'>
                    <ActionLog />
                </div>
                <CombatHUD activeAdventurer={{}} onUseSkill={() => {}} onAttack={() => {}} />
            </div>
            <button onClick={() => setView('town')} className="btn btn-secondary m-4">Flee to Town</button>
        </div>
    );
}
export default BattleView