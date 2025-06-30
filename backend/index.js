import express from "express"
import { configDotenv } from "dotenv";
import authRoutes from "./src/routes/auth.route.js"; 
import messageRoutes from "./src/routes/message.route.js"; 
import {connectToDB} from "./src/lib/db.js"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()
configDotenv() //Load .env variables into process.env
const PORT = process.env.PORT || 5000; 

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)

//Database connection
connectToDB()

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})