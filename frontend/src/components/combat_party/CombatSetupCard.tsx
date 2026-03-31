function CombatSetupCard( {data, toggleCombatMember, isSelected} ) {
    return (
        <div onClick={() => toggleCombatMember(data.id)} className={`w-40 h-50 shadow-md cursor-pointer hover:border-primary border bg-gray-300
        ${isSelected ? 'border-success' : 'border-transparent'}`}>
            <div className="flex flex-col p-2 items-center">
                <h3 className="font-bold text-sm">{data.name}</h3>
                <div className="badge badge-secondary text-xs">{data.class}</div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <div>
                        <p className="text-xs">HP: {data.current_hp}/{data.max_hp}</p>
                        <p className="text-xs">STR: {data.str}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CombatSetupCard