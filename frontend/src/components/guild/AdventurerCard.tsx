//import { UserCircle2 } from "lucide-react"

function AdventurerCard({ data, refreshData }) {
    const retire = async() => {
        const res = await fetch(`http://127.0.0.1:8000/adventurer/retire/${data.id}`, {
            method: 'DELETE',
        })
        if (res.ok) {
            refreshData()
        }
    }

    return(
        <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
                <div className="flex flex-col items-center">
                    <h2 className="card-title">{data.name}</h2>
                    <h3 className="card-title">{data.class}</h3>
                </div>
                <p>Level: {data.level}</p>
                <div className="card-actions justify-center">
                    <button className="btn btn-primary">Manage</button>
                    <button className="btn btn-secondary" onClick={retire}>Retire</button>
                </div>
            </div>
        </div>
    )
}

export default AdventurerCard