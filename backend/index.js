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

app.use(express.json({ limit: '10mb' }));//Handles Content-Type: application/json. Parses JSON payloads (like API requests with JSON bodies)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); //Handles Content-Type: application/x-www-form-urlencoded. Used when HTML forms are submitted (default form encoding)
// Why You Need Both
// If you're building a REST API where the frontend sends JSON, express.json() is enough.
// If you also accept data from HTML forms (e.g. login forms, file uploads), you need express.urlencoded().

app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)

//Database connection
connectToDB()

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})