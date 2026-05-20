import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';

const healthRouter = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
healthRouter.get('/', getHealth);

export default healthRouter;
