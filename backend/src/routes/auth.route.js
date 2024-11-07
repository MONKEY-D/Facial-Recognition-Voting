import express from 'express'
import { signup } from '../controllers/auth.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();


// router.post('/signup', signup)
router.post('/signup', upload.array('file'), signup);

export default router