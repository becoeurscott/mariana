'use client';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { key: 'PENDING',    label: 'Commande reçue' },
  { key: 'ACCEPTED',   label: 'Acceptée' },
  { key: 'PREPARING',  label: 'En cuisine' },
  { key: 'READY',      label: 'Prête' },
  { key: 'DISPATCHED', label: 'En livraison' },
  { key: 'DELIVERED',  label: 'Livrée' },
];

export default function TrackPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const r = await fetch(`/api/orders/${id}`, { cache: 'no-store' });
        if (!r.ok) throw new Error('Introuvable');
        const o = await r.json();
        if (!stop) setOrder(o);
      } catch (e) { if (!stop) setErr(String(e.message || e)); }
    }
    tick();
    const iv = setInterval(tick, 4000);
    return () => { stop = true; clearInterval(iv); };
  }, [id]);

  if (err) return <main className="container" style={{ padding: 60 }}>Commande introuvable.</main>;
  if (!order) return <main className="container" style={{ padding: 60 }}>Chargement…</main>;

  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === order.status));

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{ padding: '60px 32px 100px', maxWidth: 800 }}
    >
      <div style={styles.head}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--primary-terracotta)', fontWeight: 700 }}>COMMANDE</div>
          <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}>{order.orderNumber}</h1>
        </div>
        <div style={styles.status}>{STEPS.find((s) => s.key === order.status)?.label || order.status}</div>
      </div>

      <div style={styles.progress}>
        {STEPS.map((s, i) => {
          const done = i <= currentIndex;
          return (
            <div key={s.key} style={styles.step}>
              <motion.div
                animate={{ scale: i === currentIndex ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 1.4, repeat: i === currentIndex ? Infinity : 0, ease: 'easeInOut' }}
                style={{ ...styles.dot, background: done ? 'var(--primary-terracotta)' : '#e6ddc9', color: done ? 'white' : 'var(--text-dark-secondary)' }}
              >
                {done ? '✓' : i + 1}
              </motion.div>
              <div style={{ fontSize: 12, color: done ? 'var(--text-dark)' : 'var(--text-dark-secondary)', textAlign: 'center', fontWeight: done ? 700 : 500 }}>{s.label}</div>
              {i < STEPS.length - 1 && (
                <div style={{ ...styles.bar, background: i < currentIndex ? 'var(--primary-terracotta)' : '#e6ddc9' }} />
              )}
            </div>
          );
        })}
      </div>

      <section style={styles.card}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 12 }}>Articles</h3>
        {order.items.map((it) => (
          <div key={it.id} style={styles.line}>
            <span>{it.quantity}× {it.itemName}</span>
            <span>${(it.itemPrice * it.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={styles.divider} />
        <div style={styles.line}><span>Sous-total</span><span>${order.subtotal.toFixed(2)}</span></div>
        <div style={styles.line}><span>Taxe</span><span>${order.taxAmount.toFixed(2)}</span></div>
        <div style={styles.line}><span>Pourboire</span><span>${order.tipAmount.toFixed(2)}</span></div>
        {order.deliveryFee > 0 && <div style={styles.line}><span>Livraison</span><span>${order.deliveryFee.toFixed(2)}</span></div>}
        <div style={{ ...styles.line, fontWeight: 700, fontSize: 18 }}><span>Total</span><span>${order.total.toFixed(2)}</span></div>
      </section>

      {order.deliveryInfo && (
        <section style={styles.card}>
          <h3 className="serif" style={{ fontSize: 22, marginBottom: 12 }}>Livraison à</h3>
          <div>{order.deliveryInfo.deliveryAddress}</div>
          <div>{order.deliveryInfo.deliveryCity}, {order.deliveryInfo.deliveryState} {order.deliveryInfo.deliveryZip}</div>
        </section>
      )}

      <section style={styles.card}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 12 }}>Historique</h3>
        {(order.statusHistory || []).map((h) => (
          <div key={h.id} style={styles.line}>
            <span>{STEPS.find((s) => s.key === h.status)?.label || h.status}{h.note ? ` — ${h.note}` : ''}</span>
            <span style={{ opacity: 0.6, fontSize: 12 }}>{new Date(h.createdAt).toLocaleTimeString('fr-FR')}</span>
          </div>
        ))}
      </section>
    </motion.main>
  );
}

const styles = {
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 30, gap: 16, flexWrap: 'wrap' },
  status: { padding: '8px 14px', borderRadius: 999, background: 'var(--bg-dark)', color: 'var(--text-cream)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em' },
  progress: {
    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, position: 'relative',
    background: 'var(--bg-card)', borderRadius: 16, padding: '24px 20px', marginBottom: 26, border: '1px solid var(--border-cream)',
    overflowX: 'auto',
  },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' },
  dot: { width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 700 },
  bar: { position: 'absolute', height: 3, top: 16, left: '50%', width: '100%', zIndex: -1, borderRadius: 3 },
  card: { background: 'var(--bg-card)', borderRadius: 16, padding: 22, border: '1px solid var(--border-cream)', marginBottom: 18 },
  line: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 },
  divider: { height: 1, background: 'var(--border-cream)', margin: '10px 0' },
};
