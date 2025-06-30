import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

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

export const useAuthStore = create((set) => ({ //this objec
  authUser: null,        // initially null
  isSignUp:false,
  isLogin:false,
  isUpdateProfile:false,
  isCheckingAuth: true,  // initially true

  checkAuth: async() => {
    try {
      const res= axiosInstance.get('/auth/check')
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

  signup: async(data) => {
    
  }
}));
