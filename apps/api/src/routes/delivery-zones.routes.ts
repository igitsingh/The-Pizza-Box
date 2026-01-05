import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// TEMPORARY ENDPOINT - Add delivery zones to production
router.post('/add-delivery-zones', async (req, res) => {
    try {
        const { secret } = req.body;

        if (secret !== 'add-zones-2026') {
            return res.status(403).json({ message: 'Invalid secret' });
        }

        const zones = [
            // Main Meerut City Pincodes
            { pincode: '250001', name: 'Meerut Cantt', charge: 0, isActive: true },
            { pincode: '250002', name: 'Meerut City', charge: 0, isActive: true },
            { pincode: '250003', name: 'Meerut', charge: 0, isActive: true },
            { pincode: '250004', name: 'Meerut East', charge: 0, isActive: true },
            { pincode: '250005', name: 'Meerut West', charge: 0, isActive: true },
            { pincode: '250006', name: 'Meerut', charge: 0, isActive: true },

            // Extended Meerut Areas
            { pincode: '250101', name: 'Meerut Rural', charge: 0, isActive: true },
            { pincode: '250102', name: 'Meerut', charge: 0, isActive: true },
            { pincode: '250103', name: 'Meerut', charge: 0, isActive: true },
            { pincode: '250104', name: 'Meerut', charge: 0, isActive: true },
            { pincode: '250105', name: 'Meerut', charge: 0, isActive: true },
            { pincode: '250106', name: 'Meerut', charge: 0, isActive: true },
            { pincode: '250110', name: 'Meerut', charge: 0, isActive: true },

            // Nearby Areas
            { pincode: '250201', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250221', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250341', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250401', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250501', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250601', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250611', name: 'Meerut District', charge: 0, isActive: true },
            { pincode: '250617', name: 'Meerut District', charge: 0, isActive: true },
        ];

        const results: Array<{
            id: string;
            pincode: string;
            name: string;
            charge: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }> = [];

        for (const zone of zones) {
            const result = await prisma.deliveryZone.upsert({
                where: { pincode: zone.pincode },
                update: zone,
                create: zone,
            });
            results.push(result);
        }

        res.json({
            success: true,
            message: 'Delivery zones configured',
            zones: results
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to add delivery zones',
            error: error.message
        });
    }
});

export default router;
