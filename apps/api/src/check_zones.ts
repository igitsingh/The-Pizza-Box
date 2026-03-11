import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const zones = await prisma.deliveryZone.findMany();
  console.log('Delivery Zones:', zones);
  if (zones.length === 0) {
    console.log('No delivery zones found! Adding a default one for Meerut.');
    await prisma.deliveryZone.create({
      data: {
        pincode: '250001',
        name: 'Prabhat Nagar',
        charge: 0,
        isActive: true
      }
    });
    console.log('Added default zone: 250001');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
