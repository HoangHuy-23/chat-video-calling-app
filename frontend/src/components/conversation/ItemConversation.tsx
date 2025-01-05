import { Conversation, User } from "../../types";
import { DateTimeFormat } from "../../lib/utils";
import { useConversationStore } from "../../store/useConversationStore";

interface ItemConversationProps {
  user: User;
  conversation: Conversation;
}

function ItemConversation({ conversation, user }: ItemConversationProps) {
  const { selectedConversation } = useConversationStore();

  const handleClick = () => {
    if (selectedConversation?._id === conversation._id) return;
    useConversationStore.setState({ selectedConversation: conversation });
  };
  return (
    <div
      key={conversation._id}
      className="flex items-start justify-between py-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        {!conversation.isGroup && (
          <img
            src={
              conversation.members.find((member) => member._id !== user._id)
                ?.profilePic || "/avatar.png"
            }
            alt="profile"
            className="w-10 h-10 rounded-full"
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
          <p className="text-xs text-base-content mt-1">Helloo</p>
        </div>
      </div>
      <span className="text-xs">
        {DateTimeFormat(conversation.timeOfNewMessage)}
      </span>
    </div>
  );
}

export default ItemConversation;
