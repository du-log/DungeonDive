import Roster from "./Roster"
import { useState } from "react"
import { PersonStanding } from "lucide-react"

function GuildHall({rosterData, refreshData, partyData, togglePartyMember}) {
    const [activeGuildTab, setGuildTab] = useState('main')

    return (
        <div className="flex-col">
            {activeGuildTab === 'main' && (
                <div className="p-10">
                    <button className="btn btn-primary w-35 h-20 text-xl" onClick={() => setGuildTab('roster')}>
                        <PersonStanding size={40} />
                        Roster
                    </button>
                </div>
            )}
            {activeGuildTab === 'roster' && (
                <div className="p-10">

                    <Roster 
                    adventurersData={rosterData.adventurers} 
                    refreshData={refreshData} 
                    partyData={partyData}
                    togglePartyMember={togglePartyMember}
                    />
                    
                </div>
            )}
            {activeGuildTab !== 'main' && (
                <div className="p-10">
                    <button className="btn btn-secondary" onClick={() => setGuildTab('main')}>Guild Hall Menu</button>
                </div>
            )}
        </div>
    )
}
export default GuildHall