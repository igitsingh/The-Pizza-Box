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
        let totalSalesToday = 0;
        let totalOrdersToday = 0;
        try {
            const todayOrders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startOfToday,
                        lte: endOfToday
                    },
                    status: { not: 'CANCELLED' }
                },
                select: {
                    total: true
                }
            });
            totalSalesToday = todayOrders.reduce((sum, order) => sum + order.total, 0);
            totalOrdersToday = todayOrders.length;
        } catch (err) {
            console.error('Error fetching today orders:', err);
        }

        // 3. Active Orders (Pending/Preparing/Out)
        let activeOrders = 0;
        try {
            activeOrders = await prisma.order.count({
                where: {
                    status: {
                        in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY']
                    }
                }
            });
        } catch (err) {
            console.error('Error fetching active orders:', err);
        }

        // 4. Low Stock Items (unavailable items)
        let lowStockItems = 0;
        try {
            lowStockItems = await prisma.item.count({
                where: {
                    isAvailable: false
                }
            });
        } catch (err) {
            console.error('Error fetching low stock items:', err);
        }

        // 5. Repeat Customer Rate
        let repeatCustomerRate = 0;
        let totalUsers = 0;
        try {
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
            repeatCustomerRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

            totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        } catch (err) {
            console.error('Error fetching customer stats:', err);
        }

        // 7. Status Breakdown
        let pendingOrders = 0;
        let preparingOrders = 0;
        let outForDeliveryOrders = 0;
        try {
            pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
            preparingOrders = await prisma.order.count({ where: { status: { in: ['ACCEPTED', 'PREPARING', 'BAKING'] } } });
            outForDeliveryOrders = await prisma.order.count({ where: { status: 'OUT_FOR_DELIVERY' } });
        } catch (err) {
            console.error('Error fetching order status breakdown:', err);
        }

        // 8. Action Items (Badges) - Safe defaults if tables don't exist
        let newComplaints = 0;
        let newFeedbacks = 0;
        try {
            newComplaints = await prisma.complaint.count({ where: { status: 'OPEN' } });
        } catch (err) {
            console.error('Complaint table not accessible:', err);
        }

        try {
            newFeedbacks = await prisma.feedback.count({ where: { adminResponse: null } });
        } catch (err) {
            console.error('Feedback table not accessible:', err);
        }

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
    } catch (error: any) {
        console.error('Get dashboard stats error:', error);
        // Return zero stats instead of 500
        res.json({
            totalSalesToday: 0,
            totalOrdersToday: 0,
            activeOrders: 0,
            lowStockItems: 0,
            repeatCustomerRate: 0,
            totalUsers: 0,
            pendingOrders: 0,
            preparingOrders: 0,
            outForDeliveryOrders: 0,
            newComplaints: 0,
            newFeedbacks: 0
        });
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
    } catch (error: any) {
        console.error('Get sales trend error:', error);
        // Return empty data instead of 500
        res.json([]);
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
    } catch (error: any) {
        console.error('Get top items error:', error);
        // Return empty array instead of 500
        res.json([]);
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
    } catch (error: any) {
        console.error('Get orders by status error:', error);
        // Return empty array instead of 500
        res.json([]);
    }
};
