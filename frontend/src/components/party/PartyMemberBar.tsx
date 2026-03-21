import PartyMemberCard from "./PartyMemberCard";

function PartyMemberBar({ partyMembers }) {
    return (
        <div className="party-bar border rounded-xl p-5 m-5">
            <h2 className="font-bold text-2xl">Party Status</h2>
            <div className=" flex flex-row gap-10 p-5 justify-center">
                {partyMembers.map((member) => (
                    <PartyMemberCard key={member.id} adventurer={member} />
                ))}
            </div>
        </div>
    );
}
export default PartyMemberBar