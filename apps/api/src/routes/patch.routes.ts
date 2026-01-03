import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/patch-user-table', async (req, res) => {
    try {
        console.log('Starting Comprehensive Schema Patch...');
        const log: string[] = [];

        // 1. User Table Patch (Confirmed working, but keeping for safety)
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otp" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3);`);
        log.push('User table patched.');

        // 2. Order Table Patch (Critical for Dashboard)
        // Adding columns one by one to avoid syntax errors if some exist
        const orderCols = [
            'ADD COLUMN IF NOT EXISTS "customerName" TEXT',
            'ADD COLUMN IF NOT EXISTS "customerPhone" TEXT',
            'ADD COLUMN IF NOT EXISTS "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "tax" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "orderType" "OrderType" NOT NULL DEFAULT \'INSTANT\'',
            // 'ADD COLUMN IF NOT EXISTS "orderNumber" SERIAL', // SERIAL cannot be added via ADD COLUMN IF NOT EXISTS easily in Postgres
            'ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT',
            'ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP(3)',
            'ADD COLUMN IF NOT EXISTS "instructions" TEXT'
        ];

        for (const col of orderCols) {
            try {
                await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ${col};`);
            } catch (e: any) {
                log.push(`Warning Order Mod: ${e.message}`);
            }
        }
        log.push('Order table patched.');

        // 3. Create Missing Tables if they don't exist

        // Complaint
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Complaint" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "subject" TEXT NOT NULL,
                "message" TEXT NOT NULL,
                "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
            );
        `);
        log.push('Complaint table check/create done.');

        // Feedback
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Feedback" (
                "id" TEXT NOT NULL,
                "orderId" TEXT NOT NULL,
                "userId" TEXT,
                "guestPhone" TEXT,
                "rating" INTEGER NOT NULL,
                "review" TEXT,
                "adminResponse" TEXT,
                "isVisible" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
            );
        `);
        log.push('Feedback table check/create done.');

        // Create Variant Table (Missing based on API Error)
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Variant" (
                "id" TEXT NOT NULL,
                "itemId" TEXT NOT NULL,
                "type" TEXT NOT NULL,
                "label" TEXT NOT NULL,
                "price" DOUBLE PRECISION NOT NULL,
                "isAvailable" BOOLEAN NOT NULL DEFAULT true,
                CONSTRAINT "Variant_pkey" PRIMARY KEY ("id"),
                CONSTRAINT "Variant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
        log.push('Variant table check/create done.');

        res.json({ message: 'Comprehensive Patch Completed', log });

    } catch (error: any) {
        console.error('Patch Error:', error);
        res.status(500).json({
            message: 'Failed to patch Schema',
            error: error.message
        });
    }
});

export default router;
