import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                items: true,
                address: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        addresses: true
                    },
                },
                items: true,
                deliveryPartner: true,
                refund: true
            },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const assignDeliveryPartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { deliveryPartnerId } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: {
                deliveryPartnerId,
                status: 'OUT_FOR_DELIVERY' // Auto update status when assigned
            },
            include: {
                deliveryPartner: true
            }
        });

        // Update partner status to BUSY
        await prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: { status: 'BUSY' }
        });

        res.json(order);
    } catch (error) {
        console.error('Assign partner error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const currentOrder = await prisma.order.findUnique({ where: { id } });
        if (!currentOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // GUARD: Cannot move to OUT_FOR_DELIVERY without a partner
        if (status === 'OUT_FOR_DELIVERY' && !currentOrder.deliveryPartnerId) {
            // Check if it's being updated in this same request? (Not possible with this simple update body, usually assign is separate)
            return res.status(400).json({
                message: 'Cannot mark as Out For Delivery! Please assign a Delivery Partner first.'
            });
        }

        const order = await prisma.order.update({
            where: { id },
            data: {
                status,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // If delivered, free up the partner
        if (status === 'DELIVERED' && order.deliveryPartnerId) {
            await prisma.deliveryPartner.update({
                where: { id: order.deliveryPartnerId },
                data: { status: 'AVAILABLE' }
            });
        }

        // TODO: Emit socket event for real-time updates to user

        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderStats = async (req: Request, res: Response) => {
    try {
        const counts = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        const stats = counts.reduce((acc: any, curr: any) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});

        const complaintCount = await prisma.complaint.count({
            where: { status: 'OPEN' }
        });

        res.json({
            pending: stats['PENDING'] || 0,
            active: (stats['ACCEPTED'] || 0) + (stats['PREPARING'] || 0) + (stats['BAKING'] || 0) + (stats['READY_FOR_PICKUP'] || 0) + (stats['OUT_FOR_DELIVERY'] || 0),
            stats,
            complaintsOpen: complaintCount
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderNotifications = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const logs = await prisma.notificationLog.findMany({
            where: { orderId: id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
