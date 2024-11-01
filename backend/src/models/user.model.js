import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Hide password in queries by default for security
    },
    authToken: {
      type: String, // For session tokens if using JWT or similar
      select: false,
    },
    images: {
      type: [String], // Array of URLs pointing to images in Cloudinary or Firebase
      required: true,
      validate: [arrayLimit, "{PATH} must have between 1 and 3 images"], // Limit to 3-4 images
    },
    embeddings: {
      type: [Number], // Array to store the user's face embedding vector
      required: true,
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
    lastRecognitionAttempt: {
      type: Date, // Tracks the last time face recognition was attempted
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
function arrayLimit(val) {
  return val.length > 0 && val.length <= 3;
}

export const User = mongoose.model("User", userSchema);
