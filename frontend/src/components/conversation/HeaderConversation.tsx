import { Conversation, User } from "../../types";
import { DateTimeFormat } from "../../lib/utils";
import { BadgeInfo, Phone, Search, Video } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

interface HeaderConversationProps {
  isOpenRightBar: boolean;
  setIsOpenRightBar: (isOpenRightBar: boolean) => void;
  selectedConversation: Conversation | null;
  user: User | null;
}

function HeaderConversation({
  isOpenRightBar,
  setIsOpenRightBar,
  selectedConversation,
  user,
}: HeaderConversationProps) {
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers?.find(
    (onlineUser) =>
      onlineUser.userId ===
      selectedConversation?.members.find((member) => member._id !== user?._id)
        ?._id
  );
  return (
    <div className="flex items-center justify-between p-2 border-b border-base-300">
      {/* left */}
      <div className="flex items-start gap-2">
        <div className="relative">
          {!selectedConversation?.isGroup && (
            <img
              src={
                selectedConversation?.members.find(
                  (member) => member._id !== user?._id
                )?.profilePic || "/avatar.png"
              }
              alt="profile"
              className="size-12 rounded-full border-1 border-base-300"
            ></img>
          )}
          {isOnline && (
            <span className="absolute size-4 rounded-full bg-green-500 right-0 top-8"></span>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold">
            {
              selectedConversation?.members.find(
                (member) => member._id !== user?._id
              )?.name
            }
          </h3>
          {isOnline ? (
            <span className="text-xs text-primary">Just now</span>
          ) : (
            <span className="text-xs">
              Last seen{" "}
              {DateTimeFormat(
                selectedConversation?.members.find(
                  (member) => member._id !== user?._id
                )?.lastSeen as string
              )}
            </span>
          )}
        </div>
      </div>

      {/* right */}
      <div className="flex items-center gap-2">
        <div
          className={`p-2 rounded-md  hover:bg-base-200 cursor-pointer bg-base-100
          }`}
        >
          <Phone size={24} />
        </div>
        <div
          className={`p-2 rounded-md  hover:bg-base-200 cursor-pointer bg-base-100
          }`}
        >
          <Video size={24} />
        </div>
        <div
          className={`p-2 rounded-md  hover:bg-base-200 cursor-pointer bg-base-100
          }`}
        >
          <Search size={24} />
        </div>
        <div
          className={`p-2 rounded-md  hover:bg-base-200 cursor-pointer ${
            isOpenRightBar ? "text-primary bg-base-200" : "bg-base-100"
          }`}
        >
          <BadgeInfo
            size={24}
            onClick={() => setIsOpenRightBar(!isOpenRightBar)}
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderConversation;
