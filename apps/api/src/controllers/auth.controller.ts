import { Request, Response } from 'express';
import prisma from '../config/db';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional(),
});

const loginSchema = z.object({
    identifier: z.string().optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
});

const otpSchema = z.object({
    phone: z.string().min(10),
    otp: z.string().length(6).optional(),
    name: z.string().optional(),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, phone } = signupSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
            },
        });

        const token = generateToken(user.id, user.role);
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, password } = loginSchema.parse(req.body);


        // Check if identifier is email or phone

        let user;
        if (identifier) {
            const isEmail = identifier.includes('@');
            if (isEmail) {
                user = await prisma.user.findUnique({ where: { email: identifier } });
            } else {
                // Assuming phone is unique. If not defined as unique in schema, findFirst
                user = await prisma.user.findFirst({ where: { phone: identifier } });
            }
        }

        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'Password is required' });
            return;
        }

        if (!user.password) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id, user.role);

        if (user.role === 'ADMIN') {
            res.cookie('admin_token', token, {
                httpOnly: true,
                secure: false, // Allow on http for localhost
                sameSite: 'lax', // Shared across localhost ports
                domain: 'localhost', // Explicitly set domain
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
        }

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, googleId } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Google User',
                    password: await hashPassword(Math.random().toString(36).slice(-8)), // Random password
                    // Store googleId if you had a field for it, or just rely on email
                },
            });
        }

        const token = generateToken(user.id, user.role);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const whatsappLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, otp, name } = req.body;

        // Mock OTP verification
        if (otp !== '123456') {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }

        let user = await prisma.user.findFirst({ where: { phone } });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: `${phone}@whatsapp.com`, // Placeholder email
                    phone,
                    name: name || 'WhatsApp User',
                    password: await hashPassword(Math.random().toString(36).slice(-8)),
                },
            });
        }

        const token = generateToken(user.id, user.role);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
    } catch (error) {
        console.error('WhatsApp login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore - user is attached by middleware
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, phone: true, addresses: true },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone } = otpSchema.parse(req.body);

        // Mock OTP generation
        const otp = '123456';
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Find or create user to store OTP
        let user = await (prisma.user as any).findUnique({ where: { phone } });

        if (!user) {
            // If doesn't exist, we don't create it yet, we just note that this phone needs an OTP
            // To keep it simple, let's create the user with a placeholder name.
            user = await (prisma.user as any).create({
                data: {
                    phone,
                    name: 'Guest User',
                    otp,
                    otpExpiry
                }
            });
        } else {
            await (prisma.user as any).update({
                where: { id: user.id },
                data: { otp, otpExpiry }
            });
        }

        console.log(`[OTP] Sent to ${phone}: ${otp}`);
        res.json({ message: 'OTP sent successfully', otp }); // Returning OTP for development ease
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            console.error('Send OTP error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, otp, name } = otpSchema.parse(req.body);
        console.log(`[Auth] Verifying OTP for ${phone}: ${otp}`);



        const user = await (prisma.user as any).findUnique({ where: { phone } });

        if (!user || user.otp !== otp) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        // Check expiry if needed
        if (user.otpExpiry && (user.otpExpiry as Date) < new Date()) {
            res.status(400).json({ message: 'OTP has expired' });
            return;
        }

        // Update user: clear OTP and set name if provided
        const updatedUser = await (prisma.user as any).update({
            where: { id: user.id },
            data: {
                otp: null,
                otpExpiry: null,
                name: name || user.name
            }
        });

        const token = generateToken(updatedUser.id, updatedUser.role);
        res.json({ token, user: updatedUser });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            console.error('Verify OTP error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
