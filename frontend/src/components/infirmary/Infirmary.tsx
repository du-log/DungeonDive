import { Circle, Pentagon, Square, Triangle } from "lucide-react"
import { useState } from "react"

function Infirmary({ rosterData, refreshData }) {
    const injuredAdventurers = rosterData.adventurers.filter(adventurer => adventurer.current_hp < adventurer.max_hp)
    const [injuredIds, setInjuredIds] = useState<number[]>([...injuredAdventurers.map(adv => adv.id)])

    const handleHeal = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/adventurer/heal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ healing_ids: injuredIds })
            })
            const data = await res.json()
            console.log(data)

            refreshData()
        } catch (error) {
            console.error('Error healing adventurers:', error)
        }
    }


    return (
        <div>
            <div className="flex flex-col gap-10 justify-center border rounded-4xl p-10">
                <h1 className="text-4xl">Infirmary</h1>
                <div>{injuredAdventurers.length === 0 && <p className="text-4xl">All adventurers are at full health!</p>}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-10 border rounded-4xl items-center justify-center"
                visually-hidden={injuredAdventurers.length === 0}>
                    {injuredAdventurers.map((char) => (
                    <div key={char.id} className="p-4 border rounded-lg">
                        <h2>{char.name}</h2>
                        <div className="flex flex-col items-center">
                            {char.class === "Warrior" && <Square size={40} className="text-red-500" />}
                            {char.class === "Paladin" && <Triangle size={40} className="text-blue-500" />}
                            {char.class === "Mage" && <Circle size={40} className="text-green-500" />}
                            {char.class === "Cleric" && <Pentagon size={40} className="text-yellow-500" />}
                        </div>
                        <p>HP: {char.current_hp}/{char.max_hp}</p>
                    </div>
                    ))}
                </div>
                {injuredAdventurers.length > 0 && (
                    <button onClick={ () => handleHeal()} className="btn btn-success">
                        Heal All for {injuredAdventurers.length * 100} Gold
                    </button>
                )}
            </div>
        </div>
    )
}
export default Infirmary