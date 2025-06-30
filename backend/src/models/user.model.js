import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname:{
    type:String,
    required:true,
    trim:true //Automatically remove extra spaces from strings
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  profilePic:{
    type:String,
    default:""
  }
},{timestamps:true})

const User = mongoose.model('User',userSchema);
export default User;