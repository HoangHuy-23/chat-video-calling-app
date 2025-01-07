import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import ConversationContainer from "../components/conversation/ConversationContainer";
import { useConversationStore } from "../store/useConversationStore";
import SearchUser from "../components/SearchUser";
import ListConversations from "../components/conversation/ListConversations";
import SidebarContact from "../components/contact/SidebarContact";
import FriendsList from "../components/contact/FriendsList";
import FriendRequests from "../components/contact/FriendRequests";
import JoinedGroups from "../components/contact/JoinedGroups";
import SearchResult from "../components/SearchResult";
import { X } from "lucide-react";
import AddNewFriend from "../components/AddNewFriend";

function HomePage() {
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(true);
  const [showContacts, setShowContacts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { selectedConversation } = useConversationStore();

  // search user
  const [isOpenSearchResult, setIsOpenSearchResult] = useState(false);

  //contact props
  const [showMyFriends, setShowMyFriends] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  // show layout add new friend
  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    if (showContacts) {
      setShowMyFriends(true);
      setShowRequests(false);
      setShowGroup(false);
    } else {
      setShowMyFriends(false);
      setShowRequests(false);
      setShowGroup(false);
    }
  }, [showChat, showContacts, showSettings]);
  return (
    <div className="flex w-full h-screen bg-base-100">
      <>
        {/* navbar */}
        <Navbar
          showChat={showChat}
          setShowChat={setShowChat}
          showContacts={showContacts}
          setShowContacts={setShowContacts}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
        {/* body */}
        <div className="flex flex-grow flex-col h-screen">
          {/* header app */}
          <div className="h-6 w-full border-b border-base-300 bg-base-300">
            <span className="text-xs ml-2">Chat App - {user?.name}</span>
          </div>
          {/* body app */}
          <div className="flex flex-grow h-screen">
            {/* side bar */}
            <div className="w-72 lg:w-96 border-r border-base-300 flex flex-col transition-all duration-200 ">
              {/* search */}
              <SearchUser
                isOpenSearchResult={isOpenSearchResult}
                setIsOpenSearchResult={setIsOpenSearchResult}
                setShowAddFriend={setShowAddFriend}
              />
              {/* List conversation */}

              {showChat && !isOpenSearchResult && <ListConversations />}
              {showContacts && !isOpenSearchResult && (
                <SidebarContact
                  showMyFriends={showMyFriends}
                  setShowMyFriends={setShowMyFriends}
                  showRequests={showRequests}
                  setShowRequests={setShowRequests}
                  showGroup={showGroup}
                  setShowGroup={setShowGroup}
                />
              )}

              {/* search result */}
              {isOpenSearchResult && <SearchResult />}
            </div>
            {/* container */}
            {selectedConversation ? (
              <ConversationContainer />
            ) : (
              <>
                {showChat && (
                  <div className="flex-1 flex items-center justify-center">
                    <h1 className="text-2xl font-semibold text-center">
                      Open a conversation to start chat
                    </h1>
                  </div>
                )}
              </>
            )}
            {/* contact */}
            {showMyFriends && <FriendsList />}
            {showRequests && <FriendRequests />}
            {showGroup && <JoinedGroups />}
          </div>
        </div>
      </>
      {/* layout add new friend */}
      <AddNewFriend
        showAddFriend={showAddFriend}
        setShowAddFriend={setShowAddFriend}
      />
    </div>
  );
}

export default HomePage;
