import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const signup = async (req, res, next) => {
  const { username, email, password, fullname } = req.body;
  const files = req.files;

  // Validate required fields
  if (
    !username ||
    !email ||
    !password ||
    !fullname ||
    !files ||
    files.length === 0
  ) {
    return next(errorHandler(400, "All fields are required"));
  }
  if (password.length < 8) {
    return next(errorHandler(400, "Password must be at least 8 characters long"));
  }

  // Check if email or username is already taken
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      return next(errorHandler(400, "Email is already registered"));
    }
    if (existingUser.username === username) {
      return next(errorHandler(400, "Username is already taken"));
    }
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try{
  // Upload each file to Cloudinary and get the URLs
  const imageUrls = await Promise.all(
    files.map(async (file) => {
      const uploadResult = await uploadOnCloudinary(file.path); // Ensure uploadOnCloudinary returns a URL or response object with URL
      if (!uploadResult || !uploadResult.url) {
        throw new Error("Image upload failed");
      }
      return uploadResult.url;
    })
  );

  // Create a new user with the URLs from Cloudinary
  const newUser = new User({
    username,
    email,
    fullname,
    password: hashedPassword,
    images: imageUrls,
  });


    // Save the new user to the database
    await newUser.save();
    res.json(new ApiResponse(200, "Signup successful"));
  } catch (error) {
    console.error(error);
    return next(errorHandler(500, error.message || "Server error while creating user"));
  }
};
