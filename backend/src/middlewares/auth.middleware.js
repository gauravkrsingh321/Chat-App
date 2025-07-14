import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
  try {
      console.log("🍪 Cookies Received:", req.cookies); // <-- add this
    //extract token from request body
    const token = req.cookies.jwt;
    // console.log("Received token:", token);
    if(!token) { //if token not available
      return res.status(401).json({message:" Unathourized - Token Missing"}) 
    }

   //verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)  
    if(!decodedToken) {
      return res.status(401).json({ message:" Unathourized - Invalid Token"}) 
    }
    const user = await User.findById(decodedToken.userId).select('-password'); //de-select password because we dont want it to send it to client which will be not secure if sent i.e. .select('-password') excludes the password field from the returned user object for security.
    if(!user) return res.status(401).json({message:"User not found"}) 
    req.user = user;
    next();
  } 
  catch (error) {
    console.log("Error in protectRoute middleware: ",error.message);
    return res.status(401).json({
      message:"Something went wrong while verifying the token"
    })
  }
}