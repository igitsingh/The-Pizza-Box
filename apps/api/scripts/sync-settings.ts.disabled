import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.settings.findFirst();

    const data = {
        restaurantName: 'The Pizza Box',
        contactPhone: '+91 1234567890',
        contactEmail: 'hello@thepizzabox.com',
        address: '433, Prabhat Nagar, Meerut, Uttar Pradesh 250001',
        operatingHours: '10:00 AM - 10:00 PM',
        isOpen: true,
        minOrderAmount: 0,
    };

    if (settings) {
        await prisma.settings.update({
            where: { id: settings.id },
            data,
        });
        console.log('Settings updated successfully');
    } else {
        await prisma.settings.create({
            data,
        });
        console.log('Settings created successfully');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
