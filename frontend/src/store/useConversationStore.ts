import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Conversation, MessageResponse, User } from "../types";
import { useAuthStore } from "./useAuthStore";

interface iConversationStore {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isFetchingConversations: boolean;
  fetchConversations: () => Promise<void>;
  setSelectedConversation: (conversation: Conversation | null) => void;
  messages: MessageResponse[];
  isFetchingMessages: boolean;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  subscribeToMessage: () => void;
  unsubscribeFromMessage: () => void;
  subscribeToNotification: () => void;
  unsubscribeFromNotification: () => void;
  membersCreateGroup: User[];
  addMemberCreateGroup: (member: User) => void;
  removeMemberCreateGroup: (member: User) => void;
  createConversationAsGroup: (
    name: string,
    profilePic: string,
    members: string[]
  ) => Promise<void>;
  subscribeConversation: () => void;
  unsubscribeConversation: () => void;
}

export const useConversationStore = create<iConversationStore>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  isFetchingConversations: false,
  messages: [],
  isFetchingMessages: false,
  membersCreateGroup: [],

  fetchConversations: async () => {
    try {
      set({ isFetchingConversations: true });
      const response = await axiosInstance.get("conversation/my-conversation");
      set({ conversations: response.data });
      // Fetch conversations
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast.error("Failed to fetch conversations");
    } finally {
      set({ isFetchingConversations: false });
    }
  },
  setSelectedConversation: (conversation) => {
    set({ selectedConversation: conversation });
  },

  fetchMessages: async (conversationId) => {
    try {
      set({ isFetchingMessages: true });
      const response = await axiosInstance.get(`message/${conversationId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isFetchingMessages: false });
    }
  },

  sendMessage: async (message) => {
    try {
      const conversationId = get().selectedConversation?._id;
      if (!conversationId) {
        console.error("No conversation selected");
        toast.error("No conversation selected");
        return;
      }
      const response = await axiosInstance.post("message", {
        conversationId: conversationId,
        content: message,
      });
      set((state) => ({ messages: [...state.messages, response.data] }));

      // todo: send message to socket
      const socket = useAuthStore.getState().socket;
      const userId = useAuthStore.getState().user?._id;
      const messageSend = response.data;
      if (!socket) return;
      socket.emit("sendMessage", {
        senderId: userId,
        conversationId,
        message: messageSend,
      });

      // todo: send notification to socket
      socket.emit("sendNotification", {
        conversationId,
        lastMessage: {
          content: messageSend.content,
          senderId: messageSend.senderId._id,
        },
        updatedAt: messageSend.createdAt,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  },
  // Add member to create group
  addMemberCreateGroup: (member) => {
    set((state) => ({
      membersCreateGroup: [...state.membersCreateGroup, member],
    }));
  },
  // Remove member from create group
  removeMemberCreateGroup: (member) => {
    set((state) => ({
      membersCreateGroup: state.membersCreateGroup.filter(
        (m) => m._id !== member._id
      ),
    }));
  },

  // Create a conversation as a group
  createConversationAsGroup: async (name, profilePic, members) => {
    try {
      const response = await axiosInstance.post("conversation/create-group", {
        name,
        profilePic,
        members,
      });
      if (!response.data) return;
      // todo: send conversation to socket
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      socket.emit("newGroup", response.data);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create conversation");
    }
  },

  subscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("getMessage", (message) => {
      console.log("Received message:", message);
      if (message.conversationId === get().selectedConversation?._id) {
        set({
          messages: [...get().messages, message],
        });
      }
    });
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("getMessage");
  },

  subscribeToNotification: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("getNotification", (notification) => {
      console.log("Received notification:", notification);

      const conversationId = notification.conversationId;
      const conversations = get().conversations;

      // Find the index of the conversation
      const conversationIndex = conversations.findIndex(
        (conversation) => conversation._id === conversationId
      );

      if (conversationIndex === -1) return;

      // Create a copy of the conversation with updated properties
      const updatedConversation = {
        ...conversations[conversationIndex],
        lastMessage: {
          content: notification.lastMessage.content,
          senderId: notification.lastMessage.senderId,
        },
        updatedAt: notification.updatedAt,
      };

      // Update the conversations array immutably
      const updatedConversations = [
        ...conversations.slice(0, conversationIndex),
        updatedConversation,
        ...conversations.slice(conversationIndex + 1),
      ];

      updatedConversations.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      // Set the updated state
      set({ conversations: updatedConversations });
    });
  },

  unsubscribeFromNotification: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("getNotification");
  },

  subscribeConversation: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("getNewGroup", (conversation) => {
      console.log("Received conversation:", conversation);
      set((state) => ({
        conversations: [...state.conversations, conversation],
      }));
    });
  },

  unsubscribeConversation: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("getNewGroup");
  },
}));
