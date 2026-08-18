'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Fallback only — the real dishes are passed in from the server. */
const DEMO = [
  { id: 1, name: 'Croque Monsieur', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', price: 14 },
  { id: 2, name: 'Lasagne',         image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=700&q=80', price: 18 },
];

export default function PopularCarousel({ items, compact = false }) {
  const list = items?.length ? items : DEMO;
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const visible = useMemo(
    () => list.slice(page * perPage, page * perPage + perPage),
    [list, page],
  );

  useEffect(() => {
    if (totalPages <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), 4500);
    return () => clearInterval(id);
  }, [totalPages]);

  return (
    <div className="pop-carousel" style={{ padding: compact ? 0 : '20px 0 40px' }}>
      {!compact && (
        <>
          <div style={{ fontSize: 12, letterSpacing: '0.36em', fontWeight: 600, color: 'var(--text-dark-secondary)', marginBottom: 6 }}>
            NOTRE CARTE
          </div>
          <h2 className="serif" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: 24 }}>Nos spécialités</h2>
        </>
      )}

      <div className="pop-carousel__stage">
        {totalPages > 1 && (
          <button className="pop-carousel__nav" onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)} aria-label="Précédent">‹</button>
        )}

        <div className="pop-carousel__grid" data-count={Math.min(visible.length, 4)}>
          <AnimatePresence mode="popLayout">
            {visible.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="pop-carousel__card"
              >
                <div className="pop-carousel__imgWrap">
                  <img src={it.image} alt={it.name} className="pop-carousel__img" />
                </div>
                <div className="pop-carousel__body">
                  <div className="pop-carousel__name">{it.name}</div>
                  <div className="pop-carousel__tag">${it.price.toFixed(2)}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <button className="pop-carousel__nav" onClick={() => setPage((p) => (p + 1) % totalPages)} aria-label="Suivant">›</button>
        )}
      </div>

      {!compact && totalPages > 1 && (
        <div className="pop-carousel__dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="pop-carousel__dot"
              style={{ background: i === page ? 'var(--primary-terracotta)' : 'rgba(0,0,0,0.15)' }}
              aria-label={`Aller à la page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
