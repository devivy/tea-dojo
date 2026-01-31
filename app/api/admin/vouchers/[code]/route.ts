import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const data = await request.json();

    const voucher = await prisma.voucher.update({
      where: { code },
      data: {
        isActive: data.isActive,
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.error('Error updating voucher:', error);
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    );
  }
}
