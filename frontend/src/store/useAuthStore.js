import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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


export const useAuthStore = create((set) => ({ //this objec
  authUser: null,        // initially null
  isSigningUp:false,
  isLoggingIn:false,
   isUpdatingProfile:false,
  isCheckingAuth: true,  // initially true

  checkAuth: async() => {
    try {
      const res= await axiosInstance.get('/auth/check')
      set({authUser:res.data})
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
       await axiosInstance.post('/auth/logout')
       set({authUser:null});
       toast.success("Logged Out Successfully");
    } 
    catch (error) {
       console.log(error);
       toast.error(error.response.data.message);
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
  }
}));
