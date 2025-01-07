import { LayoutList, User, UserCheck, Users } from "lucide-react";

interface SidebarContactProps {
  showMyFriends: boolean;
  setShowMyFriends: (show: boolean) => void;
  showRequests: boolean;
  setShowRequests: (show: boolean) => void;
  showGroup: boolean;
  setShowGroup: (show: boolean) => void;
}

function SidebarContact({
  showMyFriends,
  setShowMyFriends,
  showRequests,
  setShowRequests,
  showGroup,
  setShowGroup,
}: SidebarContactProps) {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div
        className={`flex p-4 items-center cursor-pointer gap-2 ${
          showMyFriends ? "bg-primary/10" : ""
        }`}
        onClick={() => {
          setShowMyFriends(true);
          setShowRequests(false);
          setShowGroup(false);
        }}
      >
        <LayoutList className="size-6 text-base-content" />
        <p className="text-base-content text-lg">Friends list</p>
      </div>
      <div
        className={`flex p-4 items-center cursor-pointer gap-2 ${
          showGroup ? "bg-primary/10" : ""
        }`}
        onClick={() => {
          setShowGroup(true);
          setShowMyFriends(false);
          setShowRequests(false);
        }}
      >
        <Users className="size-6 text-base-content" />
        <p className="text-base-content text-lg">Joined groups</p>
      </div>
      <div
        className={`flex p-4 items-center cursor-pointer gap-2 ${
          showRequests ? "bg-primary/10" : ""
        }`}
        onClick={() => {
          setShowRequests(true);
          setShowMyFriends(false);
          setShowGroup(false);
        }}
      >
        <UserCheck className="size-6 text-base-content" />
        <p className="text-base-content text-lg">Friend requests</p>
      </div>
    </div>
  );
}

export default SidebarContact;
