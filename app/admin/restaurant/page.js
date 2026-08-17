'use client';
import { useEffect, useState } from 'react';

const NUM_FIELDS = new Set(['taxRate', 'deliveryFee', 'minOrder']);

export default function AdminRestaurantPage() {
  const [r, setR] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/admin/restaurant').then((res) => res.json()).then(setR);
  }, []);

  if (!r) return <p>Chargement…</p>;

  function change(k, v) { setR({ ...r, [k]: NUM_FIELDS.has(k) ? (v === '' ? 0 : Number(v)) : v }); }

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/restaurant', {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: r.name, tagline: r.tagline, logoUrl: r.logoUrl, brandPrimary: r.brandPrimary, brandDark: r.brandDark,
        currency: r.currency, taxRate: r.taxRate, deliveryFee: r.deliveryFee, minOrder: r.minOrder,
        addressLine: r.addressLine, city: r.city, postalCode: r.postalCode, country: r.country,
        phone: r.phone, email: r.email, openingHours: r.openingHours, isActive: r.isActive,
      }),
    });
    setSaving(false);
    if (!res.ok) { setToast('Erreur : ' + await res.text()); return; }
    setToast('Enregistré.'); setTimeout(() => setToast(''), 2000);
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Établissement</div>
          <h1>Paramètres</h1>
          <p>Identité, tarifs, livraison, horaires.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? '…' : 'Enregistrer'}
        </button>
      </div>

      <div className="admin-card">
        <h2>Identité</h2>
        <div className="admin-form">
          <div className="field"><label>Nom</label><input value={r.name || ''} onChange={(e) => change('name', e.target.value)} /></div>
          <div className="field"><label>Slug</label><input value={r.slug} disabled /></div>
          <div className="field full"><label>Baseline</label><input value={r.tagline || ''} onChange={(e) => change('tagline', e.target.value)} /></div>
          <div className="field full"><label>Logo (URL)</label><input value={r.logoUrl || ''} onChange={(e) => change('logoUrl', e.target.value)} placeholder="https://…" /></div>
          <div className="field"><label>Couleur primaire</label><input type="color" value={r.brandPrimary || '#C88339'} onChange={(e) => change('brandPrimary', e.target.value)} style={{ padding: 6, height: 46 }} /></div>
          <div className="field"><label>Couleur foncée</label><input type="color" value={r.brandDark || '#13382C'} onChange={(e) => change('brandDark', e.target.value)} style={{ padding: 6, height: 46 }} /></div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Tarifs &amp; livraison</h2>
        <div className="admin-form">
          <div className="field"><label>Devise</label><input value={r.currency || 'EUR'} onChange={(e) => change('currency', e.target.value.toUpperCase())} maxLength={3} /></div>
          <div className="field"><label>TVA (%)</label><input type="number" step="0.01" value={r.taxRate ?? 0} onChange={(e) => change('taxRate', e.target.value)} /></div>
          <div className="field"><label>Frais de livraison</label><input type="number" step="0.01" value={r.deliveryFee ?? 0} onChange={(e) => change('deliveryFee', e.target.value)} /></div>
          <div className="field"><label>Commande minimum</label><input type="number" step="0.01" value={r.minOrder ?? 0} onChange={(e) => change('minOrder', e.target.value)} /></div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Contact &amp; adresse</h2>
        <div className="admin-form">
          <div className="field full"><label>Adresse</label><input value={r.addressLine || ''} onChange={(e) => change('addressLine', e.target.value)} /></div>
          <div className="field"><label>Ville</label><input value={r.city || ''} onChange={(e) => change('city', e.target.value)} /></div>
          <div className="field"><label>Code postal</label><input value={r.postalCode || ''} onChange={(e) => change('postalCode', e.target.value)} /></div>
          <div className="field"><label>Pays</label><input value={r.country || ''} onChange={(e) => change('country', e.target.value)} /></div>
          <div className="field"><label>Téléphone</label><input value={r.phone || ''} onChange={(e) => change('phone', e.target.value)} /></div>
          <div className="field"><label>E-mail</label><input value={r.email || ''} onChange={(e) => change('email', e.target.value)} /></div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Horaires d&apos;ouverture</h2>
        <div className="field">
          <label>JSON — clefs mon…sun, tableaux de créneaux ou <code>"closed"</code></label>
          <textarea
            rows={8}
            value={r.openingHours || ''}
            onChange={(e) => change('openingHours', e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
        </div>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </>
  );
}
