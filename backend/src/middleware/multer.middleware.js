import multer from 'multer'
import path from "path";
import fs from 'fs'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, '..','..', 'public', 'temp');

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Check for image files only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  }
});
export { upload };
