import { User } from "../models/user.model.js";
import { Participants } from "../models/party.model.js";
import { errorHandler } from "../utils/error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import jwt from "jsonwebtoken";

// SIGNUP - User Registration
export const signup = async (req, res, next) => {
  const { username, email, password, fullname } = req.body;
  const files = req.files;

  // Validate required fields
  if (
    !username ||
    !email ||
    !password ||
    !fullname ||
    // !files ||
    // files.length === 0
    (!files && !hasWebcamImage)
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (password.length < 8) {
    return next(
      errorHandler(400, "Password must be at least 8 characters long")
    );
  }

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, "Email is already registered"));
      }
      if (existingUser.username === username) {
        return next(errorHandler(400, "Username is already taken"));
      }
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const uploadResult = await uploadOnCloudinary(file.path);
        if (!uploadResult) {
          throw new Error("Image upload failed");
        }
        return uploadResult;
      })
    );

    // Fetch embeddings from Python backend
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

    // Create new user and save to database
    const newUser = new User({
      username,
      email,
      fullname,
      password, // Will be hashed by the pre-save hook in user model
      images: imageUrls,
      embeddings,
      role: "user",
    });

    await newUser.save();
    res.json(new ApiResponse(200, "Signup successful"));
  } catch (error) {
    console.error(error);
    return next(
      errorHandler(500, error.message || "Server error while creating user")
    );
  }
};

// SIGNIN - User Login
export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  // Validate fields
  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All Fields are required"));
  }

  try {
    // Find user by username or email
    const validUser = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("+password");
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }

    // Compare passwords
    const validPassword = await validUser.isPasswordCorrect(password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // Exclude password from response
    const { password: pass, ...rest } = validUser._doc;

    res.status(200).json({
      message: "Sign-in successful!",
      user: rest,
      token,
      role: validUser.role,
    });
  } catch (error) {
    return next(error);
  }
};

// VOTE - Register user's vote
// VOTE - Register user's vote with face embedding verification
export const vote = async (req, res, next) => {
  console.log("Received vote request:", req.body); 

  const userId = req.user.id; // Get user ID from token or session
  const { participantId, faceEmbedding } = req.body;

  try {
    console.log("Received vote request:", { userId, participantId, faceEmbedding });

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (user.hasVoted) {
      return next(errorHandler(400, "User has already voted"));
    }

    // Ensure the user has stored embeddings for comparison
    if (!user.embeddings || user.embeddings.length === 0) {
      return next(errorHandler(400, "No stored embeddings found for user"));
    }

    // Compare the received embedding with the stored embeddings
    const threshold = 0.8; // Set a similarity threshold (0.8 is a common choice, can be adjusted)
    let matchFound = false;

    for (const storedEmbedding of user.embeddings) {
      const similarity = cosineSimilarity(faceEmbedding, storedEmbedding);

      if (similarity >= threshold) {
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      return next(errorHandler(401, "Face verification failed."));
    }

    // If face verification is successful, proceed with voting
    const participant = await Participants.findById(participantId);
    if (!participant) {
      return next(errorHandler(404, "Participant not found"));
    }

    // Update user’s voting status and the participant they voted for
    user.hasVoted = true;
    user.votedFor = participantId;

    await user.save();

    res.json(new ApiResponse(200, "Vote registered successfully"));
  } catch (error) {
    console.error("Error during face verification or vote registration:", error);
    return next(errorHandler(500, "Server error while registering vote"));
  }
};


// export const vote = async (req, res, next) => {
//   const userId = req.user.id; // Get user ID from token or session
//   const { participantId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return next(errorHandler(404, "User not found"));
//     }

//     if (user.hasVoted) {
//       return next(errorHandler(400, "User has already voted"));
//     }

//     // Check if the participant exists
//     const participant = await Participants.findById(participantId);
//     if (!participant) {
//       return next(errorHandler(404, "Participant not found"));
//     }

//     // Update user’s voting status and the participant they voted for
//     user.hasVoted = true;
//     user.votedFor = participantId;

//     await user.save();

//     res.json(new ApiResponse(200, "Vote registered successfully"));
//   } catch (error) {
//     console.error("Error updating voting status:", error);
//     return next(errorHandler(500, "Server error while registering vote"));
//   }
// };

// GET USER STATUS - Check if user has voted
export const getUserStatus = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.json(
      new ApiResponse(200, "User status retrieved", { hasVoted: user.hasVoted })
    );
  } catch (error) {
    return next(errorHandler(500, "Server error while retrieving user status"));
  }
};

// Utility function to calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, val, index) => acc + val * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
};

// export const google = async (req, res, next) => {
//   const { name, email, googlePhotoUrl } = req.body;
//   try {
//     // First, check whether the user exists
//     const user = await User.findOne({ email });
//     if (user) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//       const { password, ...rest } = user._doc;
//       return res
//         .status(200)
//         .cookie("access_token", token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     } else {
//       const generatePassword =
//         Math.random().toString(36).slice(-8) +
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

//       const newUser = new User({
//         username:
//           name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
//         email,
//         password: hashedPassword,
//         avatar: googlePhotoUrl,
//       });

//       await newUser.save();
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//       const { password, ...rest } = newUser._doc;

//       res.status(201).cookie("access_token", token, {
//         httpOnly: true,
//       }).json(rest);
//     }
//   } catch (error) {
//     return next(error);
//   }
// };
