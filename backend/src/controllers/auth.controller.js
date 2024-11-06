import { User } from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
  const { username, email, password, fullname, avatar, images, embeddings } = req.body;

  // Validate required fields
  if (!username || !email || !password || !fullname || !avatar || !images || !embeddings) {
    return next(errorHandler(400,"All Fields are required"))
  }

  // Check if images array length is within limits (1-3)
  if (images.length < 1 || images.length > 3) {
    return next(errorHandler(400, "Images must have between 1 and 3 images"));
  }


  const hashedPassword = bcryptjs.hashSync(password, 10)

  // Create new user
  const newUser = new User({
    username,
    email,
    fullname,
    avatar,
    password: hashedPassword,
    images,
    embeddings
  });


  try {
    // Save the new user to the database
    await newUser.save();
    res.json(new ApiResponse(200, 'Signup successful'));
  } catch (error) {
    console.error(error);
    return next(errorHandler(500, "Server error while creating user"));
  }
};
