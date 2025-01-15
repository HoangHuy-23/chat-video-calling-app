import { useEffect } from "react";
import { useContactStore } from "../../store/useContactStore";
import ContactHeader from "./ContactHeader";
import { LayoutList } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

function FriendsList() {
  const { myContacts, fetchMyContacts } = useContactStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchMyContacts();
  }, [user]);
  return (
    <div className="w-full h-full">
      {/* header */}
      <ContactHeader
        title="Friends list"
        icon={<LayoutList className="size-7" />}
      />
      <div className="w-full h-[calc(100vh-6rem)] bg-base-200 p-4 overflow-y-auto">
        <span>Contacts({myContacts?.contacts.length})</span>
        {/* container */}
        <div className="w-full rounded-md bg-base-100 p-4 mt-4">
          {/* search */}
          <div>
            <input
              type="text"
              placeholder="Search"
              className="w-full p-1 bg-base-100 rounded-md outline-primary"
            />
          </div>
          {/* list contact */}
          <div>
            {myContacts?.contacts.map((contact) => (
              <div
                className="flex items-center gap-4 mt-4 border-b border-base-300 pb-1"
                key={contact._id}
              >
                <img
                  src={contact.userId.profilePic || "/avatar.png"}
                  alt={contact.userId.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-medium">{contact.userId.name}</h2>
                  <span className="text-base-content">
                    {contact.userId.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
