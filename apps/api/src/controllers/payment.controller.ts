import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/db';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount } = req.body; // Amount in Rupees

        if (!amount) {
            res.status(400).json({ message: 'Amount is required' });
            return;
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};

export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string): boolean => {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');

    return generated_signature === signature;
};

