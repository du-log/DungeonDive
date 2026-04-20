function StatsView ( {selectedAdv} ) {
    return (
        <div className="h-full w-full">
            <div className="grid grid-cols-2 p-5">
                <div className="col-1 flex flex-col gap-3 p-2 items-center border-2 border-base-300 rounded-xl">
                    <div className="badge badge-xl badge-primary">Attributes</div>
                    <div className="flex flex-col rounded-xl">
                        <h2>Str: {selectedAdv.str}</h2>
                        <h2>Dex: {selectedAdv.dex}</h2>
                        <h2>Int: {selectedAdv.int}</h2>
                        <h2>Will: {selectedAdv.will}</h2>
                        <h2>Luck: {selectedAdv.luck}</h2>
                        <h2>Speed: {Math.round(selectedAdv.speed * 10) / 10}</h2>
                    </div>
                </div>
                <div className="col-2 flex flex-col">

                </div>
            </div>
        </div>
    )
}
export default StatsView