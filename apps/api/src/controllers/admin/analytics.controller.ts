import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);

        // 1. Total Sales Today
        const todayOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday
                },
                status: { not: 'CANCELLED' }
            }
        });
        const totalSalesToday = todayOrders.reduce((sum, order) => sum + order.total, 0);

        // 2. Total Orders Today
        const totalOrdersToday = todayOrders.length;

        // 3. Active Orders (Pending/Preparing/Out)
        const activeOrders = await prisma.order.count({
            where: {
                status: {
                    in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY']
                }
            }
        });

        // 4. Low Stock Items (unavailable items)
        const lowStockItems = await prisma.item.count({
            where: {
                isAvailable: false
            }
        });

        // 5. Repeat Customer Rate
        const customersWithOrders = await prisma.user.findMany({
            where: {
                role: 'CUSTOMER',
                orders: {
                    some: {}
                }
            },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        });

        const totalCustomers = customersWithOrders.length;
        const repeatCustomers = customersWithOrders.filter(c => c._count.orders > 1).length;
        const repeatCustomerRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

        // 6. Total Users (for context)
        const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

        // 7. Status Breakdown
        const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
        const preparingOrders = await prisma.order.count({ where: { status: { in: ['ACCEPTED', 'PREPARING', 'BAKING'] } } });
        const outForDeliveryOrders = await prisma.order.count({ where: { status: 'OUT_FOR_DELIVERY' } });

        // 8. Action Items (Badges)
        const newComplaints = await prisma.complaint.count({ where: { status: 'OPEN' } });
        const newFeedbacks = await prisma.feedback.count({ where: { adminResponse: null } });

        res.json({
            totalSalesToday,
            totalOrdersToday,
            activeOrders,
            lowStockItems,
            repeatCustomerRate,
            totalUsers,
            pendingOrders,
            preparingOrders,
            outForDeliveryOrders,
            newComplaints,
            newFeedbacks
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSalesTrend = async (req: Request, res: Response) => {
    try {
        const { range } = req.query; // '7d', '15d', '1m', '3m', '6m', '1y', 'all'
        const today = new Date();
        let startDate: Date;

        switch (range) {
            case '15d':
                startDate = subDays(today, 15);
                break;
            case '1m':
                startDate = subDays(today, 30);
                break;
            case '3m':
                startDate = subDays(today, 90);
                break;
            case '6m':
                startDate = subDays(today, 180);
                break;
            case '1y':
                startDate = subDays(today, 365);
                break;
            case 'all':
                startDate = new Date(0); // Beginning of time
                break;
            case '7d':
            default:
                startDate = subDays(today, 7);
                break;
        }

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: { not: 'CANCELLED' }
            },
            select: {
                createdAt: true,
                total: true
            }
        });

        // Group by date
        const salesByDate: Record<string, number> = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            salesByDate[date] = (salesByDate[date] || 0) + order.total;
        });

        const chartData = Object.keys(salesByDate).map(date => ({
            date,
            sales: salesByDate[date]
        })).sort((a, b) => a.date.localeCompare(b.date));

        res.json(chartData);
    } catch (error) {
        console.error('Get sales trend error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTopItems = async (req: Request, res: Response) => {
    try {
        // Get all non-cancelled orders with items
        const orders = await prisma.order.findMany({
            where: { status: { not: 'CANCELLED' } },
            include: { items: true },
            take: 200 // Last 200 orders for better data
        });

        const itemCounts: Record<string, number> = {};

        // Count quantities sold per item
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!itemCounts[item.itemId]) {
                    itemCounts[item.itemId] = 0;
                }
                itemCounts[item.itemId] += item.quantity;
            });
        });

        // Get top 10 item IDs
        const topItemIds = Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([itemId]) => itemId);

        // Fetch full item details
        const items = await prisma.item.findMany({
            where: {
                id: { in: topItemIds }
            },
            include: {
                category: true
            }
        });

        // Map items with their counts and sort by count
        const topItems = items
            .map(item => ({
                ...item,
                soldCount: itemCounts[item.id]
            }))
            .sort((a, b) => b.soldCount - a.soldCount);

        res.json(topItems);
    } catch (error) {
        console.error('Get top items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        const formattedData = orders.map(order => ({
            name: order.status,
            value: order._count.status
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Get orders by status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
