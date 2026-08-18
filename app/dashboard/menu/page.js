'use client';
import { useEffect, useState } from 'react';

export default function ManageMenu() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  async function load() {
    const r = await fetch('/api/menu', { cache: 'no-store' });
    const d = await r.json();
    setCategories(d.categories || []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? `/api/menu/items/${editing.id}` : `/api/menu/items`;
    await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, price: Number(form.price) }) });
    setEditing(null); setForm({}); load();
  }

  async function del(id) {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
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
    <main className="container" style={{ padding: '40px 32px 100px' }}>
      <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: 20 }}>Gestion du menu</h1>

      {categories.map((cat) => (
        <section key={cat.id} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
            <h2 className="serif" style={{ fontSize: 24 }}>{cat.name}</h2>
            <button onClick={() => startNew(cat.id)} className="btn btn-primary btn-sm">+ Nouvel article</button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {cat.items.map((it) => (
              <div key={it.id} style={styles.row}>
                {it.image && <img src={it.image} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700 }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>{it.description}</div>
                </div>
                <div style={{ minWidth: 80, textAlign: 'right', fontWeight: 700 }}>${it.price.toFixed(2)}</div>
                <button onClick={() => startEdit(it)} className="btn btn-outline-gold btn-sm">Modifier</button>
                <button onClick={() => del(it.id)} className="btn btn-dark btn-sm">Supprimer</button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {editing !== null && (
        <>
          <div onClick={() => setEditing(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 70 }} />
          <div style={styles.modal}>
            <h3 className="serif" style={{ fontSize: 24, marginBottom: 16 }}>{editing?.id ? 'Modifier l’article' : 'Nouvel article'}</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              <div className="field"><label>Nom</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field"><label>Description</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="field"><label>Prix ($)</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div className="field"><label>Régime</label>
                  <select value={form.dietary || ''} onChange={(e) => setForm({ ...form, dietary: e.target.value })}>
                    <option value="">—</option>
                    <option value="Vegetarian">Végétarien</option>
                    <option value="Gluten-Free">Sans gluten</option>
                  </select>
                </div>
              </div>
              <div className="field"><label>URL de l’image</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} className="btn btn-outline-gold btn-sm">Annuler</button>
              <button onClick={save} className="btn btn-primary btn-sm">Enregistrer</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

const styles = {
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-cream)', flexWrap: 'wrap' },
  modal: {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    background: 'var(--bg-page)', borderRadius: 20, padding: 24,
    width: 'min(520px, 92vw)', maxHeight: '90vh', overflowY: 'auto',
    zIndex: 71, boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
  },
};
