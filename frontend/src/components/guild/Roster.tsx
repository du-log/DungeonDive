import AdventurerCard from "./AdventurerCard"

function Roster({ adventurers, refreshData }) {
    if (!adventurers) return (<div><h1>Your roster is empty!</h1></div>)

    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {adventurers?.map((char) => (
                <AdventurerCard key={char.id} data={char} refreshData={refreshData} />
            ))}
        </div>
    )
}

export default Roster