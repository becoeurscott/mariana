import Link from 'next/link';
import { getOverview } from '@/services/analyticsService';
import { getCurrentRestaurant } from '@/services/restaurantService';
import RevenueChart from '@/components/admin/RevenueChart';

export const dynamic = 'force-dynamic';

const STATUS_LABEL = {
  PENDING: 'En attente', ACCEPTED: 'Acceptée', PREPARING: 'En cuisine',
  READY: 'Prête', DISPATCHED: 'En livraison', DELIVERED: 'Livrée',
  CANCELLED: 'Annulée', PAID: 'Payée',
};

export default async function AdminHome() {
  const [k, restaurant] = await Promise.all([getOverview(), getCurrentRestaurant()]);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Console admin</div>
          <h1>Bonjour, {restaurant.name}</h1>
          <p>Un aperçu rapide de votre activité aujourd&apos;hui.</p>
        </div>
        <Link href="/admin/orders" className="btn btn-primary btn-sm">Voir les commandes</Link>
      </div>

      <div className="admin-kpis">
        <div className="admin-kpi admin-kpi--accent">
          <div className="admin-kpi__label">Chiffre d&apos;affaires</div>
          <div className="admin-kpi__value">${k.totalRevenue.toFixed(2)}</div>
          <div className="admin-kpi__hint">Sur les {Math.min(500, k.orderCount)} dernières commandes</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Commandes payées</div>
          <div className="admin-kpi__value">{k.paidCount}</div>
          <div className="admin-kpi__hint">{k.orderCount - k.paidCount} en cours ou annulées</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Panier moyen</div>
          <div className="admin-kpi__value">${k.avgOrderValue.toFixed(2)}</div>
          <div className="admin-kpi__hint">Taxe + livraison inclus</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Taxe appliquée</div>
          <div className="admin-kpi__value">{restaurant.taxRate}%</div>
          <div className="admin-kpi__hint">Livraison ${restaurant.deliveryFee.toFixed(2)}</div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Revenus — 14 derniers jours</h2>
        <RevenueChart data={k.revenueByDay} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }} className="admin-cols">
        <div className="admin-card">
          <h2>Top articles</h2>
          <table className="admin-table">
            <thead><tr><th>Article</th><th style={{ textAlign: 'right' }}>Quantité</th></tr></thead>
            <tbody>
              {k.topItems.length === 0 && <tr><td colSpan={2}>Pas encore de vente.</td></tr>}
              {k.topItems.map((it) => (
                <tr key={it.name}>
                  <td>{it.name}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{it.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h2>Commandes par statut</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(k.byStatus).sort((a,b)=>b[1]-a[1]).map(([s, count]) => (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'white', borderRadius: 10, border: '1px solid var(--border-cream)' }}>
                <span className="admin-pill">{STATUS_LABEL[s] || s}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .admin-cols { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
