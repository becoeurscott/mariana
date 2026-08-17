'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [sandbox, setSandbox] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const [o, p] = await Promise.all([
          fetch(`/api/orders/${orderId}`).then((r) => r.json()),
          fetch('/api/payment/create-intent', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ orderId }) }).then((r) => r.json()),
        ]);
        setOrder(o);
        setClientSecret(p.clientSecret);
        setSandbox(!!p.sandbox);
      } catch (e) { setErr(String(e.message || e)); }
    })();
  }, [orderId]);

  async function pay(e) {
    e.preventDefault();
    setProcessing(true); setErr('');
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED', note: 'Paiement confirmé' }),
      });
      router.push(`/track/${orderId}`);
    } catch (e) {
      setErr(String(e.message || e));
      setProcessing(false);
    }
  }

  if (!orderId) return <main className="container" style={{ padding: 60 }}>Commande introuvable.</main>;

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{ padding: '60px 32px 100px', maxWidth: 640 }}
    >
      <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: 8 }}>Paiement</h1>
      <p style={{ color: 'var(--text-dark-secondary)', marginBottom: 30 }}>
        {sandbox ? 'Mode démo — aucune vraie carte n’est requise. Utilisez les données de test.' : 'Saisissez les informations de votre carte pour finaliser la commande.'}
      </p>

      {order && (
        <div style={styles.summary}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Commande</div>
              <div style={{ fontWeight: 700 }}>{order.orderNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Montant</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{order.total?.toFixed(2)} €</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={pay} style={styles.card}>
        <div className="field"><label>Numéro de carte</label>
          <input required placeholder="4242 4242 4242 4242" defaultValue={sandbox ? '4242 4242 4242 4242' : ''} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="field"><label>MM / AA</label><input required placeholder="12 / 30" defaultValue={sandbox ? '12 / 30' : ''} /></div>
          <div className="field"><label>CVC</label><input required placeholder="123" defaultValue={sandbox ? '123' : ''} /></div>
          <div className="field"><label>Code postal</label><input required placeholder="75001" defaultValue={sandbox ? '75001' : ''} /></div>
        </div>

        {clientSecret && <div style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>Réf. paiement : <code>{clientSecret.slice(0, 20)}…</code></div>}
        {err && <div style={{ color: '#b91c1c', fontSize: 13 }}>{err}</div>}

        <button disabled={processing} className="btn btn-primary" style={{ width: '100%' }}>
          {processing ? <span className="spinner" /> : `Payer ${order?.total?.toFixed(2) ?? ''} €`}
        </button>
      </form>
    </motion.main>
  );
}

const styles = {
  summary: { background: 'var(--bg-dark)', color: 'var(--text-cream)', padding: 20, borderRadius: 16, marginBottom: 20 },
  card: { display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-cream)' },
};
