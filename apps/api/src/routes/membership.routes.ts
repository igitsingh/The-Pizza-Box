import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getMyMembership, getAllTierBenefits } from '../controllers/membership.controller';

const router = Router();

router.get('/my-tier', authenticate, getMyMembership);
router.get('/benefits', getAllTierBenefits);

export default router;
