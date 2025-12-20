import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middlewares/auth.middleware';

const prisma = new PrismaClient();

// Generate unique referral code
const generateReferralCode = (name: string): string => {
    const namePrefix = name.substring(0, 3).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${namePrefix}${randomSuffix}`;
};

// GET /api/referral/my-code - Get user's referral code
export const getMyReferralCode = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                referralCode: true,
                totalReferrals: true,
                referralReward: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate referral code if doesn't exist
        if (!user.referralCode) {
            const newCode = generateReferralCode(user.name);
            user = await prisma.user.update({
                where: { id: userId },
                data: { referralCode: newCode },
                select: {
                    id: true,
                    name: true,
                    referralCode: true,
                    totalReferrals: true,
                    referralReward: true
                }
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Get referral code error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/referral/apply - Apply referral code during signup/first order
export const applyReferralCode = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { referralCode } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!referralCode) {
            return res.status(400).json({ message: 'Referral code is required' });
        }

        // Check if user already has a referrer
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user?.referredBy) {
            return res.status(400).json({ message: 'You have already used a referral code' });
        }

        // Find referrer by code
        const referrer = await prisma.user.findUnique({
            where: { referralCode }
        });

        if (!referrer) {
            return res.status(404).json({ message: 'Invalid referral code' });
        }

        if (referrer.id === userId) {
            return res.status(400).json({ message: 'You cannot refer yourself' });
        }

        // Update user with referrer
        await prisma.user.update({
            where: { id: userId },
            data: { referredBy: referrer.id }
        });

        res.json({ message: 'Referral code applied successfully', referrer: referrer.name });
    } catch (error) {
        console.error('Apply referral code error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/referral/my-referrals - Get user's referral stats
export const getMyReferrals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [user, referrals, transactions] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    referralCode: true,
                    totalReferrals: true,
                    referralReward: true
                }
            }),
            prisma.user.findMany({
                where: { referredBy: userId },
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.referralTransaction.findMany({
                where: { referrerId: userId },
                include: {
                    referee: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        res.json({
            referralCode: user?.referralCode,
            totalReferrals: user?.totalReferrals || 0,
            totalRewards: user?.referralReward || 0,
            referrals,
            transactions
        });
    } catch (error) {
        console.error('Get my referrals error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
