'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STATUS_LABELS = {
  PENDING: 'En attente', PAID: 'Payée', ACCEPTED: 'Acceptée',
  PREPARING: 'En cuisine', READY: 'Prête', DISPATCHED: 'En livraison',
  DELIVERED: 'Livrée', CANCELLED: 'Annulée',
};
const STATUSES = Object.keys(STATUS_LABELS);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [q, setQ] = useState('');

  async function refresh() {
    const r = await fetch('/api/orders', { cache: 'no-store' });
    const d = await r.json();
    setOrders(d.orders || []);
  }
  useEffect(() => { refresh(); const iv = setInterval(refresh, 5000); return () => clearInterval(iv); }, []);

  async function setStatus(id, status) {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  const filtered = orders
    .filter((o) => filter === 'ALL' || o.status === filter)
    .filter((o) => !q || o.orderNumber.toLowerCase().includes(q.toLowerCase()) || (o.customerName || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Exploitation</div>
          <h1>Commandes</h1>
          <p>Actualisation automatique toutes les 5 secondes.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher n° ou client…"
          style={{ padding: '10px 14px', border: '1px solid var(--border-cream)', borderRadius: 10, minWidth: 240 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, overflowX: 'auto' }}>
        {['ALL', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '8px 12px', borderRadius: 999,
              background: filter === s ? 'var(--bg-dark)' : 'white',
              color:      filter === s ? 'white' : 'var(--text-dark)',
              border: '1px solid var(--border-cream)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', minHeight: 36, whiteSpace: 'nowrap',
            }}
          >{s === 'ALL' ? 'TOUT' : STATUS_LABELS[s].toUpperCase()}</button>
        ))}
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>N°</th><th>Client</th><th>Type</th><th>Statut</th><th style={{ textAlign: 'right' }}>Total</th><th>Date</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Aucune commande.</td></tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700 }}>{o.orderNumber}</td>
                <td>{o.customerName || 'Invité'}<div style={{ fontSize: 11, opacity: 0.65 }}>{o.customerEmail}</div></td>
                <td>{o.type === 'DELIVERY' ? '🚗 Livraison' : '🏃 À emporter'}</td>
                <td>
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--border-cream)', borderRadius: 8, fontSize: 12 }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{o.total.toFixed(2)} €</td>
                <td style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>{new Date(o.createdAt).toLocaleString('fr-FR')}</td>
                <td><Link href={`/track/${o.id}`} className="btn btn-outline-gold btn-sm">Voir</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
