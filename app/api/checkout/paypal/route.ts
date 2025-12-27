import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_SECRET!;
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

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

    const origin = request.headers?.get?.('origin') ?? 'http://localhost:3000';

    const requestBody = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    requestBody.prefer('return=representation');
    requestBody.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total?.toFixed?.(2) ?? '0.00',
          },
          items: items?.map?.((item: any) => ({
            name: item?.product?.name ?? 'Product',
            description: item?.product?.description?.substring?.(0, 127) ?? '',
            unit_amount: {
              currency_code: 'USD',
              value: item?.product?.price?.toFixed?.(2) ?? '0.00',
            },
            quantity: (item?.quantity ?? 1)?.toString?.() ?? '1',
          })) ?? [],
        },
      ],
      application_context: {
        return_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/checkout/cancel`,
        brand_name: 'VeloRide Premium',
        user_action: 'PAY_NOW',
      },
    });

    const paypalClient = client();
    const order = await paypalClient.execute(requestBody);

    return NextResponse.json({ orderId: order?.result?.id, links: order?.result?.links });
  } catch (error: any) {
    console.error('PayPal checkout error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
