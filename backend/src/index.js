// index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";
import userrouter from "./routes/user.route.js";
import adminrouter from "./routes/admin.route.js";
import authrouter from './routes/auth.route.js'
import { errorMiddleware } from "./utils/error.js";

dotenv.config({ path: "./env" });

const app = express();

// Middleware and CORS setup
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, 
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.static("public"));

// Connect to database and start server
connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });



  // Routes
app.use("/api/user", userrouter);
app.use("/api/auth", authrouter);
app.use('/admin', adminrouter);

app.use(errorMiddleware);