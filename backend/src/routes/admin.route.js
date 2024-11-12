import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Participants from "../models/party.model.js";

const router = express.Router();

// Route to add a participant
router.post(
  "/dashboard/addparticipant",
  upload.single("image"),
  async (req, res) => {
    try {
      // If the image is uploaded successfully
      const image_url = await uploadOnCloudinary(req.file.path); // Or Cloudinary URL if using Cloudinary

      if (!image_url) {
        return res.status(500).json({
          success: false,
          message: "Error uploading image to Cloudinary.",
        });
      }

      const { partyname, leadername } = req.body;

      // Create a new participant record
      const newParticipant = new Participants({
        partyname,
        leadername,
        image_url,
      });

      // Save the participant to the database
      await newParticipant.save();

      res
        .status(200)
        .json({ success: true, message: "Participant added successfully!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error adding participant." });
    }
  }
);

// Route to fetch all participants
router.get("/dashboard/participants", async (req, res) => {
  try {
    const participants = await Participants.find();
    res.status(200).json({ success: true, participants });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching participants." });
  }
});


export default router;
