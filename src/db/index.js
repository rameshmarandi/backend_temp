import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected Successfully  !! Host :${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("DB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
