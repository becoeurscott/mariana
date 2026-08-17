import { handler, ok } from '@/lib/http';
import * as service from '@/services/analyticsService';

export const dynamic = 'force-dynamic';
export const GET = handler(async () => ok(await service.getOverview()));
