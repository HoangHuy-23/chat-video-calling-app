import { UserPlus, Users } from "lucide-react";

function SearchUser() {
  return (
    <div className="w-full p-4 flex gap-2">
      <input
        type="text"
        placeholder="Search user"
        className="w-full p-1 rounded-md text-sm bg-base-200 outline-none"
      />
      <div className="flex items-center justify-center bg-primary-500 text-base-content rounded-md p-2 cursor-pointer hover:bg-primary/5">
        <UserPlus className="size-4" />
      </div>
      <div className="flex items-center justify-center bg-primary-500 text-base-content rounded-md p-2 cursor-pointer hover:bg-primary/5">
        <Users className="size-4" />
      </div>
    </div>
  );
}

export default SearchUser;
