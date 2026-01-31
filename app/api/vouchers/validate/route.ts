import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, subtotal, userOrderCount } = await request.json();

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: 'Invalid voucher code' },
        { status: 404 }
      );
    }

    if (!voucher.isActive) {
      return NextResponse.json(
        { error: 'This voucher is no longer active' },
        { status: 400 }
      );
    }

    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This voucher has expired' },
        { status: 400 }
      );
    }

    if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
      return NextResponse.json(
        { error: 'This voucher has reached its usage limit' },
        { status: 400 }
      );
    }

    if (subtotal < voucher.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value of $${voucher.minOrderValue.toFixed(2)} required`,
        },
        { status: 400 }
      );
    }

    if (userOrderCount < voucher.minOrders) {
      return NextResponse.json(
        {
          error: `This voucher requires at least ${voucher.minOrders} previous orders`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (voucher.type === 'percentage') {
      discount = (subtotal * voucher.value) / 100;
      if (voucher.maxDiscount) {
        discount = Math.min(discount, voucher.maxDiscount);
      }
    } else if (voucher.type === 'fixed') {
      discount = voucher.value;
    }

    return NextResponse.json({
      valid: true,
      discount,
      voucher: {
        code: voucher.code,
        title: voucher.title,
        type: voucher.type,
        value: voucher.value,
      },
    });
  } catch (error) {
    console.error('Error validating voucher:', error);
    return NextResponse.json(
      { error: 'Failed to validate voucher' },
      { status: 500 }
    );
  }
}
