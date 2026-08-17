import { handler, ok } from '@/lib/http';
import * as service from '@/services/userService';

export const dynamic = 'force-dynamic';
export const GET = handler(async () => ok({ users: await service.listUsers() }));
