import BuildingCard from "./BuildingCard"
import { University, Beer, ChessRook, Hospital, Church, Store, Landmark} from "lucide-react"

function TownView( {setView}) {
    return (
        <div className="relative w-full h-full">
            <div className="grid grid-flow-dense grid-cols-3 h-full w-full grid-rows-2 gap-6 items-center px-5">
                <div className="flex flex-col col-1 row-1 gap-3 h-fit justify-center items-center border rounded-xl p-3">
                    <h2 className="badge badge-outline font-bold text-lg w-full">Command District</h2>
                    <BuildingCard
                        title="Guild Hall"
                        icon={<Landmark size={30}/>}
                        status="Manage Roster"
                        onClick={() => setView('guildhall')}
                    />
                    <BuildingCard
                        title="Academy"
                        icon={<University size={30}/>}
                        status="Promote Heroes"
                        onClick={() => setView('academy')}
                    />
                </div>
                <div className="flex flex-col col-2 row-1 row-span-2 gap-3 h-fit justify-center items-center border rounded-xl p-3">
                    <h2 className="badge badge-outline font-bold text-lg w-full">The Core</h2>
                    <BuildingCard
                        title="Dungeon"
                        icon={<ChessRook size={30}/>}
                        status="Challenge the Dungeon"
                        color="bg-red-900 text-primary-content"
                        onClick={() => setView('town')} //change later
                    />
                </div>
                <div className="flex flex-col col-3 row-1 gap-3 h-fit justify-center items-center border rounded-xl p-3">
                    <h2 className="badge badge-outline font-bold text-lg w-full">Commerce District</h2>
                    <BuildingCard
                    title="Tavern"
                    icon={<Beer size={30}/>}
                    status="Recruit Heroes"
                    onClick={() => setView('town')} //change later
                    />
                    <BuildingCard
                    title="Market"
                    icon={<Store size={30}/>}
                    status="Weapons and Supplies"
                    onClick={() => setView('town')} //change later
                    />
                </div>
                <div className="flex flex-col col-1 row-2 gap-3 h-fit justify-center items-center border rounded-xl p-3">
                    <h2 className="badge badge-outline font-bold text-lg w-full">Welfare District</h2>
                    <BuildingCard
                        title="Infirmary"
                        icon={<Hospital size={30}/>}
                        status="Heal Heroes"
                        onClick={() => setView('town')} //change later
                    />
                    <BuildingCard
                        title="Church"
                        icon={<Church size={30}/>}
                        status="Coming Soon!"
                        onClick={() => setView('town')} //change later
                    />
                </div>
            </div>
        </div>
    )
}

export default TownView