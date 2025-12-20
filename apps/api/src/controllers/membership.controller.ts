import { Request, Response } from 'express';
import { PrismaClient, MembershipTier } from '@prisma/client';
import { AuthRequest } from '../../middlewares/auth.middleware';

const prisma = new PrismaClient();

// Membership tier thresholds (lifetime spending)
const TIER_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 5000,
    GOLD: 15000,
    PLATINUM: 50000
};

// Membership benefits
const TIER_BENEFITS = {
    BRONZE: {
        discount: 0,
        freeDelivery: false,
        prioritySupport: false,
        pointsMultiplier: 1
    },
    SILVER: {
        discount: 5,
        freeDelivery: false,
        prioritySupport: false,
        pointsMultiplier: 1.5
    },
    GOLD: {
        discount: 10,
        freeDelivery: true,
        prioritySupport: true,
        pointsMultiplier: 2
    },
    PLATINUM: {
        discount: 15,
        freeDelivery: true,
        prioritySupport: true,
        pointsMultiplier: 3
    }
};

// Calculate tier based on spending
const calculateTier = (lifetimeSpending: number): MembershipTier => {
    if (lifetimeSpending >= TIER_THRESHOLDS.PLATINUM) return 'PLATINUM';
    if (lifetimeSpending >= TIER_THRESHOLDS.GOLD) return 'GOLD';
    if (lifetimeSpending >= TIER_THRESHOLDS.SILVER) return 'SILVER';
    return 'BRONZE';
};

// GET /api/membership/my-tier - Get user's membership info
export const getMyMembership = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                membershipTier: true,
                membershipPoints: true,
                lifetimeSpending: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentTier = user.membershipTier;
        const benefits = TIER_BENEFITS[currentTier];

        // Calculate next tier progress
        const nextTier = currentTier === 'PLATINUM' ? null :
            currentTier === 'GOLD' ? 'PLATINUM' :
                currentTier === 'SILVER' ? 'GOLD' : 'SILVER';

        const nextTierThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
        const progressToNext = nextTierThreshold ?
            ((user.lifetimeSpending / nextTierThreshold) * 100).toFixed(1) : 100;

        res.json({
            tier: currentTier,
            points: user.membershipPoints,
            lifetimeSpending: user.lifetimeSpending,
            benefits,
            nextTier,
            nextTierThreshold,
            progressToNext: parseFloat(progressToNext),
            memberSince: user.createdAt
        });
    } catch (error) {
        console.error('Get membership error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/membership/benefits - Get all tier benefits
export const getAllTierBenefits = async (req: Request, res: Response) => {
    try {
        const tiers = Object.entries(TIER_BENEFITS).map(([tier, benefits]) => ({
            tier,
            threshold: TIER_THRESHOLDS[tier as MembershipTier],
            benefits
        }));

        res.json({ tiers });
    } catch (error) {
        console.error('Get tier benefits error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/membership/update-tier - Update user tier (called after order)
export const updateMembershipTier = async (userId: string, orderAmount: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return;

        const newLifetimeSpending = user.lifetimeSpending + orderAmount;
        const newTier = calculateTier(newLifetimeSpending);
        const pointsEarned = Math.floor(orderAmount * TIER_BENEFITS[newTier].pointsMultiplier);

        await prisma.user.update({
            where: { id: userId },
            data: {
                lifetimeSpending: newLifetimeSpending,
                membershipTier: newTier,
                membershipPoints: user.membershipPoints + pointsEarned
            }
        });

        return { newTier, pointsEarned };
    } catch (error) {
        console.error('Update membership tier error:', error);
    }
};

export { TIER_BENEFITS, calculateTier };
