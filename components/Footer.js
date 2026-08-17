import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.wrap}>
      <div className="ethnic-top-bar" style={{ opacity: 0.5 }} />
      <div className="container" style={styles.inner}>
        <div>
          <h3 className="serif" style={styles.brand}>Huff &amp; Puff</h3>
          <p style={styles.small}>
            123 rue du Signal, 75011 Paris<br />
            bonjour@huffandpuff.co<br />
            www.huffandpuff.co
          </p>
        </div>

        <div>
          <h5 style={styles.h5}>Contact</h5>
          <ul style={styles.ul}>
            <li><Link href="/contact">Nous contacter</Link></li>
            <li><Link href="/contact">Recrutement</Link></li>
            <li><Link href="/contact">Presse</Link></li>
          </ul>
        </div>

        <div>
          <h5 style={styles.h5}>Liens</h5>
          <ul style={styles.ul}>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/about">À propos</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h5 style={styles.h5}>Réseaux sociaux</h5>
          <div style={styles.socials}>
            <a aria-label="Instagram" style={styles.social}>◎</a>
            <a aria-label="Facebook"  style={styles.social}>f</a>
            <a aria-label="Twitter"   style={styles.social}>x</a>
            <a aria-label="TikTok"    style={styles.social}>♪</a>
          </div>
          <div style={styles.emblem}>◈</div>
        </div>
      </div>

      <div className="container" style={styles.copy}>
        <span>© 2026 Huff &amp; Puff Épicerie.</span>
        <span>Fait main &amp; savouré</span>
      </div>
    </footer>
  );
}

const styles = {
  wrap: {
    background: 'var(--bg-dark)',
    color: 'var(--text-cream)',
    marginTop: 60,
    paddingBottom: 30,
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
    gap: 40,
    padding: '60px 32px 40px',
  },
  brand: { fontSize: 32, marginBottom: 14, color: 'var(--text-cream)' },
  small: { color: 'var(--text-cream-secondary)', fontSize: 14, lineHeight: 1.9 },
  h5: {
    fontSize: 13,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: 16,
    color: 'var(--text-cream)',
    fontWeight: 700,
  },
  ul: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-cream-secondary)', fontSize: 14 },
  socials: { display: 'flex', gap: 10 },
  social: {
    width: 34, height: 34,
    borderRadius: '50%',
    display: 'grid', placeItems: 'center',
    background: 'var(--primary-terracotta)',
    color: 'white',
    fontSize: 14, fontWeight: 700,
    cursor: 'pointer',
  },
  emblem: {
    marginTop: 22,
    width: 60, height: 60,
    display: 'grid', placeItems: 'center',
    color: 'var(--accent-gold)',
    fontSize: 40,
    opacity: 0.6,
  },
  copy: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: 'var(--text-cream-secondary)',
  },
};
