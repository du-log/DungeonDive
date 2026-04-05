import { UserPlus } from "lucide-react"

function TavernMenu({recruit}) {
    return (
        <div className="grid grid-cols-2 gap-5">
            <button onClick={() => recruit(0)} className="btn btn-primary w-35 h-20">
                <UserPlus size={40} />
                Recruit Random
            </button>
            <button onClick={() => recruit(1)} className="btn btn-primary w-35 h-20">
                <UserPlus size={40} />
                Recruit Knight
            </button>
            <button onClick={() => recruit(2)} className="btn btn-primary w-35 h-20">
                <UserPlus size={40} />
                Recruit Mage
            </button>
            <button onClick={() => recruit(3)} className="btn btn-primary w-35 h-20">
                <UserPlus size={40} />
                Recruit Rogue
            </button>
        </div>
    )
}
export default TavernMenu