'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const TIPS = [
  { label: 'Aucun', value: 0 },
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
        type, tipAmount,
        specialInstructions: form.specialInstructions,
        customerName: form.customerName, customerEmail: form.customerEmail, customerPhone: form.customerPhone,
        ...(type === 'DELIVERY'
          ? { deliveryAddress: form.deliveryAddress, deliveryCity: form.deliveryCity, deliveryState: form.deliveryState, deliveryZip: form.deliveryZip }
          : {}),
        items: items.map((l) => ({
          menuItemId: l.menuItemId, quantity: l.quantity,
          selectedOptions: l.selectedOptions, instructions: l.instructions,
        })),
      };
      const r = await fetch('/api/orders', {
        method: 'POST', headers: { 'content-type': 'application/json' },
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
      className="checkout"
    >
      <div className="checkout__container">
        <header className="checkout__head">
          <h1 className="serif checkout__title">Commande</h1>
          <p className="checkout__lead">Plus qu&apos;un pas. Confirmez vos informations ci-dessous.</p>
        </header>

        <form onSubmit={submit} className="checkout__layout">
          <div className="checkout__main">
            {/* Type toggle */}
            <div className="checkout__panel">
              <h3 className="checkout__h3">Type de commande</h3>
              <div className="checkout__toggleRow">
                {[
                  { key: 'DELIVERY', label: '🚗 Livraison' },
                  { key: 'PICKUP',   label: '🏃 À emporter' },
                ].map((t) => (
                  <button
                    key={t.key} type="button"
                    onClick={() => setType(t.key)}
                    className={`checkout__toggle${type === t.key ? ' checkout__toggle--active' : ''}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="checkout__panel">
              <h3 className="checkout__h3">Contact</h3>
              <div className="checkout__row2">
                <div className="field"><label>Nom complet</label><input required value={form.customerName} onChange={onChange('customerName')} /></div>
                <div className="field"><label>Téléphone</label><input required value={form.customerPhone} onChange={onChange('customerPhone')} /></div>
              </div>
              <div className="field"><label>E-mail</label><input required type="email" value={form.customerEmail} onChange={onChange('customerEmail')} /></div>
            </div>

            {/* Address */}
            {type === 'DELIVERY' && (
              <div className="checkout__panel">
                <h3 className="checkout__h3">Adresse de livraison</h3>
                <div className="field"><label>Adresse</label><input required value={form.deliveryAddress} onChange={onChange('deliveryAddress')} /></div>
                <div className="checkout__row3">
                  <div className="field"><label>Ville</label><input required value={form.deliveryCity} onChange={onChange('deliveryCity')} /></div>
                  <div className="field"><label>Région</label><input required value={form.deliveryState} onChange={onChange('deliveryState')} /></div>
                  <div className="field"><label>Code postal</label><input required value={form.deliveryZip} onChange={onChange('deliveryZip')} /></div>
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="checkout__panel">
              <h3 className="checkout__h3">Pourboire</h3>
              <div className="checkout__tipRow">
                {TIPS.map((t) => (
                  <button
                    key={t.label} type="button"
                    onClick={() => setTipPreset(t.value)}
                    className={`checkout__tipBtn${tipPreset === t.value ? ' checkout__tipBtn--active' : ''}`}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTipPreset('CUSTOM')}
                  className={`checkout__tipBtn${tipPreset === 'CUSTOM' ? ' checkout__tipBtn--active' : ''}`}
                >Autre</button>
                {tipPreset === 'CUSTOM' && (
                  <input
                    type="number" step="0.01" inputMode="decimal" placeholder="$"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    className="checkout__tipInput"
                  />
                )}
              </div>
            </div>

            {/* Receipt */}
            <div className="checkout__panel">
              <h3 className="checkout__h3">Reçu</h3>
              <label className="checkout__check"><input type="checkbox" checked={emailReceipt} onChange={(e) => setEmailReceipt(e.target.checked)} /> 📧 M&apos;envoyer un reçu par e-mail</label>
              <label className="checkout__check"><input type="checkbox" checked={smsReceipt}   onChange={(e) => setSmsReceipt(e.target.checked)}   /> 📱 M&apos;envoyer un reçu par SMS</label>
            </div>

            {/* Notes */}
            <div className="checkout__panel">
              <h3 className="checkout__h3">Instructions particulières</h3>
              <textarea rows={3} value={form.specialInstructions} onChange={onChange('specialInstructions')} placeholder="Code d’entrée, allergies, cuisson…" className="checkout__notes" />
            </div>
          </div>

          {/* Summary */}
          <aside className="checkout__aside">
            <div className="checkout__summary">
              <h3 className="serif checkout__summaryTitle">Récapitulatif</h3>

              <div className="checkout__lines">
                {items.map((l) => (
                  <div key={l.key} className="checkout__sumRow">
                    <span className="checkout__sumName">{l.quantity}× {l.name}</span>
                    <span>${lineTotal(l).toFixed(2)}</span>
                  </div>
                ))}
                {items.length === 0 && <div className="checkout__empty">Panier vide.</div>}
              </div>

              <div className="checkout__divider" />
              <div className="checkout__sumRow"><span>Sous-total</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="checkout__sumRow"><span>Taxe (8,25 %)</span><span>${tax.toFixed(2)}</span></div>
              <div className="checkout__sumRow"><span>Pourboire</span><span>${tipAmount.toFixed(2)}</span></div>
              {type === 'DELIVERY' && <div className="checkout__sumRow"><span>Livraison</span><span>${deliveryFee.toFixed(2)}</span></div>}
              <div className="checkout__divider" />
              <div className="checkout__total"><span>Total</span><span>${total.toFixed(2)}</span></div>

              {err && <div className="checkout__err">{err}</div>}

              <button type="submit" disabled={submitting || items.length === 0} className="btn btn-primary checkout__submit">
                {submitting ? <span className="spinner" /> : 'Continuer vers le paiement'}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </motion.main>
  );
}
