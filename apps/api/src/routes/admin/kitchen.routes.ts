import { Router } from 'express';
import { getKitchenBoard, getKitchenStats, syncKitchen } from '../../controllers/admin/kitchen.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// SECURITY: Require authentication AND admin role
router.use(authenticate, authorizeAdmin);

// Kitchen board endpoints
router.get('/board', getKitchenBoard);
router.get('/stats', getKitchenStats);
router.get('/sync', syncKitchen);

export default router;

