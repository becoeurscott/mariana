'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO = [
  { id: 1, name: 'Pappardelle al Ragù',   image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=700&q=80', price: 26 },
  { id: 2, name: 'Entrée rôtie',           image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=700&q=80', price: 18 },
  { id: 3, name: 'Pappardelle verde',      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80', price: 20 },
  { id: 4, name: 'Ravioli aux herbes',     image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80', price: 28 },
];

const DAY_NAMES  = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTH_ABBR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** Returns [{ dayName, dateLabel }] for N consecutive days starting today. */
function useWeekDays(count) {
  const [days, setDays] = useState([]);
  useEffect(() => {
    const out = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({
        dayName:   DAY_NAMES[d.getDay()],
        dateLabel: `${d.getDate()} ${MONTH_ABBR[d.getMonth()]}`,
      });
    }
    setDays(out);
  }, [count]);
  return days;
}

export default function PopularCarousel({ items, compact = false }) {
  const list = items?.length ? items : DEMO;
  const days = useWeekDays(list.length);
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const visible = useMemo(
    () => list.slice(page * perPage, page * perPage + perPage)
              .map((it, i) => ({ ...it, day: days[page * perPage + i] })),
    [list, page, days],
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
            CETTE SEMAINE
          </div>
          <h2 className="serif" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: 24 }}>Menu du jour</h2>
        </>
      )}

      <div className="pop-carousel__stage">
        <button className="pop-carousel__nav" onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)} aria-label="Précédent">‹</button>

        <div className="pop-carousel__grid">
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
                {it.day && (
                  <div className="pop-carousel__day">
                    <span className="pop-carousel__dayName">{it.day.dayName}</span>
                    <span className="pop-carousel__dayDate">{it.day.dateLabel}</span>
                  </div>
                )}
                <div className="pop-carousel__imgWrap">
                  <img src={it.image} alt={it.name} className="pop-carousel__img" />
                </div>
                <div className="pop-carousel__body">
                  <div className="pop-carousel__name">{it.name}</div>
                  <div className="pop-carousel__tag">{it.price.toFixed(2)} €</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button className="pop-carousel__nav" onClick={() => setPage((p) => (p + 1) % totalPages)} aria-label="Suivant">›</button>
      </div>

      {!compact && (
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
