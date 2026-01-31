import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const voucher = await prisma.voucher.create({
      data: {
        code: data.code.toUpperCase(),
        title: data.title,
        description: data.description || null,
        type: data.type,
        value: data.value,
        minOrderValue: data.minOrderValue,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        minOrders: data.minOrders,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: true,
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.error('Error creating voucher:', error);
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    );
  }
}
