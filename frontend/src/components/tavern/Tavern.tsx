import TavernMenu from "./TavernMenu"

function Tavern({ refreshData }) {

    const recruit = async (id: number) => {
        const res = await fetch(`http://127.0.0.1:8000/adventurer/recruit/${id}`, {
            method: 'POST',
        })
        if (res.ok) {
            refreshData()
            //alert("Recruited an adventurer!")
        } else {
            alert("Not enough gold!")
        }
    }

    return(
        <div className="p-10">
            <TavernMenu recruit={recruit} />
        </div>
    )
}
export default Tavern