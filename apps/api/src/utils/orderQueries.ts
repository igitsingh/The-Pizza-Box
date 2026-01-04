import { PrismaClient, OrderStatus, Prisma } from '@prisma/client';
import { ORDER_STATUS, KITCHEN_STATUS_GROUPS } from '../constants/orderStatus';

const prisma = new PrismaClient();

/**
 * SINGLE SOURCE OF TRUTH FOR ORDER QUERIES
 * All controllers MUST use these functions to ensure consistency
 */

// Standard order include for detailed views
export const ORDER_DETAIL_INCLUDE: Prisma.OrderInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
    },
    items: true,
    address: true,
    deliveryPartner: {
        select: {
            id: true,
            name: true,
            phone: true,
            status: true,
        },
    },
};

// Minimal order include for lists
export const ORDER_LIST_INCLUDE: Prisma.OrderInclude = {
    user: {
        select: {
            name: true,
            phone: true,
        },
    },
    items: {
        select: {
            id: true,
            name: true,
            quantity: true,
            price: true,
        },
    },
};

/**
 * Get all pending orders (awaiting acceptance)
 */
export async function getPendingOrders() {
    return prisma.order.findMany({
        where: {
            status: ORDER_STATUS.PENDING,
        },
        include: ORDER_LIST_INCLUDE,
        orderBy: {
            createdAt: 'asc', // FIFO
        },
    });
}

/**
 * Get all kitchen orders (being prepared)
 * Kitchen = ACCEPTED | PREPARING | BAKING
 */
export async function getKitchenOrders() {
    return prisma.order.findMany({
        where: {
            status: {
                in: [...KITCHEN_STATUS_GROUPS.KITCHEN],
            },
        },
        include: ORDER_LIST_INCLUDE,
        orderBy: {
            createdAt: 'asc', // FIFO
        },
    });
}

/**
 * Get orders ready for pickup/delivery
 */
export async function getReadyOrders() {
    return prisma.order.findMany({
        where: {
            status: ORDER_STATUS.READY_FOR_PICKUP,
        },
        include: ORDER_LIST_INCLUDE,
        orderBy: {
            createdAt: 'asc',
        },
    });
}

/**
 * Get orders out for delivery
 */
export async function getOutForDeliveryOrders() {
    return prisma.order.findMany({
        where: {
            status: ORDER_STATUS.OUT_FOR_DELIVERY,
        },
        include: {
            ...ORDER_LIST_INCLUDE,
            deliveryPartner: {
                select: {
                    name: true,
                    phone: true,
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
}

/**
 * Get all active orders (not completed/cancelled)
 */
export async function getActiveOrders() {
    return prisma.order.findMany({
        where: {
            status: {
                in: [...KITCHEN_STATUS_GROUPS.ACTIVE],
            },
        },
        include: ORDER_LIST_INCLUDE,
        orderBy: {
            createdAt: 'asc',
        },
    });
}

/**
 * Get order counts by status (for dashboard)
 */
export async function getOrderCountsByStatus() {
    try {
        const counts = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        const statusMap: Record<string, number> = {};
        counts.forEach((item) => {
            statusMap[item.status] = item._count.status;
        });

        return {
            pending: statusMap['PENDING'] || 0,
            accepted: statusMap['ACCEPTED'] || 0,
            preparing: statusMap['PREPARING'] || 0,
            baking: statusMap['BAKING'] || 0,
            ready: statusMap['READY_FOR_PICKUP'] || 0,
            outForDelivery: statusMap['OUT_FOR_DELIVERY'] || 0,
            delivered: statusMap['DELIVERED'] || 0,
            cancelled: statusMap['CANCELLED'] || 0,
            scheduled: statusMap['SCHEDULED'] || 0,
            // Computed aggregates
            kitchen: (statusMap['ACCEPTED'] || 0) + (statusMap['PREPARING'] || 0) + (statusMap['BAKING'] || 0),
            active: (statusMap['PENDING'] || 0) + (statusMap['ACCEPTED'] || 0) + (statusMap['PREPARING'] || 0) +
                (statusMap['BAKING'] || 0) + (statusMap['READY_FOR_PICKUP'] || 0) + (statusMap['OUT_FOR_DELIVERY'] || 0),
        };
    } catch (error) {
        console.error('Error getting order counts:', error);
        // Return zeros on error
        return {
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
        };
    }
}

/**
 * Get all orders with filters (for admin orders page)
 */
export async function getAllOrders(filters?: {
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
}) {
    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) {
        where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
            where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
            where.createdAt.lte = filters.endDate;
        }
    }

    if (filters?.userId) {
        where.userId = filters.userId;
    }

    return prisma.order.findMany({
        where,
        include: ORDER_DETAIL_INCLUDE,
        orderBy: {
            createdAt: 'desc',
        },
    });
}
