import { UserPlus } from "lucide-react"

function TavernMenu({recruit}) {
    return (
        <div>
            <button onClick={recruit} className="btn btn-primary w-35 h-20">
                <UserPlus size={40} />
                Recruit (100G)
            </button>
        </div>
    )
}
export default TavernMenu