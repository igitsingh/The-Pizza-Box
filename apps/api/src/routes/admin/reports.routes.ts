import { Router } from 'express';
import {
    getSalesReport,
    getProductReport,
    getCouponReport,
    getDeliveryPartnerReport,
    getCustomerReport,
    getOverviewReport
} from '../../controllers/admin/reports.controller';

import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/overview', getOverviewReport);
router.get('/sales', getSalesReport);
router.get('/products', getProductReport);
router.get('/coupons', getCouponReport);
router.get('/delivery-partners', getDeliveryPartnerReport);
router.get('/customers', getCustomerReport);

export default router;
