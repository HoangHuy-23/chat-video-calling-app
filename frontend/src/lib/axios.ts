import axios from "axios";

const baseURL = "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
