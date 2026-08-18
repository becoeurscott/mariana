'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STATUS_LABELS = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptée',
  PREPARING: 'En cuisine',
  READY: 'Prête',
  DISPATCHED: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};
const STATUSES = Object.keys(STATUS_LABELS);

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');

  async function refresh() {
    const r = await fetch('/api/orders', { cache: 'no-store' });
    const d = await r.json();
    setOrders(d.orders || []);
  }
  useEffect(() => { refresh(); const iv = setInterval(refresh, 5000); return () => clearInterval(iv); }, []);

  async function setStatus(id, status) {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="container" style={{ padding: '40px 32px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--primary-terracotta)', fontWeight: 700, letterSpacing: '0.14em' }}>PROPRIÉTAIRE</div>
          <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}>Tableau de bord cuisine</h1>
        </div>
        <Link href="/dashboard/menu" className="btn btn-dark btn-sm">Gérer le menu</Link>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, overflowX: 'auto' }}>
        {['ALL', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '10px 14px', borderRadius: 999,
              background: filter === s ? 'var(--bg-dark)' : 'white',
              color: filter === s ? 'white' : 'var(--text-dark)',
              border: '1px solid var(--border-cream)',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', minHeight: 40, whiteSpace: 'nowrap',
            }}
          >{s === 'ALL' ? 'TOUTES' : STATUS_LABELS[s].toUpperCase()}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.length === 0 && <div style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 16, textAlign: 'center' }}>Aucune commande dans ce statut.</div>}
        {filtered.map((o) => (
          <div key={o.id} style={styles.row}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700 }}>{o.orderNumber}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>{new Date(o.createdAt).toLocaleString('fr-FR')} · {o.type === 'DELIVERY' ? 'Livraison' : 'À emporter'} · {o.customerName || 'Invité'}</div>
            </div>
            <div style={{ minWidth: 90, textAlign: 'right', fontWeight: 700 }}>${o.total.toFixed(2)}</div>
            <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} style={styles.select}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <Link href={`/track/${o.id}`} className="btn btn-outline-gold btn-sm">Ouvrir</Link>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  row: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: 16, background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border-cream)',
    flexWrap: 'wrap',
  },
  select: { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-cream)', minHeight: 40 },
};
