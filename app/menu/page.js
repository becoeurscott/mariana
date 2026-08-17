import MenuGrid from '@/components/MenuGrid';
import OrderSummary from '@/components/OrderSummary';
import MobileCartCTA from '@/components/MobileCartCTA';
import Reveal from '@/components/Reveal';
import { getPublicMenu } from '@/services/menuService';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const { categories } = await getPublicMenu();

  return (
    <main className="menu-page">
      {/* Hero Banner */}
      <section className="menu-banner">
        <div className="menu-banner__pattern" aria-hidden="true">
          <svg viewBox="0 0 60 800" width="60" height="800" preserveAspectRatio="none">
            <g fill="none" stroke="#C5A059" strokeWidth="1" opacity="0.6">
              {/* Repeating tribal pattern */}
              {[0, 120, 240, 360, 480, 600].map((y) => (
                <g key={y}>
                  <rect x="8" y={y + 10} width="44" height="44" rx="3" />
                  <line x1="8" y1={y + 32} x2="52" y2={y + 32} />
                  <line x1="30" y1={y + 10} x2="30" y2={y + 54} />
                  <path d={`M14 ${y + 65} L30 ${y + 80} L46 ${y + 65}`} />
                  <path d={`M14 ${y + 85} L46 ${y + 85}`} />
                  <path d={`M20 ${y + 95} L40 ${y + 95}`} />
                  <path d={`M14 ${y + 105} L46 ${y + 105}`} />
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="menu-banner__content">
          <h1 className="serif menu-banner__title">
            DÉCOUVREZ NOTRE MENU DE SAISON<br />&amp; COMMANDEZ DIRECTEMENT<br />À VOTRE PORTE.
          </h1>
          <p className="menu-banner__sub">Fait avec passion, livré avec soin.</p>
        </div>

        <div className="menu-banner__image">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85"
            alt="Plats de saison"
          />
        </div>
      </section>

      {/* Menu Body */}
      <section className="container menu-body">
        <div className="menu-layout">
          <div className="menu-layout__main">
            <Reveal from="up" amount={0.05}>
              <MenuGrid categories={categories} />
            </Reveal>
          </div>
          <div className="menu-layout__sidebar hide-mobile">
            <OrderSummary />
          </div>
        </div>
      </section>

      <MobileCartCTA />
    </main>
  );
}
