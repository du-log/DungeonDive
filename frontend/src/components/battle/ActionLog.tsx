import { useRef, useEffect } from "react"

function ActionLog ( {battleLogs} ) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => { // Scroll to bottom on new log
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
        }, [battleLogs])

    return (
        <div className="relative h-full w-full bg-gray-800 text-white p-2">
            <div ref={scrollRef}
                    className="h-full overflow-y-auto border rounded-xl bg-black p-1 mb-5">
                        {battleLogs.map((log, i) => (
                            <div key={i} className="font-bold">{`> ${log}`}</div>
                        ))}
                    </div>
        </div>
    )
}
export default ActionLog