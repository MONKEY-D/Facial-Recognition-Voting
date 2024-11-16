import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const fsPromises = fs.promises;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided for Cloudinary Upload");
      return null;
    }
    console.log("Uploading file to Cloudinary:", localFilePath);

    // Check if the file exists at the given path
    if (!fs.existsSync(localFilePath)) {
      console.error("File not found:", localFilePath);
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Upload successful:", response);

    // Asynchronously remove the local temporary file after upload
    await fsPromises.unlink(localFilePath);

    // Return the secure URL of the uploaded image
    return response.secure_url || null;
  } catch (error) {
    console.error("Failed to upload to Cloudinary", error);

    // In case of an error, attempt to remove the temporary file
    try {
      if (fs.existsSync(localFilePath)) {
        await fsPromises.unlink(localFilePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete temp file", unlinkError);
    }

    return null;
  }
};

export { uploadOnCloudinary };






