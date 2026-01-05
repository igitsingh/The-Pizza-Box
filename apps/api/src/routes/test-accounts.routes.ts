import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// TEMPORARY ENDPOINT - Create test accounts in production
router.post('/create-test-accounts', async (req, res) => {
    try {
        const { secret } = req.body;

        if (secret !== 'create-test-accounts-2026') {
            return res.status(403).json({ message: 'Invalid secret' });
        }

        const testAccounts = [
            {
                name: 'Test Customer 1',
                email: 'test1@thepizzabox.com',
                phone: '+919999999991',
                password: 'test123',
                addresses: [
                    { street: '123, MG Road', city: 'Meerut', zip: '250001' },
                    { street: '456, Civil Lines', city: 'Meerut', zip: '250002' },
                ]
            },
            {
                name: 'Test Customer 2',
                email: 'test2@thepizzabox.com',
                phone: '+919999999992',
                password: 'test123',
                addresses: [
                    { street: '789, Shastri Nagar', city: 'Meerut', zip: '250001' },
                ]
            },
            {
                name: 'Test Customer 3',
                email: 'test3@thepizzabox.com',
                phone: '+919999999993',
                password: 'test123',
                addresses: [
                    { street: '101, Saket', city: 'Meerut', zip: '250003' },
                    { street: '202, Shivaji Nagar', city: 'Meerut', zip: '250004' },
                ]
            },
            {
                name: 'Test Customer 4',
                email: 'test4@thepizzabox.com',
                phone: '+919999999994',
                password: 'test123',
                addresses: [
                    { street: '303, Begum Bridge', city: 'Meerut', zip: '250001' },
                ]
            },
            {
                name: 'Test Customer 5',
                email: 'test5@thepizzabox.com',
                phone: '+919999999995',
                password: 'test123',
                addresses: [
                    { street: '404, Kanker Khera', city: 'Meerut', zip: '250002' },
                    { street: '505, Lalkurti', city: 'Meerut', zip: '250003' },
                ]
            },
            {
                name: 'Test Customer 6',
                email: 'test6@thepizzabox.com',
                phone: '+919999999996',
                password: 'test123',
                addresses: [
                    { street: '606, Garh Road', city: 'Meerut', zip: '250005' },
                ]
            },
            {
                name: 'Test Customer 7',
                email: 'test7@thepizzabox.com',
                phone: '+919999999997',
                password: 'test123',
                addresses: [
                    { street: '707, Delhi Road', city: 'Meerut', zip: '250001' },
                ]
            },
            {
                name: 'Test Customer 8',
                email: 'test8@thepizzabox.com',
                phone: '+919999999998',
                password: 'test123',
                addresses: [
                    { street: '808, Hapur Road', city: 'Meerut', zip: '250002' },
                    { street: '909, Roorkee Road', city: 'Meerut', zip: '250003' },
                ]
            },
            {
                name: 'Test Customer 9',
                email: 'test9@thepizzabox.com',
                phone: '+919999999999',
                password: 'test123',
                addresses: [
                    { street: '1010, Partapur', city: 'Meerut', zip: '250004' },
                ]
            },
            {
                name: 'Test Customer 10',
                email: 'test10@thepizzabox.com',
                phone: '+919999999990',
                password: 'test123',
                addresses: [
                    { street: '1111, Modipuram', city: 'Meerut', zip: '250005' },
                    { street: '1212, Mawana Road', city: 'Meerut', zip: '250001' },
                ]
            },
        ];

        const created = [];
        const skipped = [];

        for (const account of testAccounts) {
            try {
                // Check if user exists
                const existing = await prisma.user.findUnique({
                    where: { email: account.email }
                });

                if (existing) {
                    skipped.push(account.email);
                    continue;
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(account.password, 10);

                // Create user with addresses
                const user = await prisma.user.create({
                    data: {
                        name: account.name,
                        email: account.email,
                        phone: account.phone,
                        password: hashedPassword,
                        role: 'CUSTOMER',
                        addresses: {
                            create: account.addresses
                        }
                    },
                    include: {
                        addresses: true
                    }
                });

                created.push({
                    email: user.email,
                    name: user.name,
                    addressCount: user.addresses.length
                });
            } catch (error: any) {
                console.error(`Error creating ${account.email}:`, error.message);
            }
        }

        res.json({
            success: true,
            message: 'Test accounts creation completed',
            created: created.length,
            skipped: skipped.length,
            accounts: created,
            skippedAccounts: skipped
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create test accounts',
            error: error.message
        });
    }
});

export default router;
