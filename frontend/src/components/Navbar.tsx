import {
  Contact,
  MessageSquare,
  Settings,
  Settings2,
  User2,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useConversationStore } from "../store/useConversationStore";

interface NavbarProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  showContacts: boolean;
  setShowContacts: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

function Navbar({
  showChat,
  setShowChat,
  showContacts,
  setShowContacts,
  showSettings,
  setShowSettings,
}: NavbarProps) {
  const { user, logout } = useAuthStore();
  const { setSelectedConversation } = useConversationStore();
  return (
    <header className="bg-primary top-0 left-0 h-full w-[70px] backdrop-blur-lg bg-base-100/80">
      <div className="flex flex-col items-center justify-between h-full py-8">
        {/* top */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.profilePic || "/avatar.png"}
            alt="avatar"
            className="size-12 rounded-full"
          />
          {/* chat */}
          <div
            className={`flex items-center justify-center size-12 rounded-md hover:bg-primary-content/30 cursor-pointer mt-8 ${
              showChat ? "bg-primary-content/30" : ""
            }`}
            onClick={() => {
              setShowChat(true);
              setShowContacts(false);
              setShowSettings(false);
            }}
          >
            <MessageSquare className="size-8 text-base-100" />
          </div>
          {/* contacts */}
          <div
            className={`flex items-center justify-center size-12 rounded-md hover:bg-primary-content/30 cursor-pointer ${
              showContacts ? "bg-primary-content/30" : ""
            }`}
            onClick={() => {
              setShowContacts(true);
              setShowChat(false);
              setShowSettings(false);
              setSelectedConversation(null);
            }}
          >
            <Contact className="size-8 text-base-100" />
          </div>
        </div>
        {/* bottom */}
        <div className="flex flex-col items-center relative">
          <div
            className={`flex items-center justify-center size-12 rounded-md hover:bg-primary-content/30 cursor-pointer ${
              showSettings ? "bg-primary-content/30" : ""
            }`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="size-8 text-base-100" />
          </div>
          {showSettings && (
            <div className="absolute flex flex-col gap-2 bottom-12 left-0 mt-12 w-52 bg-base-100 rounded-md shadow-lg p-4">
              <div className="flex items-center gap-2 cursor-pointer">
                <User2 className="size-4 text-base-content" />
                <span className="ml-2 text-sm">Account Information</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings2 className="size-4 text-base-content cursor-pointer" />
                <span className="ml-2 text-sm">Settings</span>
              </div>
              {/* separator */}
              <div className="h-[1px] bg-base-content/20 my-2" />
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={logout}
              >
                <span className="text-red-500 text-sm ml-8">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
