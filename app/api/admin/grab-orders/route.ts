import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const grabOrders = await prisma.grabOrder.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(grabOrders);
  } catch (error) {
    console.error('Error fetching Grab orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Grab orders' },
      { status: 500 }
    );
  }
}
