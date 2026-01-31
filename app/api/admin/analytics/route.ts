import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all orders
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    });

    // Top Items
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const key = item.menuItem.name;
        if (!itemCounts[key]) {
          itemCounts[key] = { name: key, count: 0, revenue: 0 };
        }
        itemCounts[key].count += item.quantity;
        itemCounts[key].revenue += item.price * item.quantity;
      });
    });
    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Orders by Hour
    const hourCounts: Record<number, number> = {};
    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const ordersByHour = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourCounts[i] || 0,
    }));

    // Customer Segments
    const userIds = new Set(orders.map((o) => o.userId).filter(Boolean));
    const usersWithMultipleOrders = new Set<string>();
    const userOrderCounts: Record<string, number> = {};
    
    orders.forEach((order) => {
      if (order.userId) {
        userOrderCounts[order.userId] = (userOrderCounts[order.userId] || 0) + 1;
        if (userOrderCounts[order.userId] > 1) {
          usersWithMultipleOrders.add(order.userId);
        }
      }
    });

    const customerSegments = {
      new: userIds.size - usersWithMultipleOrders.size,
      returning: usersWithMultipleOrders.size,
    };

    // Voucher Redemptions
    const voucherCounts: Record<string, { code: string; count: number; discount: number }> = {};
    orders.forEach((order) => {
      if (order.voucherCode) {
        if (!voucherCounts[order.voucherCode]) {
          voucherCounts[order.voucherCode] = {
            code: order.voucherCode,
            count: 0,
            discount: 0,
          };
        }
        voucherCounts[order.voucherCode].count += 1;
        voucherCounts[order.voucherCode].discount += order.discount;
      }
    });
    const voucherRedemptions = Object.values(voucherCounts).sort(
      (a, b) => b.count - a.count
    );

    // Totals
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      topItems,
      ordersByHour,
      customerSegments,
      voucherRedemptions,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
