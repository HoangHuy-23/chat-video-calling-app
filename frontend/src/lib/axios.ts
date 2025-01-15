import axios from "axios";

const baseURL = "https://chat-video-calling-app-be.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
