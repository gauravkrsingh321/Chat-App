import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"http://localhost:3000/api",
  withCredentials:true //send cookies in every request from client to server
})