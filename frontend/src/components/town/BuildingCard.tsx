function BuildingCard( {title, icon, status, onClick, color = "bg-base-200"} ) {
    return (
        <div className={`p-3 rounded-xl ${color} shadow-lg hover:shadow-2xl hover:-translate-y-1
        transition-all cursor-pointer border border-base-300 active:scale-95`}
        onClick={onClick}>
            <div className="card-body p-1">
                <div className="flex justify-center items-start gap-2">
                    <span className="text-2xl">
                        {icon}
                    </span>
                    <h2 className="card-title text-lg justify-center">{title}</h2>
                </div>
                <p className="text-sm opacity-70 italic">{status}</p>
            </div>
        </div>
    )
}
export default BuildingCard