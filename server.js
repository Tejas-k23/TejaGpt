import express from "express";
import "dotenv/config";
import OpenAI from "openai";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from"mongoose";
import chatRoutes from "./Routes/chat.js";
import cors from "cors";

app.use(cors({
  origin: "https://tejagptfrontend.onrender.com/" 
}));


const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8080;


app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
  connectDB();
});
app.use("/api",chatRoutes)
// app.post("/test",async(req,res)=>{
  
// })
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("conected to the MongoDb Atlas");
    }catch(err){
        console.log("Failed to conect",err);
    }
}