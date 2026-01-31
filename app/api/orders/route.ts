import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { storeId, items, voucherCode, userPhone, userName } = await request.json();

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    let voucher = null;

    // Validate and apply voucher if provided
    if (voucherCode) {
      voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode },
      });

      if (voucher && voucher.isActive) {
        if (voucher.type === 'percentage') {
          discount = (subtotal * voucher.value) / 100;
          if (voucher.maxDiscount) {
            discount = Math.min(discount, voucher.maxDiscount);
          }
        } else if (voucher.type === 'fixed') {
          discount = voucher.value;
        }

        // Update voucher usage count
        await prisma.voucher.update({
          where: { code: voucherCode },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    const total = subtotal - discount;

    // Calculate loyalty points (1 point per dollar)
    const pointsEarned = Math.floor(total);

    // Find or create user
    let user = null;
    if (userPhone) {
      user = await prisma.user.findUnique({
        where: { phone: userPhone },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: userPhone,
            name: userName,
            loyaltyPoints: 0,
          },
        });
      }
    }

    // Generate order number
    const orderNumber = `TD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user?.id,
        storeId,
        status: 'pending',
        subtotal,
        discount,
        total,
        voucherCode: voucherCode || null,
        pointsEarned,
        source: 'customer',
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            sweetness: item.sweetness,
            ice: item.ice,
            addOns: item.addOns ? JSON.stringify(item.addOns) : null,
            notes: item.notes,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        store: true,
      },
    });

    // Update user loyalty points and create ledger entry
    if (user) {
      const newBalance = user.loyaltyPoints + pointsEarned;

      await prisma.user.update({
        where: { id: user.id },
        data: { loyaltyPoints: newBalance },
      });

      await prisma.loyaltyLedger.create({
        data: {
          userId: user.id,
          orderId: order.id,
          points: pointsEarned,
          balance: newBalance,
          description: `Points earned from order ${orderNumber}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        pointsEarned: order.pointsEarned,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
