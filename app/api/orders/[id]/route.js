import { handler, ok } from '@/lib/http';
import * as service from '@/services/orderService';

export const dynamic = 'force-dynamic';
export const GET = handler(async (_req, { params }) => ok(await service.getOrder(params.id)));
