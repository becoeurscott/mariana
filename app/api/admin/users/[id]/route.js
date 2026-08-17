import { handler, ok } from '@/lib/http';
import * as service from '@/services/userService';

export const PATCH = handler(async (req, { params }) => {
  const { role } = await req.json();
  return ok(await service.setUserRole(params.id, role));
});
export const DELETE = handler(async (_req, { params }) => { await service.deleteUser(params.id); return ok({ ok: true }); });
