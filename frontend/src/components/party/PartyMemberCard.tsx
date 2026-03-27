import { Square, Triangle, Circle, Pentagon } from "lucide-react";

function PartyMemberCard({ adventurer }) {
  const hp_percentage = (adventurer.current_hp / adventurer.max_hp) * 100

  return (
    <div className="body relative w-30 h-full justify-center border rounded-xl p-3">
      <div className="mb-1 border rounded-xl relative w-full h-full flex flex-col p-1 justify-center gap-2">
        <div className="flex flex-col items-center">
          {adventurer.class === "Warrior" && <Square size={40} className="text-red-500" />}
          {adventurer.class === "Paladin" && <Triangle size={40} className="text-blue-500" />}
          {adventurer.class === "Mage" && <Circle size={40} className="text-green-500" />}
          {adventurer.class === "Cleric" && <Pentagon size={40} className="text-yellow-500" />}
        </div>
        <p className="text-lg">{adventurer.name}</p>
        <p className="text-sm">HP: {adventurer.current_hp}/{adventurer.max_hp}</p>
        <progress className={` progress relative w-full
        ${hp_percentage > 25 && hp_percentage <= 50 && 'progress-warning'}
        ${hp_percentage <= 25 && 'progress-error'}`}
        value={adventurer.current_hp} max={adventurer.max_hp}>
        </progress>
      </div>
    </div>
  );
}
export default PartyMemberCard