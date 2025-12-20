import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/enquiry - Submit enquiry (public)
export const submitEnquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message, source } = req.body;

        // Validation
        if (!name || !phone || !message) {
            return res.status(400).json({ message: 'Name, phone, and message are required' });
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits.' });
        }

        // Create enquiry
        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                email: email || null,
                phone,
                message,
                source: source || 'CONTACT_FORM',
                status: 'NEW'
            }
        });

        res.status(201).json({
            message: 'Enquiry submitted successfully. We will contact you soon!',
            enquiry: {
                id: enquiry.id,
                name: enquiry.name,
                phone: enquiry.phone
            }
        });
    } catch (error) {
        console.error('Submit enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/enquiry/callback - Request callback (public)
export const requestCallback = async (req: Request, res: Response) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                phone,
                message: 'Customer requested a callback',
                source: 'CALL_BACK',
                status: 'NEW'
            }
        });

        res.status(201).json({
            message: 'Callback request received! We will call you shortly.',
            enquiry: {
                id: enquiry.id,
                name: enquiry.name
            }
        });
    } catch (error) {
        console.error('Request callback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/enquiry/whatsapp - WhatsApp enquiry (public)
export const whatsappEnquiry = async (req: Request, res: Response) => {
    try {
        const { name, phone, message } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                phone,
                message: message || 'Customer enquiry via WhatsApp',
                source: 'WHATSAPP',
                status: 'NEW'
            }
        });

        // In production, this would trigger WhatsApp Business API
        // For now, just save the enquiry

        res.status(201).json({
            message: 'WhatsApp enquiry received!',
            enquiry: {
                id: enquiry.id,
                name: enquiry.name
            }
        });
    } catch (error) {
        console.error('WhatsApp enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
