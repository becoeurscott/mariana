import { handler, ok } from '@/lib/http';
import * as service from '@/services/menuService';

export const PUT = handler(async (req, { params }) => {
  const body = await req.json();
  return ok(await service.updateMenuItem(params.id, body));
});

export const DELETE = handler(async (_req, { params }) => {
  await service.deleteMenuItem(params.id);
  return ok({ ok: true });
});
