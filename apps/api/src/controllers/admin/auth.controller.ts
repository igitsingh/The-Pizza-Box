import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/auth';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await (prisma.user as any).findUnique({ where: { email } });

        if (!user || user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Invalid credentials or not an admin' });
        }

        if (!user.password) {
            return res.status(401).json({ message: 'This account does not have a password set. Please use OTP login.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.role);

        // Set HTTP-only cookie
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token, // Also returning token for client-side usage if needed (though cookie is preferred)
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            details: error.message,
            code: error.code,
            meta: error.meta
        });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('admin_token');
    res.json({ message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await (prisma.user as any).findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
