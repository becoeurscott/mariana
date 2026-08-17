import { handler, ok, created } from '@/lib/http';
import * as service from '@/services/orderService';

export const POST = handler(async (req) => {
  const body = await req.json();
  return created(await service.placeOrder(body));
});

export const GET = handler(async (req) => {
  const status = new URL(req.url).searchParams.get('status') || undefined;
  return ok({ orders: await service.listAdminOrders({ status }) });
});
