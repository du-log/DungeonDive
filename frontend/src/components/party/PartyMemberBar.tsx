import PartyMemberCard from "./PartyMemberCard";

function PartyMemberBar({ partyMembers }) {
    return (
        <div className="flex flex-col relative h-full w-full md:scale-80 items-center justify-center border rounded-xl">
            <h2 className="font-bold text-2xl h-fit w-fit">Party Status</h2>
            <div className=" flex flex-row gap-10 p-5 justify-center">
                {partyMembers.map((member) => (
                    <PartyMemberCard key={member.id} adventurer={member} />
                ))}
            </div>
        </div>
    );
}
export default PartyMemberBar