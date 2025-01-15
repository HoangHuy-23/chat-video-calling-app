import axios from "axios";

const baseURL = process.env.API_URL + "/api" || "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
