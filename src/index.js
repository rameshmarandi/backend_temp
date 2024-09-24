import mongoose from "mongoose";

import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({path :"./env"});
connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error("DB connection error", err);
})











// First Approach
/*
const app = express();
import express from "express";

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("error", (error) => {
            console.error("Express not able to connect with DB", error);
            throw error
        })
        app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
    } catch (error) {
        console.error("DB connection error", error);
        throw error
    }
})()

*/