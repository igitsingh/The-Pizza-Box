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
                // Do not expose partial key for security, just boolean
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
            // Not sending full stack to client for slight security, but message is needed
        });
    }
});

export default router;
