import express from 'express';

// Import controller functions
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// "Wire up" the routes to the controller functions
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

export default router;