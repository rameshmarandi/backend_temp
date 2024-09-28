import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      require: true,
      index: true, // Optimized way to search in DB
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      require: true,
    },
    fullName: {
      type: String,
      require: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //  Cloudary URL
    },
    coverImage: {
      type: String, //  Cloudary URL
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {

 try {
    return jwt.sign(
     {
       _id: this._id,
       email: this.email,
       fullName: this.fullName,
       username: this.username,
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
     }
   );
 } catch (error) {
  throw new ApiError(500, "Something went wrong while generating access token in userSchema file");
 }
};
userSchema.methods.generateRefreshToken = async function () {
  try {
     return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh token in userSchema file");
  }
};
export const User = mongoose.model("User", userSchema);
