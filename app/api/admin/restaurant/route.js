import { handler, ok } from '@/lib/http';
import * as service from '@/services/restaurantService';

export const dynamic = 'force-dynamic';
export const GET = handler(async () => ok(await service.getCurrentRestaurant()));
export const PATCH = handler(async (req) => ok(await service.updateCurrent(await req.json())));
