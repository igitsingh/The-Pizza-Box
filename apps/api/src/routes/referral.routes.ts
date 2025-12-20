import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getMyReferralCode, applyReferralCode, getMyReferrals } from '../controllers/referral.controller';

const router = Router();

router.get('/my-code', authenticate, getMyReferralCode);
router.post('/apply', authenticate, applyReferralCode);
router.get('/my-referrals', authenticate, getMyReferrals);

export default router;
