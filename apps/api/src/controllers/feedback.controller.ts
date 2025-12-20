import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/feedback - Submit feedback (customer)
export const submitFeedback = async (req: Request, res: Response) => {
    try {
        const { orderId, rating, review } = req.body;
        const userId = (req as any).user?.id; // From auth middleware (optional)

        // Validation
        if (!orderId || !rating) {
            return res.status(400).json({ message: 'Order ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { feedback: true }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if feedback already exists
        if (order.feedback) {
            return res.status(400).json({ message: 'Feedback already submitted for this order' });
        }

        // Check if order is delivered
        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ message: 'Can only rate delivered orders' });
        }

        // Verify ownership
        if (userId) {
            // Logged-in user
            if (order.userId !== userId) {
                return res.status(403).json({ message: 'Not authorized to rate this order' });
            }
        } else {
            // Guest user - verify phone
            const { guestPhone } = req.body;
            if (!guestPhone) {
                return res.status(400).json({ message: 'Phone number required for guest feedback' });
            }
            if (order.customerPhone !== guestPhone) {
                return res.status(403).json({ message: 'Phone number does not match order' });
            }
        }

        // Create feedback
        const feedback = await prisma.feedback.create({
            data: {
                orderId,
                userId: userId || null,
                guestPhone: userId ? null : req.body.guestPhone,
                rating,
                review: review || null,
            }
        });

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/feedback/public - Get public feedbacks (for testimonials)
export const getPublicFeedbacks = async (req: Request, res: Response) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: { isVisible: true },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        createdAt: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to 50 most recent
        });

        // Format response
        const formattedFeedbacks = feedbacks.map(f => ({
            id: f.id,
            rating: f.rating,
            review: f.review,
            customerName: f.user?.name || 'Guest Customer',
            orderNumber: f.order.orderNumber,
            createdAt: f.createdAt,
            adminResponse: f.adminResponse
        }));

        res.json(formattedFeedbacks);
    } catch (error) {
        console.error('Get public feedbacks error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/feedback/check/:orderId - Check if feedback exists for order
export const checkFeedback = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const feedback = await prisma.feedback.findUnique({
            where: { orderId }
        });

        res.json({ exists: !!feedback, feedback });
    } catch (error) {
        console.error('Check feedback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
