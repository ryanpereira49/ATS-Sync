import express from 'express';
import { upload } from "../utils/multer.config.js";
import { profileController } from '../controllers/profile.controller.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes (time frame for which requests are counted)
  max: 15, // Limit each IP to 5 requests per `windowMs`
  message:
    "Too many quiz generation requests from this IP, please try again after 15 minutes.",
  statusCode: 429, // Optional: custom status code for response
  headers: true, // Optional: add X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers
});

// Routes: /api/v1/profiles/:userId
router.get('/:userId', profileController.getProfile);
router.post('/:userId', profileController.createProfile);
router.put('/:userId', profileController.updateProfile);
router.delete('/:userId', profileController.deleteProfile);

router.post("/:userId/upload-resume", upload.single("resume"), rateLimiter, profileController.uploadAndProcessResume);

export default router;
