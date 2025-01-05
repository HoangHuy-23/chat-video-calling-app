import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { dataLogin, dataRegister } from "../types";
import toast from "react-hot-toast";
import axios from "axios";

interface iAuthStore {
  user: any;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  register: (data: dataRegister) => Promise<void>;
  login: (data: dataLogin) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<iAuthStore>((set) => ({
  user: null,
  isRegistering: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ user: response.data });
    } catch (error) {
      console.error("Failed to check auth:", error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (data: dataRegister) => {
    try {
      set({ isRegistering: true });
      const response = await axiosInstance.post("/auth/register", data);
      set({ user: response.data });
      toast.success("Registered successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (data: dataLogin) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/auth/login", data);
      set({ user: response.data });
      toast.success("Logged in successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out");
    }
  },
}));
