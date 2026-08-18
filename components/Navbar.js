'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={styles.wrap}>
      <div className="container" style={styles.inner}>
        <Link href="/" style={styles.brand}>
          {/* The logo artwork is a full lockup; crop to the gold monogram so it
              still reads at navbar size, with the wordmark set alongside it. */}
          <span style={styles.logoMark}>
            <img src="/logo.jpeg" alt="" style={styles.logoImg} />
          </span>
          <span className="serif" style={styles.brandName}>MariAnafood</span>
        </Link>

        <nav style={styles.nav} className="hide-mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={styles.link}>{l.label}</Link>
          ))}
        </nav>

        <div style={styles.actions}>
          <button style={styles.iconBtn} aria-label="Rechercher">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
          </button>
          <button style={styles.iconBtn} onClick={openCart} aria-label="Panier">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
              <path d="M6 6L4 3H2" strokeLinecap="round" />
            </svg>
            {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
          </button>
          <Link href="/menu" className="btn btn-primary btn-sm hide-mobile">Commander</Link>
          <button
            className="show-mobile"
            style={styles.iconBtn}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="show-mobile" style={styles.mobileDrawer}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={styles.mobileLink}>
              {l.label}
            </Link>
          ))}
          <Link href="/menu" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ marginTop: 16 }}>
            Commander
          </Link>
        </div>
      )}
    </header>
  );
}

const styles = {
  wrap: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(250, 246, 238, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-cream)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 32px',
    gap: 24,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  logoMark: {
    display: 'inline-grid', placeItems: 'center',
    width: 40, height: 40, borderRadius: 10,
    overflow: 'hidden', flexShrink: 0,
    border: '1px solid var(--border-gold)',
  },
  logoImg: {
    width: '100%', height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 33%',   /* focus the MAF monogram */
    transform: 'scale(1.55)',        /* crop out the surrounding paper */
  },
  brandName: { fontSize: 22, color: 'var(--text-dark)', fontWeight: 600 },
  nav: { display: 'flex', gap: 30 },
  link: { fontSize: 14, fontWeight: 500, color: 'var(--text-dark)' },
  actions: { display: 'flex', alignItems: 'center', gap: 12 },
  iconBtn: {
    position: 'relative',
    width: 40, height: 40,
    borderRadius: '50%',
    display: 'grid', placeItems: 'center',
    color: 'var(--text-dark)',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid var(--border-cream)',
    transition: 'background .15s ease',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    background: 'var(--primary-terracotta)',
    color: 'white',
    fontSize: 11, fontWeight: 700,
    minWidth: 18, height: 18,
    borderRadius: 999,
    display: 'grid', placeItems: 'center',
    padding: '0 5px',
  },
  mobileDrawer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    background: 'var(--bg-card)',
    borderTop: '1px solid var(--border-cream)',
    gap: 4,
  },
  mobileLink: {
    padding: '14px 4px',
    borderBottom: '1px solid var(--border-cream)',
    fontSize: 16, fontWeight: 500,
  },
};
