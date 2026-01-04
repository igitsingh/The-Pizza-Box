import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { getAllOrders as getAllOrdersUtil, getOrderCountsByStatus, ORDER_DETAIL_INCLUDE } from '../../utils/orderQueries';
import { parseOrderStatus, isValidOrderStatus } from '../../constants/orderStatus';

const prisma = new PrismaClient();

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status, startDate, endDate, userId } = req.query;

        const filters: any = {};

        // Validate and parse status if provided
        if (status) {
            const parsedStatus = parseOrderStatus(status as string);
            if (!parsedStatus) {
                return res.status(400).json({
                    message: 'Invalid order status',
                    validStatuses: ['PENDING', 'ACCEPTED', 'PREPARING', 'BAKING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED']
                });
            }
            filters.status = parsedStatus;
        }

        if (startDate) filters.startDate = new Date(startDate as string);
        if (endDate) filters.endDate = new Date(endDate as string);
        if (userId) filters.userId = userId as string;

        const orders = await getAllOrdersUtil(filters);

        console.log(`[ORDERS] Fetched ${orders.length} orders with filters: `, filters);

        res.json(orders);
    } catch (error: any) {
        console.error('Get all orders error:', error);
        // Return empty array instead of 500
        res.json([]);
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                ...ORDER_DETAIL_INCLUDE,
                refund: true,
            },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error: any) {
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
                status: 'OUT_FOR_DELIVERY',
            },
            include: {
                deliveryPartner: true,
            },
        });

        // Update partner status to BUSY
        await prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: { status: 'BUSY' },
        });

        console.log(`[ORDER] ${id} assigned to partner ${deliveryPartnerId} `);

        res.json(order);
    } catch (error: any) {
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
            return res.status(400).json({
                message: 'Cannot mark as Out For Delivery! Please assign a Delivery Partner first.',
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
                data: { status: 'AVAILABLE' },
            });
        }

        console.log(`[ORDER] ${id} status updated: ${currentOrder.status} → ${status} `);

        res.json(order);
    } catch (error: any) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderStats = async (req: Request, res: Response) => {
    try {
        const counts = await getOrderCountsByStatus();

        let complaintsOpen = 0;
        try {
            complaintsOpen = await prisma.complaint.count({
                where: { status: 'OPEN' },
            });
        } catch (err) {
            console.error('Complaint count error:', err);
        }

        console.log('[ORDER STATS]', counts);

        res.json({
            ...counts,
            complaintsOpen,
        });
    } catch (error: any) {
        console.error('Get stats error:', error);
        // Return zeros instead of 500
        res.json({
            pending: 0,
            accepted: 0,
            preparing: 0,
            baking: 0,
            ready: 0,
            outForDelivery: 0,
            delivered: 0,
            cancelled: 0,
            scheduled: 0,
            kitchen: 0,
            active: 0,
            complaintsOpen: 0,
        });
    }
};

export const getOrderNotifications = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const logs = await prisma.notificationLog.findMany({
            where: { orderId: id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(logs);
    } catch (error: any) {
        console.error('Get notifications error:', error);
        res.json([]);
    }
};

