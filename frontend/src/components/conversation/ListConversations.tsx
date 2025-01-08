import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useConversationStore } from "../../store/useConversationStore";
import ConversationSkeleton from "../skeletons/ConversationSkeleton";
import ItemConversation from "./ItemConversation";

function ListConversations() {
  const {
    conversations,
    isFetchingConversations,
    fetchConversations,
    subscribeToNotification,
    unsubscribeFromNotification,
    subscribeConversation,
    unsubscribeConversation,
  } = useConversationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    subscribeToNotification();
    subscribeConversation();
    return () => {
      unsubscribeFromNotification();
      unsubscribeConversation();
    };
  }, [
    subscribeToNotification,
    unsubscribeFromNotification,
    conversations,
    subscribeConversation,
    unsubscribeConversation,
  ]);
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex px-4 justify-between items-center border-b border-base-300">
        <div className="flex items-center gap-2 ">
          <span className="text-xs border-b-2 border-primary">All</span>
          <span className="text-xs">Unread</span>
        </div>
      </div>
      {/* list */}
      <div className="px-4 overflow-y-auto">
        {isFetchingConversations ? (
          <ConversationSkeleton />
        ) : (
          <>
            {conversations.length > 0 ? (
              conversations?.map((conversation) => (
                <ItemConversation
                  key={conversation._id}
                  conversation={conversation}
                  user={user!}
                />
              ))
            ) : (
              <p className="text-center mt-4">No conversations found</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ListConversations;
