import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/feedbacks - Get all feedbacks
export const getAllFeedbacks = async (req: Request, res: Response) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        createdAt: true,
                        total: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(feedbacks);
    } catch (error) {
        console.error('Get all feedbacks error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /api/admin/feedbacks/:id/respond - Add admin response
export const respondToFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adminResponse } = req.body;

        if (!adminResponse) {
            return res.status(400).json({ message: 'Admin response is required' });
        }

        const feedback = await prisma.feedback.update({
            where: { id },
            data: { adminResponse }
        });

        res.json({
            message: 'Response added successfully',
            feedback
        });
    } catch (error) {
        console.error('Respond to feedback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /api/admin/feedbacks/:id/toggle-visibility - Toggle visibility
export const toggleVisibility = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const feedback = await prisma.feedback.findUnique({
            where: { id }
        });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        const updated = await prisma.feedback.update({
            where: { id },
            data: { isVisible: !feedback.isVisible }
        });

        res.json({
            message: `Feedback ${updated.isVisible ? 'shown' : 'hidden'} successfully`,
            feedback: updated
        });
    } catch (error) {
        console.error('Toggle visibility error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/admin/feedbacks/:id - Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.feedback.delete({
            where: { id }
        });

        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
