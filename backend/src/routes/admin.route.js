import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import Participant from '../models/party.model.js';

const router = express.Router();

// Route to add a participant
router.post('/dashboard/addparticipant', upload.single('image'), async (req, res) => {
  try {
    // If the image is uploaded successfully
    const image_url = req.file.path; // Or Cloudinary URL if using Cloudinary

    const { partyname, leadername } = req.body;

    // Create a new participant record
    const newParticipant = new Participant({
      partyname,
      leadername,
      image_url, // Store the image URL
    });

    // Save the participant to the database
    await newParticipant.save();

    res.status(200).json({ success: true, message: 'Participant added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding participant.' });
  }
});

export default router;
