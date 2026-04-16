function CombatSetupCard( {data, toggleCombatMember, isSelected, squadCount} ) {
    return (
        <div onClick={() => toggleCombatMember(data.id)}
        className={`w-40 h-40 shadow-md cursor-pointer hover:border-primary border bg-base-300 rounded-2xl border-white
        ${isSelected ? 'border-success' : 'border-transparent'}`}>
            <div className="flex flex-col p-2 items-center">
                <h3 className="font-bold text-sm">{data.name}</h3>
                <div className="badge badge-secondary text-xs">{data.class_id}</div>
                <p className="text-xs">Level {data.level}</p>
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-xs">
                        <p>HP: {data.current_hp}/{data.max_hp}</p>
                        <div className="flex gap-2 justify-center">
                            <div>
                                <p>Str: {data.str}</p>
                                <p>Dex: {data.dex}</p>
                            </div>
                            <div>
                                <p>Int: {data.int}</p>
                                <p>Luck: {data.luck}</p>
                            </div>
                        </div>
                        <p>Will: {data.will}</p>
                        <p>Speed: {Math.round(data.speed * 10) / 10}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CombatSetupCard