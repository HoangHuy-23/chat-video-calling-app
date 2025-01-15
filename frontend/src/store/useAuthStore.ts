import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { dataLogin, dataRegister, SocketUser, User } from "../types";
import toast from "react-hot-toast";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const BASE_URL = "https://chat-video-calling-app-be.onrender.com";

interface iAuthStore {
  user: User | null;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  socket: Socket | null;
  onlineUsers: SocketUser[] | null;
  checkAuth: () => Promise<void>;
  register: (data: dataRegister) => Promise<void>;
  login: (data: dataLogin) => Promise<void>;
  logout: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<iAuthStore>((set, get) => ({
  user: null,
  isRegistering: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ user: response.data });
      get().connectSocket();
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
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out");
    }
  },

  connectSocket: () => {
    const user = get().user;
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL);
    set({ socket });

    socket.on("connect", () => {
      console.log("Connected to socket server: ", socket.id);
      socket.emit("join", user);
    });

    socket.on("getOnlineUsers", (onlineUsers: SocketUser[]) => {
      console.log("Online users: ", onlineUsers);
      set({ onlineUsers });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
