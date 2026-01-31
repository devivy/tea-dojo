import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { grabOrderId } = await request.json();

    // Find the Grab order
    const grabOrder = await prisma.grabOrder.findUnique({
      where: { id: grabOrderId },
    });

    if (!grabOrder) {
      return NextResponse.json(
        { error: 'Grab order not found' },
        { status: 404 }
      );
    }

    if (grabOrder.isImported) {
      return NextResponse.json(
        { error: 'Order already imported' },
        { status: 400 }
      );
    }

    // Parse items
    const items = JSON.parse(grabOrder.items);

    // Get the first store (default)
    const store = await prisma.store.findFirst();
    if (!store) {
      return NextResponse.json(
        { error: 'No store found' },
        { status: 500 }
      );
    }

    // Find or create user
    let user = null;
    if (grabOrder.customerPhone) {
      user = await prisma.user.findUnique({
        where: { phone: grabOrder.customerPhone },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: grabOrder.customerPhone,
            name: grabOrder.customerName,
            loyaltyPoints: 0,
          },
        });
      }
    }

    // Generate order number
    const orderNumber = `TD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate points
    const pointsEarned = Math.floor(grabOrder.total);

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user?.id,
        storeId: store.id,
        status: 'confirmed',
        subtotal: grabOrder.total,
        discount: 0,
        total: grabOrder.total,
        pointsEarned,
        source: 'grab',
        grabOrderId: grabOrder.id,
        orderItems: {
          create: items.map((item: any) => {
            // Try to find matching menu item
            return {
              menuItemId: 'unknown', // Will need to handle this properly
              quantity: item.quantity,
              price: item.price,
              notes: `Grab order: ${item.name}`,
            };
          }),
        },
      },
    });

    // Update Grab order
    await prisma.grabOrder.update({
      where: { id: grabOrderId },
      data: {
        isImported: true,
        importedOrderId: order.id,
      },
    });

    // Update user loyalty points
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
          description: `Points earned from Grab order ${orderNumber}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error('Error importing Grab order:', error);
    return NextResponse.json(
      { error: 'Failed to import Grab order' },
      { status: 500 }
    );
  }
}
