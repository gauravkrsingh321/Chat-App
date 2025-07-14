import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

//Explanation:
// Zustand expects a function that returns an object, so use (...) => ({ ... }) to return the initial state.
// set (not setter) is conventional, and used to update the state.
// 1. authUser: null
// Purpose: This stores the currently authenticated user.
// Initially set to null because no user is logged in when the app starts.
// Example use case: Once you fetch the user data (e.g., after verifying a token), you update it to something like:
// { name: "Gaurav", email: "gaurav@example.com" }
// 2. isCheckingAuth: true
// Purpose: This flag tracks whether your app is still checking if the user is authenticated.
// Initially set to true because when the app loads, it may need to check local storage or make an API call to verify the user's session.
// Once checking is done, you set it to false — no matter whether the user is logged in or not.
// Example Scenario:
//(1) App loads:
// authUser = null
// isCheckingAuth = true
//(2) App checks localStorage or API:
// If user is found:
// authUser = { id: 1, name: "Gaurav" }
// isCheckingAuth = false
// If user is not found or token is invalid:
// authUser = null
// isCheckingAuth = false


//authUser is a state variable in your Zustand store that holds information about the currently logged-in user.
//Example: authUser = {
//   id: "123",
//   name: "Gaurav",
//   email: "gaurav@example.com",
//   token: "..." // if returned from backend
// }
// ❌ DO NOT send res.cookie('token', token) in signup controller
// res.status(201).json({ message: "User created" }); // no login behavior
// Why? Because checkAuth() will automatically detect the cookie and set authUser, which is what you don't want after signup.

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set,get) => ({ //this objec
  authUser: null,        // initially null
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth: true,  // initially true
  onlineUsers:[],
  socket:null,

  checkAuth: async() => {
    try {
      const res= await axiosInstance.get('/auth/check')
      console.log("✅ checkAuth success", res.data);
      set({authUser:res.data})
      get().connectSocket(); //If you are authenticated that means we are logged in that means we should conenct to socket
    } 
    catch(error) {
      set({authUser:null})
      console.log(error)
    }
    finally{
      set({isCheckingAuth:false})
    }
  },

  signup: async(formdata,navigate) => {
      set({ isSigningUp: true });
    try {
      await axiosInstance.post('/auth/signup',formdata);
      toast.success("Account Created Successfully");
      // ❌ do NOT set authUser here if you want login page after signup and want to avoid auto login after signup
      //👇Redirect to login after signup
      navigate("/login");
    } 
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
    finally{
       set({ isSigningUp: false });
    }
  },

  login: async(formdata) => {
    set({isLoggingIn:true})
    try {
       const res = await axiosInstance.post('/auth/login',formdata)
       set({authUser:res.data});
       toast.success("Logged In Successfully");
       get().connectSocket() //After login we want to connect to socket immediately so that we are online
    } 
    catch(error) {
      console.log(error);
       toast.error(error.response.data.message)
    }
    finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async()=>{
    try {
       const socket = get().socket;
    const userId = get().authUser?._id;

    if (socket?.connected) {
      socket.emit("manual-disconnect", userId); // Custom event
      get().disconnectSocket();
    }

       await axiosInstance.post('/auth/logout')
       set({authUser:null});
       toast.success("Logged Out Successfully");
       
    } 
    catch (error) {
       console.log(error);
        // Safe fallback for any kind of error
  const message =
    error?.response?.data?.message || error?.message || "Logout failed";

  toast.error(message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile:true});
    try {
      const res = await axiosInstance.put("/auth/update-profile",data);
      console.log(res)
      set({authUser:res.data});
      toast.success("Profile Updated Successfully");
    } 
    catch (error) {
      console.log(error);
      toast.error("Error in updating profile")
    }
    finally {
    set({ isUpdatingProfile:false});
    }
  },

  connectSocket: ()=> {
    const {authUser} = get();
    //If user is not authenticated or already connected so return
    if(!authUser || get().socket?.connected) return;
    //Otherwise connect new connection for this user
    const socket = io(BASE_URL, {
      query:{
        userId: authUser._id,
      }
    });
    socket.connect();
    set({socket:socket})

    //now listen for online user updates
    socket.on("getOnlineUsers", (userIds)=>{
      set({onlineUsers: userIds})
    })
  },


  disconnectSocket: ()=> {
    //If you are connected then disconnect
    const socket = get().socket;
    if(socket?.connected) {
    socket.disconnect();
    console.log("disconnected bc");
  } else {
    console.log("Socket was already disconnected or null");
  } 
  }
}));
