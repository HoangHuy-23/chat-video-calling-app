import { create } from "zustand";
import { User } from "../types";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface iUserStore {
  searchResult: User[] | [];
  userSelected: User | null;
  setUserSelected: (user: User | null) => void;
  searchUser: (keyword: string) => void;
}

const useUserStore = create<iUserStore>((set) => ({
  searchResult: [],
  userSelected: null,
  setUserSelected: (user) => set({ userSelected: user }),
  searchUser: async (keyword) => {
    try {
      const response = await axiosInstance.get(
        `/user/search?keyword=${keyword}`
      );
      set({ searchResult: response.data });
    } catch (error) {
      toast.error("Failed to search user");
    }
  },
}));

export default useUserStore;
