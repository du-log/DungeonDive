import { UserMinus, BadgeInfo, PlusIcon, MinusIcon, Pentagon, Circle, Triangle, Square } from "lucide-react"
import { useState } from "react"

function AdventurerCard({ data, refreshData, partyData, togglePartyMember }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [promptOpen, setPromptOpen] = useState(false)

    const retire = async() => {
        if(isSelected) return alert(`Cannot retire. Adventurer ${data.name} is currently in the party.`)
        const res = await fetch(`http://127.0.0.1:8000/adventurer/retire/${data.id}`, {
            method: 'DELETE',
        })
        if (res.ok) {
            refreshData()
        }
    }

    const isSelected = partyData.includes(data.id)
    const partySize = partyData.length

    return(
        <div>
            <div className={`border-2 rounded-3xl w-50 h-70 p-3 flex flex-col items-center justify-center
            ${isSelected ? 'border-primary bg-primary/10' : 'border-base-300'}`}>
                <div className="border rounded-xl relative w-full h-full flex flex-col justify-center gap-5">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="card-title">{data.name}</h2>
                        <div className="flex flex-col items-center">
                            {data.class === "Warrior" && <Square size={40} className="text-red-500" />}
                            {data.class === "Paladin" && <Triangle size={40} className="text-blue-500" />}
                            {data.class === "Mage" && <Circle size={40} className="text-green-500" />}
                            {data.class === "Cleric" && <Pentagon size={40} className="text-yellow-500" />}
                        </div>
                    </div>
                    <p>Level: {data.level}</p>
                    <div className="flex justify-center gap-2">
                        <button className="btn btn-square btn-info" onClick={() => setModalOpen(true)}>
                            <BadgeInfo size={30} />
                        </button>
                        <button
                        onClick={() => togglePartyMember(data.id)}
                        className={`btn btn-square ${isSelected ? 'btn-error' : 'btn-success'} 
                        ${!isSelected && partySize === 4 ? 'btn-disabled' : ''}`}>
                            {isSelected && <MinusIcon size={30} />}
                            {!isSelected && (partySize !== 4) && <PlusIcon size={30} />}
                            {!isSelected && (partySize === 4) && 'Party Full'}
                        </button>
                        <button className={`btn btn-square btn-warning ${isSelected ? 'btn-disabled' : ''}`}
                        onClick={() => setPromptOpen(true)}>
                            <UserMinus size={30} />
                        </button>
                    </div>
                </div>
            </div>
            {modalOpen && (
                <dialog id="adv_modal" className="modal modal-open">
                    <div className="modal-box w-60 border-2">
                        <div className="flex flex-col gap-5 justify-center">
                            <h3 className="font-bold text-lg">{data.name}</h3>
                            <p>Class: {data.class}</p>
                            <div className="flex flex-col items-center">
                                {data.class === "Warrior" && <Square size={40} className="text-red-500" />}
                                {data.class === "Paladin" && <Triangle size={40} className="text-blue-500" />}
                                {data.class === "Mage" && <Circle size={40} className="text-green-500" />}
                                {data.class === "Cleric" && <Pentagon size={40} className="text-yellow-500" />}
                            </div>
                            <p>Level: {data.level}</p>
                            <p>HP: {data.current_hp}/{data.max_hp}</p>
                            <div className="flex flex-row gap-5 justify-center items-center border rounded-xl p-5">
                                <div className="flex-start">
                                    <p>Str: {data.str}</p>
                                    <p>Con: {data.con}</p>
                                </div>
                                <div className="flex-end">
                                    <p>Int: {data.int}</p>
                                    <p>Will: {data.will}</p>
                                    <p>Luck: {data.luck}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setModalOpen(false)}>Close</button>
                    </form>
                </dialog>
            )}
            {promptOpen && (
                <dialog id="retire_prompt" className="modal modal-open">
                    <div className="modal-box w-60 border-2">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-lg">Retire Adventurer</h3>
                            <p>Are you sure you want to retire {data.name}?</p>
                            <div className="flex justify-center gap-2">
                                <button className="btn btn-error" onClick={() => {retire(); setPromptOpen(false)}}>
                                    Retire
                                </button>
                                <button className="btn btn-secondary" onClick={() => setPromptOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    )
}

export default AdventurerCard