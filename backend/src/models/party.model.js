import mongoose, { Schema } from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    partyname: {
      type: String,
      required: true,
    },
    leadername: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Participants = mongoose.model("Participants", participantSchema);

export default Participants