'use client';
import { useState } from 'react';

export default function DishModal({ item, onClose, onAdd }) {
  const groups = item.optionGroups || [];
  const [selected, setSelected] = useState({}); // groupId -> Set(optionId)
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  function toggle(g, o) {
    setSelected((prev) => {
      const cur = new Set(prev[g.id] || []);
      if (g.maxSelect === 1) { cur.clear(); cur.add(o.id); }
      else if (cur.has(o.id)) cur.delete(o.id);
      else if (cur.size < g.maxSelect) cur.add(o.id);
      return { ...prev, [g.id]: cur };
    });
  }

  const chosenOpts = groups.flatMap((g) =>
    (g.options || []).filter((o) => selected[g.id]?.has(o.id))
      .map((o) => ({ groupName: g.name, name: o.name, price: o.price })),
  );
  const extra = chosenOpts.reduce((s, o) => s + o.price, 0);
  const total = (item.price + extra) * qty;

  const missing = groups.some((g) => g.required && !(selected[g.id]?.size > 0));

  return (
    <>
      <div onClick={onClose} style={styles.backdrop} />
      <div style={styles.modal}>
        {item.image && <img src={item.image} alt={item.name} style={styles.img} />}
        <div style={styles.body}>
          <div style={styles.head}>
            <h3 className="serif" style={{ fontSize: 26 }}>{item.name}</h3>
            <button onClick={onClose} style={styles.close}>✕</button>
          </div>
          <p style={styles.desc}>{item.description}</p>

          {groups.map((g) => (
            <div key={g.id} style={styles.group}>
              <div style={styles.groupHead}>
                <strong>{g.name}</strong>
                <span style={{ fontSize: 12, color: 'var(--text-dark-secondary)' }}>
                  {g.required ? 'Obligatoire' : 'Optionnel'} · jusqu&apos;à {g.maxSelect}
                </span>
              </div>
              <div style={styles.opts}>
                {(g.options || []).map((o) => {
                  const checked = selected[g.id]?.has(o.id);
                  return (
                    <label key={o.id} style={{ ...styles.opt, borderColor: checked ? 'var(--primary-terracotta)' : 'var(--border-cream)' }}>
                      <input
                        type={g.maxSelect === 1 ? 'radio' : 'checkbox'}
                        name={g.id}
                        checked={!!checked}
                        onChange={() => toggle(g, o)}
                        style={{ marginRight: 8 }}
                      />
                      <span style={{ flex: 1 }}>{o.name}</span>
                      {o.price ? <span>+${o.price.toFixed(2)}</span> : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="field" style={{ marginTop: 10 }}>
            <label>Instructions particulières</label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, cuisson…" />
          </div>

          <div style={styles.foot}>
            <div className="stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              disabled={missing}
              onClick={() => { onAdd({ qty, opts: chosenOpts, notes }); onClose(); }}
              className="btn btn-primary"
              style={{ flex: 1, opacity: missing ? 0.5 : 1 }}
            >
              Ajouter — ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70 },
  modal: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--bg-page)',
    borderRadius: 20,
    width: 'min(520px, 92vw)',
    maxHeight: '90vh',
    overflowY: 'auto',
    zIndex: 71,
    boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
  },
  img: { width: '100%', height: 220, objectFit: 'cover' },
  body: { padding: 24 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  close: { fontSize: 18, opacity: 0.6 },
  desc: { color: 'var(--text-dark-secondary)', marginBottom: 18 },
  group: { marginBottom: 18 },
  groupHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  opts: { display: 'flex', flexDirection: 'column', gap: 8 },
  opt: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 12px', borderRadius: 10,
    border: '1px solid var(--border-cream)',
    background: 'white',
    fontSize: 14,
    cursor: 'pointer',
  },
  foot: { display: 'flex', gap: 12, marginTop: 22 },
};
