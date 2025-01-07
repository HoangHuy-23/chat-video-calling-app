import { Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";

interface SearchUserProps {
  isOpenSearchResult: boolean;
  setIsOpenSearchResult: (value: boolean) => void;
  setShowAddFriend: (value: boolean) => void;
}

function SearchUser({
  isOpenSearchResult,
  setIsOpenSearchResult,
  setShowAddFriend,
}: SearchUserProps) {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full p-4 flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search user"
          className="w-full p-2 rounded-md text-sm bg-base-200 outline-primary pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setIsOpenSearchResult(true)}
        />
        <Search className="absolute size-6 top-1/2 transform -translate-y-1/2 left-1 text-base-content/40" />
      </div>
      {isOpenSearchResult ? (
        <div
          className="flex items-center justify-center bg-primary-500 text-base-content rounded-md p-2 cursor-pointer hover:bg-primary/5"
          onClick={() => setIsOpenSearchResult(false)}
        >
          Close
        </div>
      ) : (
        <>
          <div
            className="flex items-center justify-center bg-primary-500 text-base-content rounded-md p-2 cursor-pointer hover:bg-primary/5"
            onClick={() => setShowAddFriend(true)}
          >
            <UserPlus className="size-4" />
          </div>
          <div className="flex items-center justify-center bg-primary-500 text-base-content rounded-md p-2 cursor-pointer hover:bg-primary/5">
            <Users className="size-4" />
          </div>
        </>
      )}
    </div>
  );
}

export default SearchUser;
