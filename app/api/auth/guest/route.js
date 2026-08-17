import { handler, ok } from '@/lib/http';
import * as service from '@/services/authService';

export const POST = handler(async () => ok(await service.guest()));
