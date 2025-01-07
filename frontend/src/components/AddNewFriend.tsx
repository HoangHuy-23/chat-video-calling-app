import { MessageCircle, UserPlus, X } from "lucide-react";
import { useState } from "react";
import useUserStore from "../store/useUserStore";
import { useContactStore } from "../store/useContactStore";
import { useFriendRequestStore } from "../store/useFriendRequestStore";

interface AddNewFriendProps {
  showAddFriend: boolean;
  setShowAddFriend: (value: boolean) => void;
}

function AddNewFriend({ showAddFriend, setShowAddFriend }: AddNewFriendProps) {
  const { searchUser, searchResult } = useUserStore();
  const { myContacts } = useContactStore();
  const { sendFriendRequest } = useFriendRequestStore();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    searchUser(search);
  };

  console.log(myContacts);

  const checkIsFriend = (userId: string) => {
    if (!myContacts) return false;
    return myContacts.contacts.some((contact) => contact.userId._id === userId);
  };

  const handleSendFriendRequest = (receiverId: string) => {
    sendFriendRequest(receiverId);
  };
  return (
    <div
      className={`fixed flex justify-center items-center top-0 left-0 w-full h-full bg-base-content bg-opacity-80 z-50 ${
        showAddFriend ? "" : "hidden"
      }`}
    >
      <div className="w-[360px] h-[calc(100vh-12rem)] flex flex-col bg-base-100 rounded-md">
        {/* title */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h1 className="text-xl font-semibold ">Add friend</h1>
          <X
            className="size-8 font-thin cursor-pointer"
            onClick={() => setShowAddFriend(false)}
          />
        </div>
        {/* search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Email or username"
            className="w-full p-2 rounded-md text-sm bg-base-200 outline-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* result */}
        <div className="flex-grow">
          {searchResult.length > 0 &&
            searchResult.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-2 p-4 border-b border-base-300"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-base-content">{user.email}</p>
                  </div>
                </div>
                {checkIsFriend(user._id) ? (
                  <button className="p-2 bg-base-200 text-base-content rounded-md">
                    <MessageCircle className="size-4" />
                  </button>
                ) : (
                  <button
                    className="p-2 bg-primary text-base-100 rounded-md"
                    onClick={() => handleSendFriendRequest(user._id)}
                  >
                    <UserPlus className="size-4" />
                  </button>
                )}
              </div>
            ))}
        </div>
        {/* footer */}
        <div className="flex gap-2 p-4 border-t border-base-300">
          <button className="w-full p-2 bg-base-200 text-base-content rounded-t-md">
            Cancel
          </button>
          <button
            className="w-full p-2 bg-primary text-base-100 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewFriend;
