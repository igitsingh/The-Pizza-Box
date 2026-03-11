import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Generating 10 test customer accounts...');

    const users = [];
    for (let i = 1; i <= 10; i++) {
        const email = `tester${i}@thepizzabox.in`;
        const phone = `999990000${i - 1}`;
        
        users.push({
            name: `Pizza Tester ${i}`,
            email,
            phone,
            password: 'Password@123', // Hardcoded for QA simplicity
            role: 'CUSTOMER',
            referralCode: `TESTER${i}`
        });
    }

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: user,
            create: user,
        });
        console.log(`- Created/Updated: ${user.name} (${user.email})`);
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
