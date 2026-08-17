import { handler, ok } from '@/lib/http';
import * as service from '@/services/orderService';

export const PATCH = handler(async (req, { params }) => {
  const body = await req.json();
  return ok(await service.changeStatus(params.id, body));
});
