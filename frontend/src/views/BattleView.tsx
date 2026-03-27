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
        <div className='relative h-full w-full'>
            <div className='flex flex-col justify-center'>
                <div className='flex flex-start items-center relative w-full p-4'>
                    <EnemyGrip enemies={{}} targetedEnemyId={targetId} onSelectEnemy={handleTargetSelect} />
                </div>
                <div className='flex-grow p-4'>
                    <ActionLog />
                </div>
                <div className='flex-end p-4'>
                    <CombatHUD activeAdventurer={{}} onUseSkill={() => {}} onAttack={() => {}} />
                </div>
            </div>
            <button onClick={() => setView('town')} className="btn btn-secondary btn-sm">Flee to Town</button>
        </div>
    );
}
export default BattleView