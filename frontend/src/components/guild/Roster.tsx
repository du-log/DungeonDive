import AdventurerCard from "./AdventurerCard"

function Roster({ adventurersData, refreshData, partyData, togglePartyMember }) {
    if (!adventurersData || adventurersData.length === 0) {
        return (
            <div className="relative w-full h-full flex flex-col">
                <h1 className="text-4xl font-bold">
                    Your roster is empty!
                </h1>
                <p>
                    Visit the tavern to recruit new adventurers.
                </p>
            </div>
        )
    }

    return(
        <div className="flex-grow overflow-y-auto p-5">
            <div className=" grid grid-cols-4 justify-items-center gap-5 p-5 border border-white">
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
        </div>
    )
}

export default Roster