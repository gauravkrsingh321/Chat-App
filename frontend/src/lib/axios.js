import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
  withCredentials:true //send cookies in every request from client to server
})