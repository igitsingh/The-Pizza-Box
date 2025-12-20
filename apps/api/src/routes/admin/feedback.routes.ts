import { Router } from 'express';
import { getAllFeedbacks, respondToFeedback, toggleVisibility, deleteFeedback } from '../../controllers/admin/feedback.controller';

const router = Router();

router.get('/', getAllFeedbacks);
router.patch('/:id/respond', respondToFeedback);
router.patch('/:id/toggle-visibility', toggleVisibility);
router.delete('/:id', deleteFeedback);

export default router;
