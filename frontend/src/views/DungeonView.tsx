import { useState, useEffect, useRef } from "react"
import { Coins } from "lucide-react"
import PartyMemberBar from "../components/party/PartyMemberBar"

function DungeonView({partyData, rosterData, refreshData, setView}) {
    const [logs, setLogs] = useState<string[]>(["Entering dungeon..."])
    const [isRunning, setIsRunning] = useState<boolean | null>(null)
    const [isRetreating, setIsRetreating] = useState<boolean | null>(null)

    const [showResults, setShowResults] = useState<boolean>(false)

    // const [tickCount, setTickCount] = useState<number>(0)
    const [combatOutcome, setCombatOutcome] = useState<string>("")
    const [sessionGold, setSessionGold] = useState<number>(0)

    const scrollRef = useRef<HTMLDivElement>(null)

    const activeParty = partyData.map((id) => rosterData.adventurers.find((adv) => adv.id === id)).filter(Boolean)

    const runTick = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/dungeon/tick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ party_ids: partyData })
            })

            const data = await res.json()

            setLogs(prev => [...prev, data.message])

            if(data.type === 'loot') {
                setSessionGold(prev => prev + data.gold)
            }

            if(data.type === 'combat' && data.outcome === 'defeat') {
                setIsRunning(false)
                setCombatOutcome('defeat')
                setShowResults(true)
            }

            refreshData()
        } catch (err) {
            console.error("Tick failed:", err)
        }
    }

    useEffect(() => {
        setIsRunning(true)
    }, [])

    useEffect(() => { // Main loop for dungeon ticks
        let interval: any

        if(isRetreating) {
            const timer = setTimeout(() => {
                setIsRunning(false)
                setCombatOutcome('retreat')
                setShowResults(true)
            }, 3000)

            return () => clearTimeout(timer)
        }

        if (isRunning && !isRetreating) {
            interval = setInterval(() => {
                runTick()
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [isRunning, isRetreating, partyData])

    useEffect(() => { // Scroll to bottom on new log
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    return (
        <div>
            <div className={`relative max-h-2xl flex flex-col gap-10 p-10 items-center 
                ${!isRunning && logs.length > 1 ? 'blur-sm grayscale' : ''}`}>
                <h2 className="justify-self-center text-3xl p-5 w-fit rounded-xl font-bold border">
                    Dungeon Exploration
                </h2>
                <div ref={scrollRef}
                className="justify-self-center h-40 w-150 overflow-y-auto border rounded-xl bg-black p-1 mb-5">
                    {logs.map((log, i) => (
                        <div key={i} className="font-bold">{`> ${log}`}</div>
                    ))}
                </div>
                <button onClick={ () => {setIsRetreating(true); setLogs(prev => [...prev, "Retreating from dungeon..."])} }
                disabled={isRetreating || !isRunning}
                className={`btn w-fit ${isRetreating ? 'btn-warning loading' : 'btn-error'}`}>
                    {isRetreating ? 'Retreating...' : 'Retreat'}
                </button>
                <div>
                    <PartyMemberBar partyMembers={activeParty} />
                </div>
            </div>
            {showResults && logs.length >= 1 && (
                <dialog id="dungeon-outcome" className="modal modal-open">
                    <form method="dialog" className="modal-box">
                        <h3 className={`font-bold text-4xl
                        ${combatOutcome === 'defeat' ? 'text-red-500' : 'text-green-500'}`}>
                            {combatOutcome === 'defeat' ? 'Defeated' : 'Results'}
                        </h3>
                        <p className={`py-4 text-xl ${combatOutcome === 'defeat' ? 'text-red-500' : 'text-green-500'}`}>
                            { combatOutcome === 'defeat' ? 
                            'Your party was defeated in the dungeon.' : 'Successfully retreated from the dungeon!' }
                        </p>
                        <p className="py-4 text-lg text-yellow-500">
                            <Coins className="inline mr-2" />
                            Gold Gained: {sessionGold} Gold
                        </p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setView('town')}>Return to Town</button>
                        </div>
                    </form>
                </dialog>
            )}
    </div>
    )
}

export default DungeonView