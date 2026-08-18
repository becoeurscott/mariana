'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EthnicSides } from './EthnicPattern';
import PopularCarousel from './PopularCarousel';

/**
 * One-viewport landing on desktop (≥ 1024px):
 *   ┌──────────────────────────────────────────────────┐
 *   │  HERO TEXT + CTAs      │   SIGNATURE BOWL        │
 *   │  reviews + rating      │   (circular photo)      │
 *   ├────────────────────────┴──────────────────────────┤
 *   │  Menu du jour strip (real dishes, full width)     │
 *   └──────────────────────────────────────────────────┘
 *
 * Below 1024px it stacks into a normal scrolling flow with reveal animations.
 */
export default function OneScreenHome({ dishes = [] }) {
  return (
    <section className="one-screen">
      <EthnicSides />

      <div className="one-screen__grid">
        {/* HERO left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="one-screen__hero"
        >
          <h1 className="serif one-screen__title">
            Ce n&apos;est pas juste un <em className="one-screen__accent">Repas</em><br />
            c&apos;est une <em className="one-screen__accent">Expérience.</em>
          </h1>
          <p className="one-screen__lead">
            Une cuisine gastronomique éditoriale, sourcée éthiquement,
            livrée chaude. Un menu de dégustation renouvelé chaque semaine.
          </p>
          <div className="one-screen__ctas">
            <Link href="/menu" className="btn btn-primary">Commander</Link>
            <Link href="/contact" className="btn btn-outline-gold">Contacter</Link>
          </div>
          <div className="one-screen__reviews">
            <div className="one-screen__avatars">
              {['#f0d0a0', '#c88339', '#13382c', '#c5a059'].map((c, i) => (
                <span key={i} style={{ background: c, marginLeft: i === 0 ? 0 : -8 }} />
              ))}
            </div>
            <div>
              <div className="stars">★★★★★</div>
              <div className="one-screen__reviewText">5,0 <span>(45+ avis clients)</span></div>
            </div>
          </div>
        </motion.div>

        {/* SIGNATURE BOWL right */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="one-screen__bowl"
        >
          <img
            src="https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=900&q=85"
            alt="Notre lasagne maison"
          />
        </motion.div>

        {/* Popular strip bottom-left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="one-screen__popular"
        >
          <div className="one-screen__stripHead">
            <span className="one-screen__stripEyebrow">NOTRE CARTE</span>
            <h3 className="serif one-screen__stripTitle">Nos spécialités</h3>
          </div>
          <PopularCarousel compact items={dishes} />
        </motion.div>
      </div>
    </section>
  );
}
