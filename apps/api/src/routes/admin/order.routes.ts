import { Router } from 'express';
import { getAllOrders, updateOrderStatus, assignDeliveryPartner, getOrderById, getOrderStats, getOrderNotifications } from '../../controllers/admin/order.controller';
import { downloadInvoice } from '../../controllers/order.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// SECURITY: Require authentication AND admin role
router.use(authenticate, authorizeAdmin);

router.get('/stats', getOrderStats);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/:id/notifications', getOrderNotifications);
router.get('/:id/invoice', downloadInvoice);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/assign-partner', assignDeliveryPartner);

export default router;

