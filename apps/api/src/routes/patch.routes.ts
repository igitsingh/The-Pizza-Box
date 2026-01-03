import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/patch-user-table', async (req, res) => {
    try {
        console.log('Starting Comprehensive Schema Patch...');
        const log: string[] = [];

        // 0. Enum Patch (Prerequisites)
        const enums = [
            `DO $$ BEGIN CREATE TYPE "OrderType" AS ENUM ('INSTANT', 'SCHEDULED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "NotificationChannel" AS ENUM ('LOG', 'SMS', 'WHATSAPP', 'EMAIL'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "NotificationEvent" AS ENUM ('ORDER_PLACED', 'ORDER_ACCEPTED', 'ORDER_PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'SCHEDULED_ORDER_CONFIRMED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "OrderStatus" AS ENUM ('SCHEDULED', 'PENDING', 'ACCEPTED', 'PREPARING', 'BAKING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`
        ];

        for (const enumSql of enums) {
            await prisma.$executeRawUnsafe(enumSql);
        }
        log.push('Enums patched.');

        // 1. User Table Patch (Confirmed working, but keeping for safety)
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otp" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3);`);
        log.push('User table patched.');

        // 2. Order Table Patch
        const orderCols = [
            'ADD COLUMN IF NOT EXISTS "customerName" TEXT',
            'ADD COLUMN IF NOT EXISTS "customerPhone" TEXT',
            'ADD COLUMN IF NOT EXISTS "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "tax" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "deliveryPartnerId" TEXT',
            'ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0',
            'ADD COLUMN IF NOT EXISTS "guestAddress" JSONB',
            'ADD COLUMN IF NOT EXISTS "instructions" TEXT',
            'ADD COLUMN IF NOT EXISTS "invoiceGeneratedAt" TIMESTAMP(3)',
            'ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT',
            'ADD COLUMN IF NOT EXISTS "isRepeated" BOOLEAN NOT NULL DEFAULT false',
            'ADD COLUMN IF NOT EXISTS "repeatedFromOrderId" TEXT',
            'ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP(3)',
            'ADD COLUMN IF NOT EXISTS "taxBreakup" JSONB',
            'ADD COLUMN IF NOT EXISTS "orderType" "OrderType" NOT NULL DEFAULT \'INSTANT\''
        ];

        for (const col of orderCols) {
            try {
                await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ${col};`);
            } catch (e: any) {
                log.push(`Warning Order Mod (${col}): ${e.message}`);
            }
        }
        log.push('Order table patched.');

        // DEBUG: Verify guestAddress specifically
        const checkGuest = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name='Order' AND column_name='guestAddress'`);
        log.push(`DEBUG guestAddress check: ${JSON.stringify(checkGuest)}`);

        // 3. Settings Table Patch
        const settingsCols = [
            'ADD COLUMN IF NOT EXISTS "closedMessage" TEXT',
            'ADD COLUMN IF NOT EXISTS "emailEnabled" BOOLEAN NOT NULL DEFAULT false',
            'ADD COLUMN IF NOT EXISTS "isPaused" BOOLEAN NOT NULL DEFAULT false',
            'ADD COLUMN IF NOT EXISTS "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true',
            'ADD COLUMN IF NOT EXISTS "seoDescription" TEXT',
            'ADD COLUMN IF NOT EXISTS "seoOgImage" TEXT',
            'ADD COLUMN IF NOT EXISTS "seoTitle" TEXT',
            'ADD COLUMN IF NOT EXISTS "smsEnabled" BOOLEAN NOT NULL DEFAULT false',
            'ADD COLUMN IF NOT EXISTS "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false'
        ];
        // Ensure Settings table exists first (it might be empty or missing)
        // Usually it's there via basic migration, but columns might be missing.
        for (const col of settingsCols) {
            try {
                await prisma.$executeRawUnsafe(`ALTER TABLE "Settings" ${col};`);
            } catch (e: any) {
                // Ignore if table doesn't exist, unlikely
            }
        }
        log.push('Settings table patched.');

        // 4. Create Missing Tables

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
