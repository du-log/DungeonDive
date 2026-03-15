import { useState, useEffect, useRef } from "react"

function DungeonView({partyData, refreshData}) {
    const [logs, setLogs] = useState<string[]>(["Entering dungeon..."])
    const [isRunning, setIsRunning] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    const runTick = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/dungeon/tick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ party_ids: partyData })
            })

            const data = await res.json()

            setLogs(prev => [...prev, data.message])

            if (data.type === 'loot') {
                refreshData()
            }
        } catch (err) {
            console.error("Tick failed:", err)
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        } // auto-scroll

        let interval: any
        if (isRunning) {
            interval = setInterval(() => {
                runTick()
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [isRunning, partyData, logs])

    return (
    <div className="max-h-2xl py-10">
        <h2 className="justify-self-center text-3xl p-5 w-fit rounded-xl font-bold border">Dungeon Exploration</h2>
        <div ref={scrollRef} className="justify-self-center h-40 w-150 overflow-y-auto border rounded-xl bg-black p-1">
            {logs.map((log, i) => (
                <div key={i} className="font-bold">{`> ${log}`}</div>
            ))}
        </div>
        <button onClick={() => setIsRunning(!isRunning)}
        className={`btn w-fit ${isRunning ? 'btn-error' : 'btn-success'}`}
        >
            {isRunning ? 'End Exploration' : 'Start Exploration'}
        </button>
    </div>
    )
}

export default DungeonView