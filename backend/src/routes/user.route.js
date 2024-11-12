import { Router } from "express";
// import { test } from "../controllers/user.controller.js";
import { vote, getUserStatus } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/vote", verifyToken, vote);
router.get("/status", verifyToken, getUserStatus);

export default router;