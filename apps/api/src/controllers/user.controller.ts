import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import prisma from '../config/db';
import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().min(5),
    isDefault: z.boolean().optional(),
});

export const addAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const { street, city, zip, isDefault } = addressSchema.parse(req.body);

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                id: randomUUID(),
                userId,
                street,
                city,
                zip,
                isDefault: isDefault || false,
            },
        });

        res.status(201).json(address);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const getAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const addresses = await prisma.address.findMany({
            where: { userId },
        });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        const address = await prisma.address.findUnique({ where: { id } });

        if (!address || address.userId !== userId) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }

        await prisma.address.delete({ where: { id } });
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;
        const { street, city, zip, isDefault } = addressSchema.parse(req.body);

        const address = await prisma.address.findUnique({ where: { id } });

        if (!address || address.userId !== userId) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                street,
                city,
                zip,
                isDefault: isDefault || false,
            },
        });

        res.json(updatedAddress);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

