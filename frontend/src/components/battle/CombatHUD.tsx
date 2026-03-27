import SkillTray from "./SkillTray"

function CombatHUD( {activeAdventurer, onUseSkill, onAttack} ) {
    return (
        <div className="relative h-full w-full">
            <SkillTray activeAdventurer={activeAdventurer} onUseSkill={onUseSkill} onAttack={onAttack} />
        </div>
    )
}
export default CombatHUD