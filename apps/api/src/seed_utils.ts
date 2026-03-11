import { PrismaClient, DiscountType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Add Delivery Zones if missing
  const zones = [
    { pincode: '250001', name: 'Prabhat Nagar', charge: 0 },
    { pincode: '250002', name: 'Saket', charge: 0 },
    { pincode: '250003', name: 'Shastri Nagar', charge: 0 },
    { pincode: '250110', name: 'Modipuram', charge: 40 },
  ];

  for (const zone of zones) {
    await prisma.deliveryZone.upsert({
      where: { pincode: zone.pincode },
      update: zone,
      create: { ...zone, isActive: true }
    });
  }
  console.log('Delivery zones updated.');

  // Add Coupons
  const coupons = [
    { code: 'PIZZA20', type: DiscountType.PERCENTAGE, value: 20, expiry: new Date('2026-12-31'), isActive: true },
    { code: 'FREE50', type: DiscountType.FLAT, value: 50, expiry: new Date('2026-12-31'), isActive: true },
    { code: 'WELCOME', type: DiscountType.FLAT, value: 100, expiry: new Date('2026-12-31'), isActive: true },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon
    });
  }
  console.log('Coupons updated.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
