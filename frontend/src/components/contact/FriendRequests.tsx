import { useEffect } from "react";
import ContactHeader from "./ContactHeader";
import { UserCheck } from "lucide-react";
import { useFriendRequestStore } from "../../store/useFriendRequestStore";

function FriendRequests() {
  const {
    friendRequests,
    fetchFriendRequests,
    subscribeToFriendRequest,
    unsubscribeFromFriendRequest,
    acceptFriendRequest,
  } = useFriendRequestStore();

  // useEffect(() => {
  //   fetchFriendRequests();
  // }, []);

  useEffect(() => {
    fetchFriendRequests();
    subscribeToFriendRequest();
    return () => {
      unsubscribeFromFriendRequest();
    };
  }, [
    fetchFriendRequests,
    subscribeToFriendRequest,
    unsubscribeFromFriendRequest,
  ]);

  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequest(requestId);
  };

  return (
    <div className="w-full h-full">
      {/* header */}
      <ContactHeader
        title="Friend Requests"
        icon={<UserCheck className="size-7" />}
      />
      <div className="w-full h-[calc(100vh-6rem)] bg-base-200 p-4 overflow-y-auto">
        <span>Requests({friendRequests?.length})</span>
        {/* container */}
        <div className="w-full rounded-md bg-base-100 p-4 mt-4">
          {/* search
          <div>
            <input
              type="text"
              placeholder="Search"
              className="w-full p-1 bg-base-100 rounded-md outline-primary"
            />
          </div> */}
          {/* list contact */}
          {friendRequests?.length === 0 && (
            <div className="text-base-content">No friend requests</div>
          )}
          <div>
            {friendRequests?.map((request) => (
              <div
                className="flex items-center justify-between gap-4 mt-4 border-b border-base-300 pb-1"
                key={request._id}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={request.senderId.profilePic || "/avatar.png"}
                    alt={request.senderId.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-medium">
                      {request.senderId.name}
                    </h2>
                    <span className="text-base-content">
                      {request.senderId.email}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAcceptRequest(request._id)}
                  >
                    Accept
                  </button>
                  <button className="btn btn-warning">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendRequests;
