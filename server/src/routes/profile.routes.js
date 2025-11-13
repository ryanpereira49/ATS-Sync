import express from 'express';
import { upload } from "../utils/multer.config.js";
import { profileController } from '../controllers/profile.controller.js';

const router = express.Router();

// Routes: /api/v1/profiles/:userId
router.get('/:userId', profileController.getProfile);
router.post('/:userId', profileController.createProfile);
router.put('/:userId', profileController.updateProfile);
router.delete('/:userId', profileController.deleteProfile);

router.post("/upload-resume", upload.single("resume"), profileController.uploadResume);

export default router;
