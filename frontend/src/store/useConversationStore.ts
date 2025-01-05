import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Conversation, MessageResponse } from "../types";

interface iConversationStore {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isFetchingConversations: boolean;
  fetchConversations: () => Promise<void>;
  setSelectedConversation: (conversation: Conversation) => void;
  messages: MessageResponse[];
  isFetchingMessages: boolean;
  fetchMessages: (conversationId: string) => Promise<void>;
}

export const useConversationStore = create<iConversationStore>((set) => ({
  conversations: [],
  selectedConversation: null,
  isFetchingConversations: false,
  messages: [],
  isFetchingMessages: false,

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
}));
