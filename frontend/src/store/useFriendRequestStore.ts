import { create } from "zustand";
import { FriendRequest } from "../types";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

interface iFriendRequestStore {
  friendRequests: FriendRequest[];
  isFetchingFriendRequests: boolean;
  fetchFriendRequests: () => Promise<void>;
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  subscribeToFriendRequest: () => void;
  unsubscribeFromFriendRequest: () => void;
}

export const useFriendRequestStore = create<iFriendRequestStore>(
  (set, get) => ({
    friendRequests: [],
    isFetchingFriendRequests: false,

    fetchFriendRequests: async () => {
      try {
        set({ isFetchingFriendRequests: true });
        const response = await axiosInstance.get("/friend-request");
        set({ friendRequests: response.data });
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
      } finally {
        set({ isFetchingFriendRequests: false });
      }
    },

    sendFriendRequest: async (receiverId) => {
      try {
        const response = await axiosInstance.post(`/friend-request`, {
          receiverId,
        });
        // todo: send friend request to socket
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.emit("sendFriendRequest", response.data);
        toast.success("Friend request sent");
      } catch (error) {
        toast.error("Failed to send friend request");
      }
    },
    acceptFriendRequest: async (requestId) => {
      try {
        const response = await axiosInstance.post(`/friend-request/accept`, {
          requestId,
        });
        toast.success("Friend request accepted");
        if (response.data) {
          set((state) => ({
            friendRequests: state.friendRequests.filter(
              (request) => request._id !== requestId
            ),
          }));
        }
      } catch (error) {
        toast.error("Failed to accept friend request");
      }
    },
    subscribeToFriendRequest: () => {
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      socket.on("getFriendRequest", (data) => {
        toast.success("New friend request");
        console.log(data);

        set((state) => ({
          friendRequests: [...state.friendRequests, data],
        }));

        console.log("Friend request received: ", get().friendRequests);
      });
    },
    unsubscribeFromFriendRequest: () => {
      // Unsubscribe from friend request
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      socket.off("getFriendRequest");
    },
  })
);
