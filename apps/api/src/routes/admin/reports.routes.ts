import { Router } from 'express';
import {
    getSalesReport,
    getProductReport,
    getCouponReport,
    getDeliveryPartnerReport,
    getCustomerReport,
    getOverviewReport
} from '../../controllers/admin/reports.controller';

const router = Router();

router.get('/overview', getOverviewReport);
router.get('/sales', getSalesReport);
router.get('/products', getProductReport);
router.get('/coupons', getCouponReport);
router.get('/delivery-partners', getDeliveryPartnerReport);
router.get('/customers', getCustomerReport);

export default router;
