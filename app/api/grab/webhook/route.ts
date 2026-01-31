import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Store the incoming Grab order
    const grabOrder = await prisma.grabOrder.create({
      data: {
        grabOrderId: data.orderId || `GRAB-${Date.now()}`,
        rawData: JSON.stringify(data),
        customerName: data.customer?.name || null,
        customerPhone: data.customer?.phone || null,
        items: JSON.stringify(data.items || []),
        total: data.total || 0,
        status: 'pending',
        isImported: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Grab order received',
      id: grabOrder.id,
    });
  } catch (error) {
    console.error('Error processing Grab webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process Grab order' },
      { status: 500 }
    );
  }
}
