import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ethnic-top-bar" style={{ opacity: 0.5 }} />
      <div className="footer__inner">
        <div className="footer__col footer__brandCol">
          <h3 className="serif footer__brand">Huff &amp; Puff</h3>
          <p className="footer__small">
            123 rue du Signal, 75011 Paris<br />
            bonjour@huffandpuff.co<br />
            www.huffandpuff.co
          </p>
        </div>

        <div className="footer__col">
          <h5 className="footer__h5">Contact</h5>
          <ul className="footer__ul">
            <li><Link href="/contact">Nous contacter</Link></li>
            <li><Link href="/contact">Recrutement</Link></li>
            <li><Link href="/contact">Presse</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h5 className="footer__h5">Liens</h5>
          <ul className="footer__ul">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/about">À propos</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h5 className="footer__h5">Réseaux sociaux</h5>
          <div className="footer__socials">
            <a aria-label="Instagram" className="footer__social">◎</a>
            <a aria-label="Facebook"  className="footer__social">f</a>
            <a aria-label="Twitter"   className="footer__social">x</a>
            <a aria-label="TikTok"    className="footer__social">♪</a>
          </div>
          <div className="footer__emblem">◈</div>
        </div>
      </div>

      <div className="footer__copy">
        <span>© 2026 Huff &amp; Puff Épicerie.</span>
        <span>Fait main &amp; savouré</span>
      </div>
    </footer>
  );
}
