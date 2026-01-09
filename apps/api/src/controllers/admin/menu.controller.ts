import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createItem = async (req: Request, res: Response) => {
    try {
        const { name, description, price, image, categoryId, isVeg, isSpicy, isBestSeller, stock, isStockManaged, variants } = req.body;

        const item = await (prisma as any).item.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                isVeg: isVeg || false,
                isSpicy: isSpicy || false,
                isBestSeller: isBestSeller || false,
                stock: stock ? parseInt(stock) : 100,
                isStockManaged: isStockManaged || false,
                variants: variants ? {
                    create: variants.map((v: any) => ({
                        type: v.type,
                        label: v.label,
                        price: parseFloat(v.price),
                        isAvailable: v.isAvailable ?? true
                    }))
                } : undefined
            },
            include: {
                Variant: true
            }
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, categoryId, isVeg, isSpicy, isBestSeller, isAvailable, stock, isStockManaged, variants } = req.body;

        // Delete existing variants and recreate if variants are provided
        if (variants) {
            await (prisma as any).variant.deleteMany({ where: { itemId: id } });
        }

        const item = await (prisma as any).item.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                isVeg,
                isSpicy,
                isBestSeller,
                isAvailable,
                stock: stock ? parseInt(stock) : undefined,
                isStockManaged: isStockManaged,
                variants: variants ? {
                    create: variants.map((v: any) => ({
                        type: v.type,
                        label: v.label,
                        price: parseFloat(v.price),
                        isAvailable: v.isAvailable ?? true
                    }))
                } : undefined
            },
            include: {
                Variant: true
            }
        });

        res.json(item);
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await (prisma as any).item.delete({
            where: { id },
        });

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await (prisma as any).item.findMany({
            include: {
                category: true,
                Variant: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(items);
    } catch (error) {
        console.error('Get all items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Separate Variant CRUD
export const createVariant = async (req: Request, res: Response) => {
    try {
        const { itemId, type, label, price, isAvailable } = req.body;
        const variant = await (prisma as any).variant.create({
            data: { itemId, type, label, price: parseFloat(price), isAvailable }
        });
        res.status(201).json(variant);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateVariant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { type, label, price, isAvailable } = req.body;
        const variant = await (prisma as any).variant.update({
            where: { id },
            data: { type, label, price: parseFloat(price), isAvailable }
        });
        res.json(variant);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleVariantAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;
        const variant = await (prisma as any).variant.update({
            where: { id },
            data: { isAvailable }
        });
        res.json(variant);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
