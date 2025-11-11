import express from 'express';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.listUsers);
router.post('/create', userController.createUser);

export default router;