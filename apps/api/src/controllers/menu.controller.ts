import { Request, Response } from 'express';
import prisma from '../config/db';

export const getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                Item: {
                    include: {
                        ItemOption: {
                            include: {
                                OptionChoice: true,
                            },
                        },
                        ItemAddon: true,
                        Variant: true,
                    },
                },
            },
        });

        // Transform data to match frontend expectations
        const transformedCategories = categories.map(category => ({
            ...category,
            items: category.Item.map(item => ({
                ...item,
                options: item.ItemOption.map(option => ({
                    ...option,
                    choices: option.OptionChoice
                })),
                addons: item.ItemAddon,
                variants: item.Variant,
                // Remove the PascalCase versions
                ItemOption: undefined,
                ItemAddon: undefined,
                Variant: undefined
            })),
            Item: undefined // Remove the PascalCase version
        }));

        res.json(transformedCategories);
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            details: error.message,
            code: error.code
        });
    }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                ItemOption: {
                    include: {
                        OptionChoice: true,
                    },
                },
                ItemAddon: true,
                Variant: true,
            },
        });

        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        // Transform data to match frontend expectations
        const transformedItem = {
            ...item,
            options: item.ItemOption.map(option => ({
                ...option,
                choices: option.OptionChoice
            })),
            addons: item.ItemAddon,
            variants: item.Variant,
            ItemOption: undefined,
            ItemAddon: undefined,
            Variant: undefined
        };

        res.json(transformedItem);
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            details: error.message,
            code: error.code
        });
    }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                Item: {
                    include: {
                        ItemOption: {
                            include: {
                                OptionChoice: true,
                            },
                        },
                        ItemAddon: true,
                        Variant: true,
                    },
                },
            },
        });

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        // Transform data to match frontend expectations
        const transformedCategory = {
            ...category,
            items: category.Item.map(item => ({
                ...item,
                options: item.ItemOption.map(option => ({
                    ...option,
                    choices: option.OptionChoice
                })),
                addons: item.ItemAddon,
                variants: item.Variant,
                ItemOption: undefined,
                ItemAddon: undefined,
                Variant: undefined
            })),
            Item: undefined
        };

        res.json(transformedCategory);
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            details: error.message,
            code: error.code
        });
    }
};
