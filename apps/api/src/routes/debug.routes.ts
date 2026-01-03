import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/health', async (req, res) => {
    try {
        console.log('Debug: checking DB connection...');
        const userCount = await prisma.user.count();
        const categoryCount = await prisma.category.count();
        const itemCount = await prisma.item.count();

        res.json({
            status: 'ok',
            database: 'connected',
            counts: {
                users: userCount,
                categories: categoryCount,
                items: itemCount
            },
            env: {
                node_env: process.env.NODE_ENV,
                has_db_url: !!process.env.DATABASE_URL,
            }
        });
    } catch (error: any) {
        console.error('Debug DB Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.code,
            meta: error.meta,
            type: error.constructor.name
        });
    }
});

// PRODUCTION DATABASE INSPECTION
router.get('/orders-reality', async (req, res) => {
    try {
        // Get raw order counts by status
        const allOrders = await prisma.order.findMany({
            select: {
                id: true,
                orderNumber: true,
                status: true,
                createdAt: true,
                total: true,
                userId: true,
                customerName: true,
                customerPhone: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // Last 50 orders
        });

        // Group by status
        const byStatus: Record<string, any[]> = {};
        allOrders.forEach(order => {
            if (!byStatus[order.status]) {
                byStatus[order.status] = [];
            }
            byStatus[order.status].push({
                id: order.id,
                orderNumber: order.orderNumber,
                createdAt: order.createdAt,
                total: order.total,
                customer: order.customerName || order.userId || 'Guest'
            });
        });

        // Count by status
        const counts: Record<string, number> = {};
        Object.keys(byStatus).forEach(status => {
            counts[status] = byStatus[status].length;
        });

        res.json({
            totalOrders: allOrders.length,
            counts,
            ordersByStatus: byStatus,
            sample: allOrders.slice(0, 5),
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Orders reality check error:', error);
        res.status(500).json({
            error: error.message,
            code: error.code,
            meta: error.meta
        });
    }
});

// Check Order table schema
router.get('/order-schema', async (req, res) => {
    try {
        // Get one order to inspect actual columns
        const sampleOrder = await prisma.order.findFirst();

        res.json({
            sampleOrder: sampleOrder || null,
            columns: sampleOrder ? Object.keys(sampleOrder) : [],
            hasOrders: !!sampleOrder
        });
    } catch (error: any) {
        res.status(500).json({
            error: error.message,
            code: error.code
        });
    }
});

export default router;

