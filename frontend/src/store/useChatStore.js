import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios"
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=> ({
  messages:[], //Initially
  users:[], //Initially
  selectedUser: null, //Initially
  isUsersLoading: false,  //Initially
  isMessagesLoading: false, //Initially

  getUsers: async()=>{
    set({isUsersLoading:true});
    try {
      const res = await axiosInstance.get('/messages/users');
      console.log("Users from backend:", res.data);
      set({users:res.data});
      // toast.success("Fetched all users");
    } 
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
    finally{
      set({isUsersLoading:false})
    }
  },

  getMessages: async (userId)=>{  //we need to pass userId so that we know which chat that we are trying to fetch 
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

 sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: ()=> {
    const {selectedUser} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage)=>{
      set({messages:[...get().messages,newMessage]})
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  //todo: optimize this one later
  setSelectedUser: (selectedUser)=> set({selectedUser})
}))