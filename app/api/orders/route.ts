import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items, total, shippingAddress, paymentMethod, paymentIntentId, guestEmail, guestName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Items required' }, { status: 400 });
    }

    if (!session?.user && (!guestEmail || !guestName)) {
      return NextResponse.json({ error: 'Guest details required' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        guestEmail: guestEmail ?? null,
        guestName: guestName ?? null,
        total,
        status: 'completed',
        paymentMethod,
        paymentIntentId,
        shippingAddress,
        items: {
          create: items?.map?.((item: any) => ({
            productId: item?.productId ?? item?.product?.id,
            quantity: item?.quantity ?? 1,
            price: item?.price ?? item?.product?.price,
          })) ?? [],
        },
      },
      include: {
        items: true,
      },
    });

    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.user.id,
          },
        },
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order create error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
