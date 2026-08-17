import { prisma } from '@/lib/db';
import { createPaymentIntent } from '@/lib/stripe';
import { httpError } from '@/lib/http';

export async function createIntentForOrder(orderId) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw httpError(404, 'Commande introuvable');

  const intent = await createPaymentIntent({
    amountCents: Math.round(order.total * 100),
    currency: 'eur',
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
  });

  await prisma.payment.upsert({
    where: { orderId: order.id },
    update: { stripePaymentIntentId: intent.id, amount: order.total },
    create: {
      orderId: order.id,
      stripePaymentIntentId: intent.id,
      amount: order.total,
      status: 'PENDING',
      currency: 'eur',
    },
  });

  return { clientSecret: intent.clientSecret, sandbox: intent.sandbox };
}
