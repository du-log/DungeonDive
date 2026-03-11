function Tavern({ refreshData }) {

    const recruit = async() => {
        const res = await fetch('http://127.0.0.1:8000/adventurer/recruit', {
            method: 'POST',
        })
        if (res.ok) {
            refreshData()
            alert("Recruited an adventurer!")
        } else {
            alert("Not enough gold!")
        }
    }

    return(
        <div>
            <button onClick={recruit} className="btn btn-primary">Recruit (100G)</button>
        </div>
    )
}
export default Tavern