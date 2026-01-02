import { Router } from 'express';
import { createPaymentOrder } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import express from 'express';

const router = Router();

router.post('/create-order', authenticate, createPaymentOrder);
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
