import { Router } from 'express';
import { createCoupon, updateCoupon, deleteCoupon, getAllCoupons } from '../../controllers/admin/coupon.controller';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken, authorizeAdmin);

router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
