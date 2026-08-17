import { getOverview } from '@/services/analyticsService';
import RevenueChart from '@/components/admin/RevenueChart';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const k = await getOverview();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Exploitation</div>
          <h1>Analytiques</h1>
          <p>Vos performances récentes en un coup d&apos;œil.</p>
        </div>
      </div>

      <div className="admin-kpis">
        <div className="admin-kpi admin-kpi--accent">
          <div className="admin-kpi__label">CA total</div>
          <div className="admin-kpi__value">{k.totalRevenue.toFixed(2)} €</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Commandes</div>
          <div className="admin-kpi__value">{k.orderCount}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Payées</div>
          <div className="admin-kpi__value">{k.paidCount}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Panier moyen</div>
          <div className="admin-kpi__value">{k.avgOrderValue.toFixed(2)} €</div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Revenus par jour — 14 derniers jours</h2>
        <RevenueChart data={k.revenueByDay} />
      </div>

      <div className="admin-card">
        <h2>Top articles vendus</h2>
        <table className="admin-table">
          <thead><tr><th>#</th><th>Article</th><th style={{ textAlign: 'right' }}>Quantité</th></tr></thead>
          <tbody>
            {k.topItems.map((it, i) => (
              <tr key={it.name}>
                <td style={{ width: 40, color: 'var(--text-dark-secondary)' }}>{i + 1}</td>
                <td>{it.name}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{it.qty}</td>
              </tr>
            ))}
            {k.topItems.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>Pas encore de vente.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
