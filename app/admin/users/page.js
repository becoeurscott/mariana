'use client';
import { useEffect, useState } from 'react';

const ROLES = ['CUSTOMER', 'STAFF', 'OWNER', 'ADMIN'];
const ROLE_LABEL = { CUSTOMER: 'Client', STAFF: 'Équipe', OWNER: 'Propriétaire', ADMIN: 'Admin' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');

  async function load() {
    const r = await fetch('/api/admin/users', { cache: 'no-store' });
    const d = await r.json();
    setUsers(d.users || []);
  }
  useEffect(() => { load(); }, []);
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2000); };

  async function updateRole(id, role) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    load(); say('Rôle mis à jour.');
  }
  async function del(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    load(); say('Utilisateur supprimé.');
  }

  const filtered = users.filter((u) => !q ||
    (u.email || '').toLowerCase().includes(q.toLowerCase()) ||
    (u.firstName || '').toLowerCase().includes(q.toLowerCase()) ||
    (u.lastName  || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="admin-page-head">
        <div>
          <div className="admin-eyebrow">Comptes</div>
          <h1>Utilisateurs &amp; rôles</h1>
          <p>Gérez qui peut se connecter et à quel niveau.</p>
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-cream)', minWidth: 240 }} />
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Commandes</th><th>Inscrit</th><th></th></tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.isGuest ? 'Invité' : '—')}
                  {u.isGuest && <span className="admin-pill admin-pill--warn" style={{ marginLeft: 8 }}>Invité</span>}
                </td>
                <td style={{ fontSize: 13 }}>{u.email || '—'}</td>
                <td>
                  <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--border-cream)', borderRadius: 8, fontSize: 12 }}>
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>{u._count?.orders ?? 0}</td>
                <td style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => del(u.id)} className="btn btn-dark btn-sm">Supprimer</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Aucun utilisateur.</td></tr>}
          </tbody>
        </table>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </>
  );
}
