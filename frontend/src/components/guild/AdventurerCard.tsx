import { UserMinus, BadgeInfo } from "lucide-react"

function AdventurerCard({ data, refreshData, partyData, togglePartyMember }) {
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
        <div className={`card border-2 ${isSelected ? 'border-primary bg-primary/10' : 'border-base-300'}`}>
            <div className="card-body">
                <div className="flex flex-col items-center">
                    <h2 className="card-title">{data.name}</h2>
                    <h3 className="card-title">{data.class}</h3>
                </div>
                <p>Level: {data.level}</p>
                <div className="card-actions justify-center">
                    <button className="btn btn-primary">
                        <BadgeInfo size={30} />
                        Details
                    </button>
                    <button className="btn btn-secondary" onClick={retire}>
                        <UserMinus size={30} />
                        Retire
                    </button>
                    <button
                    onClick={() => togglePartyMember(data.id)}
                    className={`btn ${isSelected ? 'btn-error' : 'btn-outline'} ${!isSelected && partySize === 4 ? 'btn-disabled' : ''}`}>
                        {isSelected && 'Remove from Party'}
                        {!isSelected && (partySize !== 4) && 'Add to Party'}
                        {!isSelected && (partySize === 4) && 'Party Full'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdventurerCard