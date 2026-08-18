import { prisma } from '@/lib/db';
import { getActiveRestaurantId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const restaurantId = await getActiveRestaurantId();

  const rows = await prisma.order.groupBy({
    by: ['customerEmail'],
    where: { restaurantId, customerEmail: { not: null } },
    _sum: { total: true },
    _count: { _all: true },
    orderBy: { _sum: { total: 'desc' } },
    take: 100,
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Comptes</div>
          <h1>Clients</h1>
          <p>Regroupés par e-mail — Top 100 par valeur cumulée.</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>E-mail</th><th style={{ textAlign: 'right' }}>Commandes</th><th style={{ textAlign: 'right' }}>Total dépensé</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: 40 }}>Pas encore de clients.</td></tr>}
            {rows.map((r) => (
              <tr key={r.customerEmail}>
                <td>{r.customerEmail}</td>
                <td style={{ textAlign: 'right' }}>{r._count._all}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>${(r._sum.total || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
