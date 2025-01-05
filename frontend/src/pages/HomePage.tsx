import { useState } from "react";
import Navbar from "../components/Navbar";
import Conversation from "../components/conversation/Conversation";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(true);
  const [showContacts, setShowContacts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="flex w-full h-full bg-base-100">
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
      <div className="flex flex-grow flex-col h-full">
        {/* header app */}
        <div className="h-6 w-full border-b border-base-300 bg-base-300">
          <span className="text-xs ml-2">Chat App - {user?.name}</span>
        </div>
        {showChat && <Conversation />}
        {showContacts && <div>Contacts</div>}
      </div>
    </div>
  );
}

export default HomePage;
