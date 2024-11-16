import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Token Received:", token); 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    console.log("Decoded user:", decoded);

    req.user = decoded;  // Store the decoded user data for later use
    next();
  });
};
