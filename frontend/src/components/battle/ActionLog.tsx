function ActionLog () {
    return (
        <div className="h-full w-full bg-gray-800 text-white p-2 overflow-y-auto">
            <p>Action Log:</p>
            {/* Example log entries */}
            <p>Adventurer used Power Strike on Goblin for 15 damage.</p>
            <p>Goblin attacked Adventurer for 5 damage.</p>
        </div>
    )
}
export default ActionLog