import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/enquiries - Get all enquiries
export const getAllEnquiries = async (req: Request, res: Response) => {
    try {
        const { status, source } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (source) where.source = source;

        const enquiries = await prisma.enquiry.findMany({
            where,
            include: {
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(enquiries);
    } catch (error) {
        console.error('Get all enquiries error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/admin/enquiries/:id - Get single enquiry
export const getEnquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const enquiry = await prisma.enquiry.findUnique({
            where: { id },
            include: {
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json(enquiry);
    } catch (error) {
        console.error('Get enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /api/admin/enquiries/:id/status - Update status
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CONVERTED', 'CLOSED', 'SPAM'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { status }
        });

        res.json({
            message: 'Status updated successfully',
            enquiry
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /api/admin/enquiries/:id/assign - Assign to staff
export const assignEnquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        // Verify user exists
        if (assignedTo) {
            const user = await prisma.user.findUnique({
                where: { id: assignedTo }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { assignedTo: assignedTo || null }
        });

        res.json({
            message: assignedTo ? 'Enquiry assigned successfully' : 'Enquiry unassigned',
            enquiry
        });
    } catch (error) {
        console.error('Assign enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /api/admin/enquiries/:id/notes - Update notes
export const updateNotes = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { notes: notes || null }
        });

        res.json({
            message: 'Notes updated successfully',
            enquiry
        });
    } catch (error) {
        console.error('Update notes error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/admin/enquiries/:id - Delete enquiry
export const deleteEnquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.enquiry.delete({
            where: { id }
        });

        res.json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error('Delete enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/admin/enquiries/stats - Get enquiry statistics
export const getEnquiryStats = async (req: Request, res: Response) => {
    try {
        const [total, newCount, inProgress, contacted, converted, closed] = await Promise.all([
            prisma.enquiry.count(),
            prisma.enquiry.count({ where: { status: 'NEW' } }),
            prisma.enquiry.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
            prisma.enquiry.count({ where: { status: 'CONVERTED' } }),
            prisma.enquiry.count({ where: { status: 'CLOSED' } })
        ]);

        const bySource = await prisma.enquiry.groupBy({
            by: ['source'],
            _count: {
                source: true
            }
        });

        res.json({
            total,
            byStatus: {
                new: newCount,
                inProgress,
                contacted,
                converted,
                closed
            },
            bySource: bySource.map(s => ({
                source: s.source,
                count: s._count.source
            }))
        });
    } catch (error) {
        console.error('Get enquiry stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
