import { useEffect, useState } from "react";
import RightBarConversation from "./RightBarConversation";
import HeaderConversation from "./HeaderConversation";
import { useConversationStore } from "../../store/useConversationStore";
import { useAuthStore } from "../../store/useAuthStore";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../../lib/utils";

function ConversationContainer() {
  const [isOpenRightBar, setIsOpenRightBar] = useState(false);
  const { selectedConversation, messages, isFetchingMessages, fetchMessages } =
    useConversationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  if (isFetchingMessages) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full grid grid-cols-7">
        <div
          className={`flex flex-col ${
            isOpenRightBar ? "col-span-5" : "col-span-7"
          }`}
        >
          <HeaderConversation
            isOpenRightBar={isOpenRightBar}
            setIsOpenRightBar={setIsOpenRightBar}
            selectedConversation={selectedConversation}
            user={user}
          />
          <div className="h-[calc(100vh-10rem)] overflow-y-auto">
            <MessageSkeleton />
          </div>
          <MessageInput />
        </div>
        <RightBarConversation isOpenRightBar={isOpenRightBar} />
      </div>
    );
  }

  return (
    <div className={`h-[calc(100vh-4rem)] w-full grid grid-cols-7`}>
      <div
        className={`flex flex-col ${
          isOpenRightBar ? "col-span-5" : "col-span-7"
        }`}
      >
        <HeaderConversation
          isOpenRightBar={isOpenRightBar}
          setIsOpenRightBar={setIsOpenRightBar}
          selectedConversation={selectedConversation}
          user={user}
        />
        <div className="h-[calc(100vh-10rem)] overflow-y-auto space-y-4 p-4">
          {selectedConversation &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId._id === user._id ? "chat-end" : "chat-start"
                }`}
                // ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId._id === user._id
                          ? user.profilePic || "/avatar.png"
                          : message.senderId.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div
                  className={`chat-bubble flex flex-col ${
                    message.senderId._id === user._id
                      ? "bg-primary text-base-100"
                      : "bg-base-300 text-base-content"
                  }`}
                >
                  {message.media && (
                    <img
                      src={message.media}
                      alt="Attachment"
                      className="rounded-md sm:max-w-[200px] mb-2"
                    />
                  )}
                  {message.content && <p>{message.content}</p>}
                </div>
              </div>
            ))}
        </div>
        <MessageInput />
      </div>
      <RightBarConversation isOpenRightBar={isOpenRightBar} />
    </div>
  );
}

export default ConversationContainer;
