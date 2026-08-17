import { prisma } from '@/lib/db';
import { getActiveRestaurantId } from '@/lib/tenant';

/**
 * Aggregate KPIs for the admin dashboard: revenue, orders, AOV,
 * order counts by status, top items, revenue by day (last 14 days).
 */
export async function getOverview() {
  const restaurantId = await getActiveRestaurantId();
  const orders = await prisma.order.findMany({
    where: { restaurantId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  const paidStatuses = new Set(['PAID', 'ACCEPTED', 'PREPARING', 'READY', 'DISPATCHED', 'DELIVERED']);
  const paid = orders.filter((o) => paidStatuses.has(o.status));

  const totalRevenue  = round(paid.reduce((s, o) => s + o.total, 0));
  const orderCount    = orders.length;
  const paidCount     = paid.length;
  const avgOrderValue = paidCount ? round(totalRevenue / paidCount) : 0;

  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Top items by quantity
  const itemCount = {};
  for (const o of paid) {
    for (const it of o.items) {
      itemCount[it.itemName] = (itemCount[it.itemName] || 0) + it.quantity;
    }
  }
  const topItems = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, qty]) => ({ name, qty }));

  // Revenue by day, last 14 days
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    days.push({ key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), revenue: 0, count: 0 });
  }
  const dayIdx = new Map(days.map((d, i) => [d.key, i]));
  for (const o of paid) {
    const k = new Date(o.createdAt).toISOString().slice(0, 10);
    const i = dayIdx.get(k);
    if (i != null) { days[i].revenue += o.total; days[i].count += 1; }
  }
  days.forEach((d) => { d.revenue = round(d.revenue); });

  return { totalRevenue, orderCount, paidCount, avgOrderValue, byStatus, topItems, revenueByDay: days };
}

function round(n) { return Math.round(n * 100) / 100; }
