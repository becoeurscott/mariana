'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function DishDetailActions({ item }) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const groups = item.optionGroups || [];
  const [selected, setSelected] = useState({}); // groupId -> Set(optionId)
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

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

  function handleAdd() {
    addItem(item, qty, chosenOpts, notes);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="dish-actions">
      {groups.map((g) => (
        <div key={g.id} className="dish-actions__group">
          <div className="dish-actions__groupHead">
            <strong>{g.name}</strong>
            <span className="dish-actions__groupMeta">
              {g.required ? 'Obligatoire' : 'Optionnel'} · jusqu&apos;à {g.maxSelect}
            </span>
          </div>
          <div className="dish-actions__opts">
            {(g.options || []).map((o) => {
              const checked = selected[g.id]?.has(o.id);
              return (
                <label key={o.id} className={`dish-actions__opt${checked ? ' dish-actions__opt--checked' : ''}`}>
                  <input
                    type={g.maxSelect === 1 ? 'radio' : 'checkbox'}
                    name={g.id}
                    checked={!!checked}
                    onChange={() => toggle(g, o)}
                  />
                  <span className="dish-actions__optName">{o.name}</span>
                  {o.price ? <span>+${o.price.toFixed(2)}</span> : null}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="field dish-actions__notes">
        <label>Instructions particulières</label>
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, cuisson…" />
      </div>

      <div className="dish-actions__foot">
        <div className="stepper">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Augmenter">+</button>
        </div>
        <button
          disabled={missing}
          onClick={handleAdd}
          className="btn btn-primary dish-actions__addBtn"
          style={{ opacity: missing ? 0.5 : 1 }}
        >
          {added ? 'Ajouté ✓' : `Ajouter — $${total.toFixed(2)}`}
        </button>
      </div>

      {added && (
        <button className="dish-actions__viewCart" onClick={openCart}>
          Voir le panier →
        </button>
      )}
    </div>
  );
}
