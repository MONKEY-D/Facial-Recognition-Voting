import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import jwt from "jsonwebtoken";

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
    return next(
      errorHandler(400, "Password must be at least 8 characters long")
    );
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

  // const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    // Upload each file to Cloudinary and get the URLs
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const uploadResult = await uploadOnCloudinary(file.path); 
        if (!uploadResult || !uploadResult.url) {
          throw new Error("Image upload failed");
        }
        return uploadResult.url;
      })
    );

    // Send image URLs to Python backend for embeddings
    const embeddings = [];
    for (const imageUrl of imageUrls) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/get_embedding",
          { imageUrl }
        );
        if (response.data.embedding) {
          embeddings.push(response.data.embedding);
        }
      } catch (error) {
        console.error("Error calculating embedding for image:", error);
      }
    }

    // Create a new user with the URLs from Cloudinary
    const newUser = new User({
      username,
      email,
      fullname,
      password ,
      images: imageUrls,
      embeddings,
    });

    // Save the new user to the database
    await newUser.save();
    res.json(new ApiResponse(200, "Signup successful"));
  } catch (error) {
    console.error(error);
    return next(
      errorHandler(500, error.message || "Server error while creating user")
    );
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All Fields are required"));
  }

  try {
    const validUser = await User.findOne({
      $or: [{ username: username }, { email: username }],
    }).select("+password");
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }

    //compare password
    const validPassword = await validUser.isPasswordCorrect(password);

    console.log("Password comparison result:", validPassword);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // generate JWT Token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    return next(error);
  }
};
