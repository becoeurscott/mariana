'use client';
import { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', sortOrder: 0, isActive: true });
  const [toast, setToast] = useState('');

  async function load() {
    const r = await fetch('/api/admin/menu', { cache: 'no-store' });
    const d = await r.json();
    setCats(d.categories || []);
  }
  useEffect(() => { load(); }, []);
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };

  async function save() {
    const method = editing?.id ? 'PUT' : 'POST';
    const url    = editing?.id ? `/api/admin/menu/categories/${editing.id}` : `/api/admin/menu/categories`;
    const res = await fetch(url, {
      method, headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    });
    if (!res.ok) { say('Erreur : ' + await res.text()); return; }
    setEditing(null); setForm({ name: '', sortOrder: 0, isActive: true }); load();
    say('Catégorie enregistrée.');
  }

  async function del(id) {
    if (!confirm('Supprimer cette catégorie ? Ses articles seront supprimés.')) return;
    await fetch(`/api/admin/menu/categories/${id}`, { method: 'DELETE' });
    load(); say('Catégorie supprimée.');
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Catalogue</div>
          <h1>Catégories</h1>
          <p>Sections du menu — utilisez le champ ordre pour les organiser.</p>
        </div>
        <button
          onClick={() => { setEditing({}); setForm({ name: '', sortOrder: (cats.at(-1)?.sortOrder || 0) + 1, isActive: true }); }}
          className="btn btn-primary btn-sm"
        >+ Nouvelle catégorie</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Ordre</th><th>Nom</th><th>Articles</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.sortOrder}</td>
                <td>{c.name}</td>
                <td>{c.items.length}</td>
                <td>
                  {c.isActive
                    ? <span className="admin-pill admin-pill--ok">Active</span>
                    : <span className="admin-pill admin-pill--warn">Masquée</span>}
                </td>
                <td style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => { setEditing(c); setForm({ name: c.name, sortOrder: c.sortOrder, isActive: c.isActive }); }} className="btn btn-outline-gold btn-sm">Éditer</button>
                  <button onClick={() => del(c.id)} className="btn btn-dark btn-sm">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <>
          <div onClick={() => setEditing(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 70 }} />
          <div style={modalStyle}>
            <h3 className="serif" style={{ fontSize: 22, marginBottom: 14 }}>{editing?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
            <div className="admin-form">
              <div className="field full"><label>Nom</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field"><label>Ordre</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
              <div className="field"><label>Active</label>
                <select value={form.isActive ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}>
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
  width: 'min(500px, 92vw)', zIndex: 71, boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
};
