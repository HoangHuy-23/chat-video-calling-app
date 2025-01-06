import SearchUser from "../SearchUser";
import ListConversations from "./ListConversations";

function ConversationSidebar() {
  return (
    <div className="w-72 lg:w-96 border-r border-base-300 flex flex-col transition-all duration-200 ">
      <SearchUser />
      {/* List conversation */}
      <ListConversations />
    </div>
  );
}

export default ConversationSidebar;
