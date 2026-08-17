import { handler, ok } from '@/lib/http';
import * as service from '@/services/paymentService';

export const POST = handler(async (req) => {
  const { orderId } = await req.json();
  return ok(await service.createIntentForOrder(orderId));
});
