import { create } from "zustand";
import { MyContact } from "../types";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface iContactStore {
  myContacts: MyContact | null;
  isFetchingMyContacts: boolean;
  fetchMyContacts: () => Promise<void>;
}

export const useContactStore = create<iContactStore>((set) => ({
  myContacts: null,
  isFetchingMyContacts: false,

  fetchMyContacts: async () => {
    try {
      set({ isFetchingMyContacts: true });
      const response = await axiosInstance.get("contact");
      set({ myContacts: response.data });
    } catch (error) {
      console.error("Failed to fetch my contacts:", error);
      toast.error("Failed to fetch my contacts");
    } finally {
      set({ isFetchingMyContacts: false });
    }
  },
}));
