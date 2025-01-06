import { Conversation, User } from "../../types";
import { DateTimeFormat } from "../../lib/utils";
import { BadgeInfo, Phone, Search, Video } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between p-2 border-b border-base-300">
      {/* left */}
      <div className="flex items-start gap-2">
        {!selectedConversation?.isGroup && (
          <img
            src={
              selectedConversation?.members.find(
                (member) => member._id !== user?._id
              )?.profilePic || "/avatar.png"
            }
            alt="profile"
            className="size-12 rounded-full"
          />
        )}
        <div>
          <h3 className="text-sm font-semibold">
            {
              selectedConversation?.members.find(
                (member) => member._id !== user?._id
              )?.name
            }
          </h3>

          <span className="text-xs">
            Last seen{" "}
            {DateTimeFormat(selectedConversation?.updatedAt as string)}
          </span>
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
