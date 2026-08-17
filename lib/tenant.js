import { prisma } from '@/lib/db';

/**
 * Resolve the active restaurant (tenant).
 * V1: single restaurant — take the first active one (or by slug if provided).
 * Later: per-domain, per-subdomain, per-header, per-user-membership etc.
 */
export async function getActiveRestaurant(slug) {
  if (slug) {
    const r = await prisma.restaurant.findUnique({ where: { slug } });
    if (r) return r;
  }
  const r = await prisma.restaurant.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } });
  if (!r) throw new Error('No active restaurant configured. Run `npm run prisma:seed`.');
  return r;
}

/** Convenience: just the id. */
export async function getActiveRestaurantId(slug) {
  return (await getActiveRestaurant(slug)).id;
}
