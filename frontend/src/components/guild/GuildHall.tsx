import Roster from "./Roster"
import { useState } from "react"
import { PersonStanding } from "lucide-react"

function GuildHall({rosterData, refreshData, partyData, togglePartyMember, setSubTab}) {
    const [activeGuildTab, setGuildTab] = useState('main')

    return (
        <div className="flex-col relative h-full w-full items-center justify-center">
            {activeGuildTab === 'main' && (
                <div className="p-1">
                    <button className="btn btn-primary p-10 text-xl"
                    onClick={() => {setGuildTab('roster'); setSubTab(true)}}>
                        <PersonStanding size={40} />
                        Roster
                    </button>
                </div>
            )}
            {activeGuildTab === 'roster' && (
                <div className="flex flex-col h-[70vh] overflow-hidden p-2 gap-5 border rounded-xl">

                    <Roster 
                    adventurersData={rosterData.adventurers} 
                    refreshData={refreshData} 
                    partyData={partyData}
                    togglePartyMember={togglePartyMember}
                    />

                    <div>
                    <button className="btn btn-lg btn-secondary"
                    onClick={() => {setGuildTab('main'); setSubTab(false)}}>Guild Hall Menu</button>
                </div>
                    
                </div>
            )}
        </div>
    )
}
export default GuildHall