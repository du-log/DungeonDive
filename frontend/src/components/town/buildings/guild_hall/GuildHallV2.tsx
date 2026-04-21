import { useState } from "react"
import RosterView from "./tabs/RosterView"
import FormationView from "./tabs/FormationView"
import AcademyView from "./tabs/AcademyView"
import ArmoryView from "./tabs/ArmoryView"

function GuildHallV2( {setView, rosterData} ) {
    const [activeTab, setTab] = useState<string>('roster')

    return (
        <div className="relative h-full w-full">
            <div className="tabs tabs-lift tabs-lg w-full flex">
                <a className={`tab flex-1 ${activeTab === 'roster' ? 'tab-active' : ''}`} onClick={() => setTab('roster')}>
                    Roster
                </a>
                <a className={`tab flex-1 ${activeTab === 'formation' ? 'tab-active' : ''}`} onClick={() => setTab('formation')}>
                    Formation
                </a>
                <a className={`tab flex-1 ${activeTab === 'academy' ? 'tab-active' : ''}`} onClick={() => setTab('academy')}>
                    Academy
                </a>
                <a className={`tab flex-1 ${activeTab === 'armory' ? 'tab-active' : ''}`} onClick={() => setTab('armory')}>
                    Armory
                </a>
                <a className={`tab flex-1 text-red-500`} onClick={() => setView('town2')}>Back</a>
            </div>
            <div className="tab-content-container p-2 relative overflow-y-auto">
                {activeTab === 'roster' && <RosterView advData={rosterData.adventurers} />}
                {activeTab === 'formation' && <FormationView advData={rosterData} />}
                {activeTab === 'academy' && <AcademyView advData={rosterData} />}
                {activeTab === 'armory' && <ArmoryView advData={rosterData} />}
            </div>
        </div>
    )
}
export default GuildHallV2