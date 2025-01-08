import { PlusCircle, X } from "lucide-react";
import { useContactStore } from "../store/useContactStore";
import { useEffect, useState } from "react";
import { useConversationStore } from "../store/useConversationStore";

interface CreateGroupProps {
  showCreateGroup: boolean;
  setShowCreateGroup: (value: boolean) => void;
}

function CreateGroup({
  showCreateGroup,
  setShowCreateGroup,
}: CreateGroupProps) {
  const { myContacts, fetchMyContacts } = useContactStore();
  const {
    membersCreateGroup,
    addMemberCreateGroup,
    removeMemberCreateGroup,
    createConversationAsGroup,
  } = useConversationStore();
  useEffect(() => {
    fetchMyContacts();
  }, [fetchMyContacts]);

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");

  const isCheckSelected = (userId: string) => {
    return membersCreateGroup.some((member) => member._id === userId);
  };

  const handleAddMember = (member: any) => {
    addMemberCreateGroup(member);
  };

  const handleRemoveMember = (member: any) => {
    removeMemberCreateGroup(member);
  };

  const handleCreateGroup = async () => {
    createConversationAsGroup(
      name,
      "",
      membersCreateGroup.map((member) => member._id)
    );
    setShowCreateGroup(false);
  };
  return (
    <div
      className={`fixed flex justify-center items-center top-0 left-0 w-full h-full bg-base-content bg-opacity-80 z-50 ${
        showCreateGroup ? "" : "hidden"
      }`}
    >
      <div className="w-[460px] h-[calc(100vh-10rem)] flex flex-col bg-base-100 rounded-md">
        {/* title */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h1 className="text-xl font-semibold ">Create group</h1>
          <X
            className="size-8 font-thin cursor-pointer"
            onClick={() => setShowCreateGroup(false)}
          />
        </div>
        {/* search */}
        {/* <div className="p-4">
      <input
        type="text"
        placeholder="Email or username"
        className="w-full p-2 rounded-md text-sm bg-base-200 outline-primary"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div> */}
        {/* profile pic and name */}
        <div className="flex items-center gap-2 p-4 border-b border-base-300">
          <img
            src="/avatar.png"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            placeholder="Group name"
            className="w-full p-2 rounded-md text-sm bg-base-200 outline-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* result */}
        <div className="flex-grow grid grid-cols-5">
          {/* left */}
          <div className="col-span-3">
            {myContacts &&
              myContacts.contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-start gap-2 p-4 border-b border-base-300"
                >
                  {/* checkbox */}
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={isCheckSelected(contact.userId._id)}
                    onChange={() =>
                      isCheckSelected(contact.userId._id)
                        ? handleRemoveMember(contact.userId)
                        : handleAddMember(contact.userId)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <img
                      src={contact.userId.profilePic || "/avatar.png"}
                      alt={contact.userId.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {contact.userId.name}
                      </p>
                      <p className="text-xs text-base-content">
                        {contact.userId.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* right */}
          <div className="col-span-2 border-l border-base-300">
            <div className="text-sm font-semibold p-2">
              Selected
              <span className="ml-2 px-2 rounded-full bg-primary/30 text-primary">
                {membersCreateGroup.length}/10
              </span>
            </div>
            {membersCreateGroup.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between gap-2 p-1 bg-primary/5 mx-2 rounded-full"
              >
                <div className="flex items-center gap-2 ">
                  <img
                    src={member.profilePic || "/avatar.png"}
                    alt="avatar"
                    className="size-5 rounded-full border border-primary"
                  />
                  <div>
                    <p className="text-xs font-semibold text-primary">
                      {member.name}
                    </p>
                  </div>
                </div>
                <button className="bg-primary text-base-100 rounded-full">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* footer */}
        <div className="flex gap-2 p-4 border-t border-base-300">
          <button className="w-full p-2 bg-base-200 text-base-content rounded-t-md">
            Cancel
          </button>
          <button
            className={`w-full p-2 bg-primary text-base-100 rounded-md ${
              membersCreateGroup.length < 2 && "opacity-50"
            }`}
            disabled={membersCreateGroup.length < 2}
            onClick={handleCreateGroup}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
