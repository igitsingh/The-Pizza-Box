import { Router } from 'express';
import { submitFeedback, getPublicFeedbacks, checkFeedback } from '../controllers/feedback.controller';
import { optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/public', getPublicFeedbacks);
router.get('/check/:orderId', checkFeedback);

// Customer routes (optional auth - works for both logged-in and guest)
router.post('/', optionalAuth, submitFeedback);

export default router;
