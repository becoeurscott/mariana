import { handler, created } from '@/lib/http';
import * as service from '@/services/menuService';

export const POST = handler(async (req) => created(await service.createMenuCategory(await req.json())));
