import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/patch-user-table', async (req, res) => {
    try {
        console.log('Attempting to patch User table...');

        // 1. Check if column exists (Postgres specific)
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='User' AND column_name='otp';
        `;
        const result: any[] = await prisma.$queryRawUnsafe(checkQuery);

        if (result.length > 0) {
            return res.json({ message: 'User.otp column already exists. No patch needed.' });
        }

        // 2. Add columns manually if missing
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otp" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3);`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isVIP" BOOLEAN NOT NULL DEFAULT false;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notes" TEXT;`);

        // Also fix other critical missing columns if needed (based on previous errors)
        // Order status enum was an issue too?
        // Let's stick to User first to fix login.

        res.json({ message: 'User table patched successfully (Added otp, otpExpiry, isVIP, notes).' });

    } catch (error: any) {
        console.error('Patch Error:', error);
        res.status(500).json({
            message: 'Failed to patch User table',
            error: error.message
        });
    }
});

export default router;
