import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
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
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
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
      type: [[Number]], // Array to store the user's face embedding vector
      required: false,
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
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    resetPasswordOTP: {
      type: String, // OTP for password reset
      select: false,
    },
    resetPasswordOTPExpires: {
      type: Date, // OTP expiration time
      select: false,
    },
    votedFor: {
      type: String, 
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
function arrayLimit(val) {
  return val.length > 0 && val.length <= 3;
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcryptjs.hashSync(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcryptjs.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


export const User = mongoose.model("User", userSchema);
