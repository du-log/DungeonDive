import AdventurerCard from "./AdventurerCard"

function Roster({ adventurersData, refreshData, partyData, togglePartyMember }) {
    if (!adventurersData) return (<div><h1>Your roster is empty!</h1></div>)

    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-10 border">
            {adventurersData?.map((char) => (
                <AdventurerCard 
                key={char.id}
                data={char}
                refreshData={refreshData}
                partyData={partyData}
                togglePartyMember={togglePartyMember}
                />
            ))}
        </div>
    )
}

export default Roster