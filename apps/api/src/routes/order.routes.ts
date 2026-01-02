import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus, getMyOrders, lookupOrder, repeatOrder, getOrderNotifications, downloadInvoice, validateDelivery } from '../controllers/order.controller';
import { authenticate, authorizeAdmin, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/validate-delivery', optionalAuthenticate, validateDelivery);
router.post('/', optionalAuthenticate, createOrder); // Optional for Guest
router.get('/my', authenticate, getMyOrders); // Logged-in history
router.post('/lookup', lookupOrder); // Guest lookup
router.post('/repeat', optionalAuthenticate, repeatOrder); // Repeat order (Guest or User)
router.get('/', authenticate, authorizeAdmin, getOrders); // Admin only
router.get('/:id', authenticate, getOrder);
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);
router.get('/:id/notifications', authenticate, authorizeAdmin, getOrderNotifications);
router.get('/:id/invoice', optionalAuthenticate, downloadInvoice);

export default router;
