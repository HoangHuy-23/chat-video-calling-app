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
        {conversation.isGroup && (
          <img
            src={conversation.profilePic || "/avatar.png"}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          {!conversation.isGroup && (
            <h3 className="text-sm font-semibold">
              {
                conversation?.members.find((member) => member._id !== user?._id)
                  ?.name
              }
            </h3>
          )}
          {conversation.isGroup && (
            <h3 className="text-sm font-semibold">{conversation.name}</h3>
          )}
          {!conversation.isGroup && (
            <p className="text-xs text-base-content mt-1">
              {" "}
              {conversation.lastMessage.senderId === user._id ? "You: " : ""}
              {conversation.lastMessage.content}
            </p>
          )}
          {conversation.isGroup && (
            <p className="text-xs text-base-content mt-1">
              {conversation.lastMessage.senderId === user._id
                ? "You: "
                : conversation?.members.find(
                    (member) => member._id == conversation.lastMessage.senderId
                  )?.name + ": "}
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
      </div>
      <span className="text-xs">{DateTimeFormat(conversation.updatedAt)}</span>
    </div>
  );
}

export default ItemConversation;
