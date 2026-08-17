import { handler, ok } from '@/lib/http';
import * as service from '@/services/menuService';

export const PUT = handler(async (req, { params }) => ok(await service.updateMenuCategory(params.id, await req.json())));
export const DELETE = handler(async (_req, { params }) => { await service.deleteMenuCategory(params.id); return ok({ ok: true }); });
