
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('🔄 Restoring Missing Users...');

    const usersToRestore = [
        { name: 'Amit Verma', email: 'amit@example.com', phone: '9876543210' },
        { name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211' },
        { name: 'Rohan Das', email: 'rohan@example.com', phone: '9876543212' },
        { name: 'Sneha Kapoor', email: 'sneha@example.com', phone: '9876543213' },
        { name: 'Vikram Malhotra', email: 'vikram@example.com', phone: '9876543214' }
    ];

    const password = await bcrypt.hash('password123', 10);

    for (const u of usersToRestore) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                name: u.name,
                email: u.email,
                phone: u.phone,
                password: password,
                role: 'CUSTOMER',
                createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))) // Random join date in last 30 days
            }
        });
        console.log(`✅ Restored: ${u.name}`);
    }

    // Assign some random orders to them to make it look real
    const users = await prisma.user.findMany({ where: { email: { in: usersToRestore.map(u => u.email) } } });
    const items = await prisma.item.findMany({ take: 5 });

    if (items.length > 0) {
        for (const user of users) {
            // Create 1-3 random orders for each
            const orderCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < orderCount; i++) {
                const item = items[Math.floor(Math.random() * items.length)];
                await prisma.order.create({
                    data: {
                        userId: user.id,
                        customerName: user.name,
                        customerPhone: user.phone,
                        total: item.price * 2,
                        subtotal: item.price * 2,
                        status: 'DELIVERED', // Prisma enum might be strict, let's use valid ones
                        paymentMethod: 'UPI',
                        paymentStatus: 'PAID',
                        items: {
                            create: [{
                                itemId: item.id,
                                name: item.name,
                                price: item.price,
                                quantity: 2
                            }]
                        }
                    }
                });
            }
            console.log(`✅ Assigned orders to: ${user.name}`);
        }
    }

    console.log('🎉 User Restoration Complete!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
