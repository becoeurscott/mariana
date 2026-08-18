'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import DishModal from './DishModal';

export default function MenuGrid({ categories }) {
  const ALL = 'TOUT';
  const [active, setActive] = useState(ALL);
  const [modalItem, setModalItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const { addItem } = useCart();

  const catNames = [ALL, ...categories.map((c) => c.name)];
  const items = useMemo(() => {
    const all = categories.flatMap((c) => c.items.map((i) => ({ ...i, categoryName: c.name })));
    return active === ALL ? all : all.filter((i) => i.categoryName === active);
  }, [categories, active]);

  function getQty(id) { return quantities[id] || 1; }
  function setQty(id, val) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));
  }

  return (
    <div>
      {/* Category Filter Bar — pipe separated */}
      <nav className="menu-filter-bar">
        {catNames.map((c, i) => (
          <span key={c} className="menu-filter-bar__item">
            <button
              onClick={() => setActive(c)}
              className={`menu-filter-btn${active === c ? ' menu-filter-btn--active' : ''}`}
            >
              {c.toUpperCase()}
            </button>
            {i < catNames.length - 1 && <span className="menu-filter-pipe">|</span>}
          </span>
        ))}
      </nav>

      {/* Menu Grid */}
      <div className="menu-grid">
        <AnimatePresence mode="popLayout">
          {items.map((it, i) => (
            <motion.article
              key={it.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="menu-card"
            >
              {/* Circular image — links to the dish detail page */}
              {it.image && (
                <Link href={`/menu/${it.id}`} className="menu-card__link">
                  <div className="menu-card__img-wrap">
                    <img src={it.image} alt={it.name} className="menu-card__img" />
                  </div>
                </Link>
              )}

              {/* Card body */}
              <div className="menu-card__body">
                <Link href={`/menu/${it.id}`} className="menu-card__link">
                  <h3 className="menu-card__name">{it.name}</h3>
                </Link>
                <p className="menu-card__desc">{it.description}</p>

                <div className="menu-card__meta">
                  <span className="menu-card__price">${it.price.toFixed(2)}</span>
                  {it.dietary === 'Vegetarian' && (
                    <span className="menu-card__badge menu-card__badge--veg">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" fill="#13382C"/>
                        <path d="M6 8l2 2 3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Végétarien
                    </span>
                  )}
                  {it.dietary === 'Gluten-Free' && (
                    <span className="menu-card__badge menu-card__badge--gf">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" fill="#8f5a1e"/>
                        <path d="M6 8l2 2 3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sans gluten
                    </span>
                  )}
                </div>

                {/* Stepper + Add to Cart */}
                <div className="menu-card__actions">
                  <div className="stepper">
                    <button onClick={() => setQty(it.id, getQty(it.id) - 1)}>−</button>
                    <span>{getQty(it.id)}</span>
                    <button onClick={() => setQty(it.id, getQty(it.id) + 1)}>+</button>
                  </div>
                  <button
                    className="menu-card__add-btn"
                    onClick={() => {
                      if (it.optionGroups?.length) setModalItem(it);
                      else addItem(it, getQty(it.id), [], '');
                    }}
                  >
                    AJOUTER
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {modalItem && (
        <DishModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onAdd={({ qty, opts, notes }) => addItem(modalItem, qty, opts, notes)}
        />
      )}
    </div>
  );
}
