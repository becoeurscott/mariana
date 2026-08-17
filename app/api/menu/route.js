import { handler, ok } from '@/lib/http';
import * as service from '@/services/menuService';

export const dynamic = 'force-dynamic';
export const GET = handler(async () => ok(await service.getPublicMenu()));
