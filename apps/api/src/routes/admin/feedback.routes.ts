import { Router } from 'express';
import { getAllFeedbacks, respondToFeedback, toggleVisibility, deleteFeedback } from '../../controllers/admin/feedback.controller';

import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', getAllFeedbacks);
router.patch('/:id/respond', respondToFeedback);
router.patch('/:id/toggle-visibility', toggleVisibility);
router.delete('/:id', deleteFeedback);

export default router;
