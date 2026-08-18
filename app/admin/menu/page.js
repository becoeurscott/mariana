'use client';
import { useEffect, useState } from 'react';

export default function AdminMenuPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState('');

  async function load() {
    const r = await fetch('/api/admin/menu', { cache: 'no-store' });
    const d = await r.json();
    setCategories(d.categories || []);
  }
  useEffect(() => { load(); }, []);

  function say(msg) { setToast(msg); setTimeout(() => setToast(''), 2200); }

  async function save() {
    const method = editing?.id ? 'PUT' : 'POST';
    const url    = editing?.id ? `/api/menu/items/${editing.id}` : `/api/menu/items`;
    const res = await fetch(url, {
      method, headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        dietary: form.dietary || null,
      }),
    });
    if (!res.ok) { say('Erreur : ' + await res.text()); return; }
    setEditing(null); setForm({}); await load();
    say(editing?.id ? 'Article mis à jour.' : 'Article créé.');
  }

  async function del(id) {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
    load(); say('Article supprimé.');
  }

  async function toggleAvailable(it) {
    await fetch(`/api/menu/items/${it.id}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ available: !it.available, categoryId: it.categoryId, name: it.name, price: it.price }),
    });
    load();
  }

  function startNew(catId) {
    setEditing({});
    setForm({ name: '', description: '', price: 0, image: '', dietary: '', categoryId: catId, available: true });
  }

  function startEdit(it) {
    setEditing(it);
    setForm({
      name: it.name, description: it.description || '', price: it.price,
      image: it.image || '', dietary: it.dietary || '', categoryId: it.categoryId, available: it.available,
    });
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Catalogue</div>
          <h1>Articles</h1>
          <p>Gérez le menu : prix, disponibilité, photos, régimes.</p>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>{cat.name} <span style={{ fontSize: 12, color: 'var(--text-dark-secondary)', fontWeight: 400 }}>· {cat.items.length}</span></h2>
            <button onClick={() => startNew(cat.id)} className="btn btn-primary btn-sm">+ Nouvel article</button>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {cat.items.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-dark-secondary)' }}>Aucun article.</div>}
            {cat.items.map((it) => (
              <div key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 10, background: 'white', borderRadius: 12, border: '1px solid var(--border-cream)', flexWrap: 'wrap' }}>
                {it.image && <img src={it.image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
                    {it.name}
                    {!it.available && <span className="admin-pill admin-pill--danger">Indisponible</span>}
                    {it.dietary && <span className="admin-pill">{it.dietary === 'Vegetarian' ? 'Végé' : it.dietary === 'Gluten-Free' ? 'Sans gluten' : it.dietary}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>{it.description}</div>
                </div>
                <div style={{ minWidth: 80, textAlign: 'right', fontWeight: 700 }}>${it.price.toFixed(2)}</div>
                <button onClick={() => toggleAvailable(it)} className="btn btn-outline-gold btn-sm">
                  {it.available ? 'Masquer' : 'Activer'}
                </button>
                <button onClick={() => startEdit(it)} className="btn btn-outline-gold btn-sm">Éditer</button>
                <button onClick={() => del(it.id)} className="btn btn-dark btn-sm">Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {editing !== null && (
        <>
          <div onClick={() => setEditing(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 70 }} />
          <div style={modalStyle}>
            <h3 className="serif" style={{ fontSize: 22, marginBottom: 14 }}>{editing?.id ? 'Modifier l’article' : 'Nouvel article'}</h3>
            <div className="admin-form">
              <div className="field full"><label>Nom</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field full"><label>Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="field"><label>Prix ($)</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div className="field"><label>Régime</label>
                <select value={form.dietary || ''} onChange={(e) => setForm({ ...form, dietary: e.target.value })}>
                  <option value="">Aucun</option>
                  <option value="Vegetarian">Végétarien</option>
                  <option value="Gluten-Free">Sans gluten</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
              <div className="field full"><label>URL de l’image</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" /></div>
              <div className="field"><label>Disponible</label>
                <select value={form.available ? 'true' : 'false'} onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })}>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} className="btn btn-outline-gold btn-sm">Annuler</button>
              <button onClick={save} className="btn btn-primary btn-sm">Enregistrer</button>
            </div>
          </div>
        </>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </>
  );
}

const modalStyle = {
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  background: 'var(--bg-page)', borderRadius: 20, padding: 24,
  width: 'min(560px, 92vw)', maxHeight: '90vh', overflowY: 'auto',
  zIndex: 71, boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
};
