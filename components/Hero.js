'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EthnicSides } from './EthnicPattern';
import FloatingLeaves from './FloatingLeaves';

export default function Hero() {
  return (
    <section style={styles.wrap}>
      <EthnicSides />
      <FloatingLeaves count={4} />

      <div className="container" style={styles.grid}>
        <div style={styles.left}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="serif"
            style={styles.h1}
          >
            Ce n&apos;est pas juste un <span style={styles.italic}>Repas,</span><br />
            c&apos;est une <span style={styles.italic}>Expérience.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={styles.lead}
          >
            Une cuisine gastronomique éditoriale, sourcée éthiquement, livrée chaude.
            Un menu dégustation renouvelé chaque semaine, au rythme des saisons.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={styles.ctas}
          >
            <Link href="/menu" className="btn btn-primary">Commander</Link>
            <Link href="#curated" className="btn btn-outline-gold">S&apos;abonner</Link>
          </motion.div>

          <div style={styles.reviews}>
            <div style={styles.avatarStack}>
              {['#f0d0a0', '#c88339', '#13382c', '#c5a059'].map((c, i) => (
                <div key={i} style={{ ...styles.avatar, background: c, marginLeft: i === 0 ? 0 : -10 }} />
              ))}
            </div>
            <div>
              <div className="stars">★★★★★</div>
              <div style={styles.reviewText}>5,0 <span style={{ opacity: 0.6 }}>(45+ avis clients)</span></div>
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={styles.bowlWrap}
          >
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85"
              alt="Plat signature"
              style={styles.bowl}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  wrap: { position: 'relative', padding: '80px 0 100px', overflow: 'hidden' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: 60,
    alignItems: 'center',
  },
  left: { position: 'relative', zIndex: 2 },
  h1: {
    fontSize: 'clamp(2.8rem, 6vw, 5rem)',
    lineHeight: 1.02,
    color: 'var(--text-dark)',
    letterSpacing: '-0.03em',
    marginBottom: 24,
  },
  italic: { fontStyle: 'italic', fontWeight: 500 },
  lead: {
    fontSize: 17,
    color: 'var(--text-dark-secondary)',
    maxWidth: 460,
    marginBottom: 32,
  },
  ctas: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 },
  reviews: { display: 'flex', alignItems: 'center', gap: 14 },
  avatarStack: { display: 'flex' },
  avatar: { width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--bg-page)' },
  reviewText: { fontSize: 13, color: 'var(--text-dark-secondary)', marginTop: 2 },

  right: { position: 'relative', display: 'grid', placeItems: 'center' },
  bowlWrap: {
    width: 'min(500px, 90%)',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    overflow: 'hidden',
    boxShadow: '0 40px 80px rgba(19, 56, 44, 0.25)',
    background: '#000',
  },
  bowl: { width: '100%', height: '100%', objectFit: 'cover' },
};
