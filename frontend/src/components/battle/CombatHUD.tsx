import SkillTray from "./SkillTray"

function CombatHUD( {activeAdventurer, onUseSkill, onAttack} ) {
    return (
        <div className="fixed bottom-0 left-0 w-full">
            <SkillTray activeAdventurer={activeAdventurer} onUseSkill={onUseSkill} onAttack={onAttack} />
        </div>
    )
}
export default CombatHUD