import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items, shippingAddress, guestEmail, guestName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!session?.user && (!guestEmail || !guestName)) {
      return NextResponse.json({ error: 'Guest details required' }, { status: 400 });
    }

    const total = items?.reduce?.((sum: number, item: any) => {
      return sum + ((item?.product?.price ?? 0) * (item?.quantity ?? 0));
    }, 0) ?? 0;

    const lineItems = items?.map?.((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item?.product?.name ?? 'Product',
          description: item?.product?.description ?? '',
          images: [item?.product?.imageUrl ?? ''],
        },
        unit_amount: Math.round((item?.product?.price ?? 0) * 100),
      },
      quantity: item?.quantity ?? 1,
    })) ?? [];

    const origin = request.headers?.get?.('origin') ?? 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      customer_email: session?.user?.email ?? guestEmail,
      metadata: {
        userId: session?.user?.id ?? 'guest',
        guestEmail: guestEmail ?? '',
        guestName: guestName ?? '',
        shippingAddress: shippingAddress ?? '',
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
