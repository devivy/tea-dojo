import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Starting seed...');

  // Create Stores
  const store1 = await prisma.store.create({
    data: {
      id: 'store-orchard',
      name: 'Tea Dojo Orchard',
      address: '123 Orchard Road, Singapore 238858',
      phone: '+65 6123 4567',
      isActive: true,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      id: 'store-marina',
      name: 'Tea Dojo Marina Bay',
      address: '456 Marina Bay Sands, Singapore 018956',
      phone: '+65 6234 5678',
      isActive: true,
    },
  });

  console.log('✅ Created stores');

  // Create Menu Items (6 drinks)
  const menuItems = [
    {
      name: 'Classic Milk Tea',
      description: 'Traditional milk tea with a perfect balance of tea and milk',
      price: 5.50,
      category: 'milk-tea',
      imageUrl: '/images/classic-milk-tea.jpg',
    },
    {
      name: 'Brown Sugar Boba',
      description: 'Rich brown sugar syrup with chewy tapioca pearls',
      price: 6.50,
      category: 'milk-tea',
      imageUrl: '/images/brown-sugar-boba.jpg',
    },
    {
      name: 'Matcha Latte',
      description: 'Premium Japanese matcha with creamy milk',
      price: 7.00,
      category: 'specialty',
      imageUrl: '/images/matcha-latte.jpg',
    },
    {
      name: 'Oolong Tea',
      description: 'Fragrant oolong tea leaves brewed to perfection',
      price: 4.50,
      category: 'tea',
      imageUrl: '/images/oolong-tea.jpg',
    },
    {
      name: 'Fruit Tea',
      description: 'Refreshing blend of seasonal fruits and tea',
      price: 6.00,
      category: 'fruit-tea',
      imageUrl: '/images/fruit-tea.jpg',
    },
    {
      name: 'Taro Milk Tea',
      description: 'Creamy taro flavor with milk and tea',
      price: 6.50,
      category: 'milk-tea',
      imageUrl: '/images/taro-milk-tea.jpg',
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  console.log('✅ Created menu items');

  // Create Test Users
  const user1 = await prisma.user.create({
    data: {
      phone: '+6591234567',
      email: 'john@example.com',
      name: 'John Tan',
      loyaltyPoints: 150,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      phone: '+6598765432',
      email: 'sarah@example.com',
      name: 'Sarah Lim',
      loyaltyPoints: 320,
    },
  });

  console.log('✅ Created test users');

  // Create Vouchers
  await prisma.voucher.create({
    data: {
      code: 'WELCOME10',
      title: 'Welcome Discount',
      description: '10% off for new customers',
      type: 'percentage',
      value: 10,
      minOrderValue: 5,
      maxDiscount: 5,
      usageLimit: 100,
      minOrders: 0,
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  });

  await prisma.voucher.create({
    data: {
      code: 'LOYAL5',
      title: 'Loyal Customer $5 Off',
      description: '$5 off for customers with 3+ orders',
      type: 'fixed',
      value: 5,
      minOrderValue: 10,
      minOrders: 3,
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  });

  await prisma.voucher.create({
    data: {
      code: 'FLASH20',
      title: 'Flash Sale 20% Off',
      description: 'Limited time 20% discount',
      type: 'percentage',
      value: 20,
      minOrderValue: 15,
      maxDiscount: 10,
      usageLimit: 50,
      minOrders: 0,
      expiresAt: new Date('2026-02-28'),
      isActive: true,
    },
  });

  console.log('✅ Created vouchers');

  // Create Sample Orders with Loyalty Ledger
  const firstMenuItem = await prisma.menuItem.findFirst();
  
  if (firstMenuItem) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'TD-20260131-0001',
        userId: user1.id,
        storeId: store1.id,
        status: 'completed',
        subtotal: 12.00,
        discount: 0,
        total: 12.00,
        pointsEarned: 12,
        source: 'customer',
        orderItems: {
          create: [
            {
              menuItemId: firstMenuItem.id,
              quantity: 2,
              price: 5.50,
              sweetness: 'normal',
              ice: 'less',
            },
          ],
        },
      },
    });

    // Add loyalty ledger entry
    await prisma.loyaltyLedger.create({
      data: {
        userId: user1.id,
        orderId: order1.id,
        points: 12,
        balance: 162, // 150 + 12
        description: 'Points earned from order TD-20260131-0001',
      },
    });

    console.log('✅ Created sample order and loyalty ledger');
  }

  // Create Sample Grab Orders
  await prisma.grabOrder.create({
    data: {
      grabOrderId: 'GRAB-2026-001',
      rawData: JSON.stringify({
        orderId: 'GRAB-2026-001',
        customer: { name: 'Alice Wong', phone: '+6587654321' },
        items: [
          { name: 'Classic Milk Tea', quantity: 2, price: 5.50 },
          { name: 'Brown Sugar Boba', quantity: 1, price: 6.50 },
        ],
        total: 17.50,
      }),
      customerName: 'Alice Wong',
      customerPhone: '+6587654321',
      items: JSON.stringify([
        { name: 'Classic Milk Tea', quantity: 2, price: 5.50 },
        { name: 'Brown Sugar Boba', quantity: 1, price: 6.50 },
      ]),
      total: 17.50,
      status: 'pending',
      isImported: false,
    },
  });

  console.log('✅ Created sample Grab order');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
