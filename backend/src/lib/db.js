import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database Connection Is Successful")
  } 
  catch (error) {
    console.log("Error in database connection")
    process.exit(1);
  }
}