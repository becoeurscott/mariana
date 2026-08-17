'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { isOpen, closeCart, items, updateQty, removeItem, subtotal, lineTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            style={styles.backdrop}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            style={styles.panel}
          >
            <div style={styles.head}>
              <h3 className="serif" style={{ fontSize: 26, color: 'var(--text-cream)' }}>Votre commande</h3>
              <button onClick={closeCart} style={styles.close} aria-label="Fermer">✕</button>
            </div>

            <div style={styles.body}>
              {items.length === 0 ? (
                <p style={{ color: 'var(--text-cream-secondary)' }}>
                  Votre panier est vide. Parcourez le menu pour ajouter un délice.
                </p>
              ) : (
                items.map((l) => (
                  <motion.div
                    key={l.key}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    style={styles.line}
                  >
                    {l.image && <img src={l.image} alt={l.name} style={styles.thumb} />}
                    <div style={{ flex: 1 }}>
                      <div style={styles.name}>{l.name}</div>
                      {l.selectedOptions?.length > 0 && (
                        <div style={styles.opts}>{l.selectedOptions.map((o) => o.name).join(', ')}</div>
                      )}
                      <div style={styles.row}>
                        <div className="stepper stepper-dark">
                          <button onClick={() => updateQty(l.key, -1)}>−</button>
                          <span>{l.quantity}</span>
                          <button onClick={() => updateQty(l.key, +1)}>+</button>
                        </div>
                        <div style={styles.price}>{lineTotal(l).toFixed(2)} €</div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(l.key)} style={styles.remove} aria-label="Retirer">✕</button>
                  </motion.div>
                ))
              )}
            </div>

            <div style={styles.foot}>
              <div style={styles.subtotal}>
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn btn-primary"
                style={{ width: '100%', pointerEvents: items.length === 0 ? 'none' : 'auto', opacity: items.length === 0 ? 0.5 : 1 }}
              >
                Passer commande
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60 },
  panel: {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: 'min(420px, 100%)',
    background: 'var(--bg-dark)',
    color: 'var(--text-cream)',
    display: 'flex', flexDirection: 'column',
    zIndex: 61,
    boxShadow: '-20px 0 40px rgba(0,0,0,0.2)',
  },
  head: { padding: '24px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  close: { color: 'var(--text-cream)', fontSize: 18, opacity: 0.8 },
  body: { flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 18 },
  line: { display: 'flex', gap: 12, background: 'var(--bg-dark-card)', padding: 12, borderRadius: 14 },
  thumb: { width: 64, height: 64, objectFit: 'cover', borderRadius: 10 },
  name: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  opts: { fontSize: 12, color: 'var(--text-cream-secondary)', marginBottom: 8 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  price: { fontWeight: 700, fontSize: 15 },
  remove: { color: 'var(--text-cream-secondary)', fontSize: 12, alignSelf: 'flex-start' },
  foot: { padding: '18px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  subtotal: { display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 15, fontWeight: 600 },
};
