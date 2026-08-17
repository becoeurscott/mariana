'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const TIPS = [
  { label: 'Aucun',  value: 0 },
  { label: '5 %',   value: 0.05 },
  { label: '10 %',  value: 0.10 },
  { label: '15 %',  value: 0.15 },
  { label: '20 %',  value: 0.20 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, lineTotal, clear } = useCart();
  const [type, setType] = useState('DELIVERY');
  const [tipPreset, setTipPreset] = useState(0.10);
  const [customTip, setCustomTip] = useState('');
  const [emailReceipt, setEmailReceipt] = useState(true);
  const [smsReceipt, setSmsReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    deliveryAddress: '', deliveryCity: '', deliveryState: '', deliveryZip: '',
    specialInstructions: '',
  });
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const tipAmount = useMemo(() => {
    if (tipPreset === 'CUSTOM') return Math.max(0, Number(customTip) || 0);
    return +(subtotal * tipPreset).toFixed(2);
  }, [tipPreset, customTip, subtotal]);

  const deliveryFee = type === 'DELIVERY' ? 4.99 : 0;
  const tax = +(subtotal * 0.0825).toFixed(2);
  const total = +(subtotal + tax + tipAmount + deliveryFee).toFixed(2);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (items.length === 0) { setErr('Votre panier est vide.'); return; }
    setSubmitting(true);

    try {
      const payload = {
        type,
        tipAmount,
        specialInstructions: form.specialInstructions,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        ...(type === 'DELIVERY'
          ? {
              deliveryAddress: form.deliveryAddress,
              deliveryCity: form.deliveryCity,
              deliveryState: form.deliveryState,
              deliveryZip: form.deliveryZip,
            }
          : {}),
        items: items.map((l) => ({
          menuItemId: l.menuItemId,
          quantity: l.quantity,
          selectedOptions: l.selectedOptions,
          instructions: l.instructions,
        })),
      };

      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      const order = await r.json();

      clear();
      router.push(`/checkout/payment?orderId=${order.id}`);
    } catch (e) {
      setErr(String(e.message || e));
      setSubmitting(false);
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{ padding: '40px 32px 100px' }}
    >
      <h1 className="serif" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: 8 }}>Commande</h1>
      <p style={{ color: 'var(--text-dark-secondary)', marginBottom: 30 }}>
        Plus qu&apos;un pas. Confirmez vos informations ci-dessous.
      </p>

      <form onSubmit={submit} className="checkout-grid" style={styles.grid}>
        <div style={styles.left}>
          <div style={styles.panel}>
            <h3 style={styles.h3}>Type de commande</h3>
            <div style={styles.toggleRow}>
              {[
                { key: 'DELIVERY', label: '🚗 Livraison' },
                { key: 'PICKUP', label: '🏃 À emporter' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setType(t.key)}
                  style={{
                    ...styles.toggle,
                    background: type === t.key ? 'var(--primary-terracotta)' : 'white',
                    color: type === t.key ? 'white' : 'var(--text-dark)',
                    borderColor: type === t.key ? 'var(--primary-terracotta)' : 'var(--border-cream)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.h3}>Contact</h3>
            <div style={styles.row2}>
              <div className="field"><label>Nom complet</label><input required value={form.customerName} onChange={onChange('customerName')} /></div>
              <div className="field"><label>Téléphone</label><input required value={form.customerPhone} onChange={onChange('customerPhone')} /></div>
            </div>
            <div className="field"><label>E-mail</label><input required type="email" value={form.customerEmail} onChange={onChange('customerEmail')} /></div>
          </div>

          {type === 'DELIVERY' && (
            <div style={styles.panel}>
              <h3 style={styles.h3}>Adresse de livraison</h3>
              <div className="field"><label>Adresse</label><input required value={form.deliveryAddress} onChange={onChange('deliveryAddress')} /></div>
              <div style={styles.row3}>
                <div className="field"><label>Ville</label><input required value={form.deliveryCity} onChange={onChange('deliveryCity')} /></div>
                <div className="field"><label>Région</label><input required value={form.deliveryState} onChange={onChange('deliveryState')} /></div>
                <div className="field"><label>Code postal</label><input required value={form.deliveryZip} onChange={onChange('deliveryZip')} /></div>
              </div>
            </div>
          )}

          <div style={styles.panel}>
            <h3 style={styles.h3}>Ajouter un pourboire</h3>
            <div style={styles.tipRow}>
              {TIPS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTipPreset(t.value)}
                  style={{ ...styles.tipBtn, background: tipPreset === t.value ? 'var(--bg-dark)' : 'white', color: tipPreset === t.value ? 'white' : 'var(--text-dark)' }}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTipPreset('CUSTOM')}
                style={{ ...styles.tipBtn, background: tipPreset === 'CUSTOM' ? 'var(--bg-dark)' : 'white', color: tipPreset === 'CUSTOM' ? 'white' : 'var(--text-dark)' }}
              >
                Autre
              </button>
              {tipPreset === 'CUSTOM' && (
                <input
                  type="number"
                  step="0.01"
                  placeholder="€"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  style={{ ...styles.tipInput }}
                />
              )}
            </div>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.h3}>Reçu</h3>
            <label style={styles.check}><input type="checkbox" checked={emailReceipt} onChange={(e) => setEmailReceipt(e.target.checked)} /> 📧 M&apos;envoyer un reçu par e-mail</label>
            <label style={styles.check}><input type="checkbox" checked={smsReceipt}   onChange={(e) => setSmsReceipt(e.target.checked)}   /> 📱 M&apos;envoyer un reçu par SMS</label>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.h3}>Instructions particulières</h3>
            <textarea rows={3} value={form.specialInstructions} onChange={onChange('specialInstructions')} placeholder="Code d’entrée, allergies, cuisson…" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--border-cream)', fontFamily: 'inherit' }} />
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.summary}>
            <h3 className="serif" style={{ fontSize: 22, marginBottom: 16, color: 'var(--text-cream)' }}>Récapitulatif</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, maxHeight: 260, overflowY: 'auto' }}>
              {items.map((l) => (
                <div key={l.key} style={styles.sumRow}>
                  <span>{l.quantity}× {l.name}</span>
                  <span>{lineTotal(l).toFixed(2)} €</span>
                </div>
              ))}
              {items.length === 0 && <div style={{ color: 'var(--text-cream-secondary)' }}>Panier vide.</div>}
            </div>

            <div style={styles.divider} />
            <div style={styles.sumRow}><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
            <div style={styles.sumRow}><span>TVA (8,25 %)</span><span>{tax.toFixed(2)} €</span></div>
            <div style={styles.sumRow}><span>Pourboire</span><span>{tipAmount.toFixed(2)} €</span></div>
            {type === 'DELIVERY' && <div style={styles.sumRow}><span>Livraison</span><span>{deliveryFee.toFixed(2)} €</span></div>}
            <div style={styles.divider} />
            <div style={{ ...styles.sumRow, fontWeight: 700, fontSize: 18 }}><span>Total</span><span>{total.toFixed(2)} €</span></div>

            {err && <div style={{ color: '#ffb1b1', marginTop: 10, fontSize: 13 }}>{err}</div>}

            <button type="submit" disabled={submitting || items.length === 0} className="btn btn-primary" style={{ width: '100%', marginTop: 18, opacity: submitting || items.length === 0 ? 0.6 : 1 }}>
              {submitting ? <span className="spinner" /> : 'Continuer vers le paiement'}
            </button>
          </div>
        </div>
      </form>
    </motion.main>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 },
  left: { display: 'flex', flexDirection: 'column', gap: 20 },
  right: { position: 'sticky', top: 100, alignSelf: 'start' },
  panel: { background: 'var(--bg-card)', borderRadius: 16, padding: 22, border: '1px solid var(--border-cream)' },
  h3: { fontSize: 16, marginBottom: 14, fontFamily: 'var(--font-serif)', fontWeight: 600 },
  toggleRow: { display: 'flex', gap: 10 },
  toggle: {
    flex: 1, padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border-cream)',
    fontWeight: 600, cursor: 'pointer', transition: 'all .15s ease', minHeight: 48,
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 },
  row3: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 },
  tipRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  tipBtn: { padding: '12px 18px', borderRadius: 999, border: '1px solid var(--border-cream)', fontWeight: 600, fontSize: 13, minHeight: 44 },
  tipInput: { width: 120, padding: '12px 12px', borderRadius: 10, border: '1px solid var(--border-cream)', minHeight: 44 },
  check: { display: 'flex', gap: 8, alignItems: 'center', padding: '10px 0', fontSize: 14, minHeight: 40 },
  summary: { background: 'var(--bg-dark)', color: 'var(--text-cream)', borderRadius: 20, padding: 24 },
  sumRow: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14 },
  divider: { height: 1, background: 'rgba(255,255,255,0.1)', margin: '10px 0' },
};
