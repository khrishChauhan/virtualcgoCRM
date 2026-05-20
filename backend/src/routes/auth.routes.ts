import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const authRouter = Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with email + password → returns JWT + user info
 * @access  Public
 */
authRouter.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private (any authenticated user)
 */
authRouter.get('/me', verifyToken, getMe);

export default authRouter;
