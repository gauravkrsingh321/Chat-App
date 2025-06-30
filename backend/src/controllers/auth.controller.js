import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {
  const {fullname,email,password} = req.body;
  try {
    if(!fullname || !email || !password) {
      return res.status(400).json({message:"Please enter all details"})
    }
    //This check ensures the raw password meets your minimum length requirement before you turn it into a long, meaningless hashed string
    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({message:"User already exists"})
    }
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    //create new user
    const newUser = await User.create({fullname,email,password:hashedPassword});

    if(newUser) {
      //generate jwt token here
      generateToken(newUser._id,res);
      await newUser.save();
      return res.status(201).json({
      message: "User registered successfully",
      userDetails: newUser,
      profilePic: newUser.profilePic
      });
    } else {
      res.status(400).json({message:"Invalid user data"})
    }
  } 
  catch (error) {
    console.log(error.message)
    res.status(500).json({message:"Internal Server Error while signing up"})
  }
}

export const login = async (req,res) => {
  const {email,password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:"Invalid credentials"});

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

    generateToken(user._id,res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } 
  catch (error) {
    console.log(error.message)
    res.status(500).json({message:"Internal Server Error while logging"})
  }
}

export const logout = (req,res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"})
  } 
  catch (error) {
    console.log(error.message)
    res.status(500).json({message:"Internal Server Error while logging out"})
  }
}

export const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic) {
      return res.status(401).json({message:"Profile Pic Is Required"}) 
    }
    //profile pic is present so upload it to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    //now update profile pic for this user in db
    //🔍 Why new: true in findByIdAndUpdate?
// By default, Mongoose’s findByIdAndUpdate() returns the original (old) document — the one before the update.
// ✅ What new: true does:
// It tells Mongoose: “Hey, return the updated document instead of the old one.”
    const updatedUser = await User.findByIdAndUpdate(userId,
      {profilePic:uploadResponse.secure_url},
      {new:true})
    res.staus(200).json(updatedUser)  
  } 
  catch (error) {
    console.log(error.message)
    res.status(500).json({message:"Internal Server Error while updating profile"})
  }
}

export const checkAuth = (req,res) => {
  try {
    res.status(200).json(req.user)
  } 
  catch (error) {
    console.log("Error in checkAuth controller",error.message)
    res.status(500).json({message:"Internal Server Error"})
  }
}