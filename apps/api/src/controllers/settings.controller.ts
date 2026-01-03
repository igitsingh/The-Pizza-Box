import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPublicSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();

        // If no settings exist, return default values
        if (!settings) {
            return res.json({
                restaurantName: 'The Pizza Box',
                contactPhone: '',
                contactEmail: '',
                address: '',
                minOrderAmount: 0,
                operatingHours: '9 AM - 11 PM',
                isOpen: true,
                isPaused: false,
                notificationsEnabled: true
            });
        }

        res.json(settings);
    } catch (error: any) {
        console.error('Get public settings error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });

        // Return default settings instead of 500
        res.json({
            restaurantName: 'The Pizza Box',
            contactPhone: '',
            contactEmail: '',
            address: '',
            minOrderAmount: 0,
            operatingHours: '9 AM - 11 PM',
            isOpen: true,
            isPaused: false,
            notificationsEnabled: true
        });
    }
};
