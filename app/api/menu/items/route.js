import { handler, created } from '@/lib/http';
import * as service from '@/services/menuService';

export const POST = handler(async (req) => {
  const body = await req.json();
  return created(await service.createMenuItem(body));
});
