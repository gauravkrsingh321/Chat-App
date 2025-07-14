import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getUsersForSidebar = async (req,res)=> {
  try {
      const loggedInUserId = req.user._id;
      //Explanation: User.find({ ... }): Finds all users matching the query. { _id: { $ne: loggedInUserId } }: $ne means "not equal", so this filters out the currently logged-in user. .select("-password"): Excludes the password field from the returned documents.
      const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");
      res.status(200).json(filteredUsers)
  } 
  catch (error) {
    console.log(error.message)
    res.status(500).json({message:"Internal Server Error"}) 
  }
}

//get messages b/w two users in chronological order
export const getMessages = async (req,res)=>{
  try {
    const {id:userToChatId} = req.params; //rename for readability
    const myId = req.user._id; //currently authenticated user

    //find all the messages where I am the sender or other user is the sender or vice versa
    const messages = await Message.find({
      $or:[
        {senderId:myId, receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
      ]
    })
    res.status(200).json(messages);
  } 
  catch (error) {
    console.log("Error in getMessages controller",error.message)
    res.status(500).json({message:"Internal Server Error"}) 
  }
}

export const sendMessage = async (req,res)=>{
  try {
    const {text,image} = req.body;
    const {id:receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image){ //if user sends the image,upload it to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = await Message.create({senderId,receiverId,text,image:imageUrl});

    
    const receiverSocketId = getReceiverSocketId(receiverId);
    //If user is online then send the message,send the event in real time
    if(receiverSocketId) {
      //Since its private 1-1 chat thats why we only send it to receiver
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json(newMessage);
  } 
  catch (error) {
    console.log("Error in sendMessage controller",error.message)
    res.status(500).json({message:"Internal Server Error"}) 
  }
}