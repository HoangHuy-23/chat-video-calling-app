import { Bell, UserPlus, Users } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useConversationStore } from "../../store/useConversationStore";

interface RightBarConversationProps {
  isOpenRightBar: boolean;
}

function RightBarConversation({ isOpenRightBar }: RightBarConversationProps) {
  const { selectedConversation } = useConversationStore();
  const { user } = useAuthStore();

  const recipient = selectedConversation?.members.find(
    (member) => member._id !== user?._id
  );

  return (
    <div
      className={`${
        isOpenRightBar ? "col-span-2" : "hidden"
      } border-l border-base-300`}
    >
      {/* header */}
      <div className="w-full flex items-center justify-center p-5 border-b border-base-300">
        <h1 className="text-base font-bold">
          {selectedConversation?.isGroup ? "Group Info" : "Conversation Info"}
        </h1>
      </div>
      {/* body */}
      <div className="w-full h-[calc(100vh-6rem)] overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-4">
          {selectedConversation?.isGroup ? (
            <img
              src={selectedConversation?.profilePic || "/avatar.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
          ) : (
            <img
              src={recipient?.profilePic || "/avatar.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
          )}

          <div>
            <h1 className="text-lg font-bold">
              {selectedConversation?.isGroup
                ? selectedConversation?.name
                : recipient?.name}
            </h1>
          </div>
        </div>
        {/* button */}
        <div className="mt-4 flex justify-evenly items-start">
          <div className="flex flex-col items-center gap-2">
            <button className="bg-base-300 rounded-full size-8 flex justify-center items-center">
              <Bell className="size-4 text-base-content" />
            </button>
            <span className="text-base-content text-sm">Mute</span>
          </div>
          {selectedConversation?.isGroup ? (
            <>
              {/* create group */}
              <div className="flex flex-col items-center gap-2">
                <button className="bg-base-300 rounded-full size-8 flex justify-center items-center">
                  <UserPlus className="size-4 text-base-content" />
                </button>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base-content text-sm">Add</span>
                  <span className="text-base-content text-sm">member</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* create group */}
              <div className="flex flex-col items-center gap-2">
                <button className="bg-base-300 rounded-full size-8 flex justify-center items-center">
                  <Users className="size-4 text-base-content" />
                </button>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base-content text-sm">Create</span>
                  <span className="text-base-content text-sm">group</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightBarConversation;
