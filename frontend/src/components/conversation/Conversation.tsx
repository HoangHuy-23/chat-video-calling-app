// import { useConversationStore } from "../../store/useConversationStore";
// import ConversationContainer from "./ConversationContainer";
import ConversationSidebar from "./ConversationSidebar";
// delete
function Conversation() {
  // const { selectedConversation } = useConversationStore();
  return (
    <div className="flex flex-grow h-screen">
      {/* side left */}
      <ConversationSidebar />
      {/* container */}
      {/* {selectedConversation ? (
        <ConversationContainer />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-center">
            Open a conversation to start chat
          </h1>
        </div>
      )} */}
    </div>
  );
}

export default Conversation;
