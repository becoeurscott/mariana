import Link from 'next/link';

export default function CuratedBox() {
  return (
    <section id="curated" className="curated">
      <div className="container curated__grid">
        <div>
          <h2 className="serif curated__title">COFFRET<br />DÉGUSTATION</h2>
          <p className="curated__lead">
            Un panier mensuel digne d’un cadeau, préparé à la main : conserves maison,
            luxes de saison. Un abonnement, une box signature toutes les quatre semaines —
            deux vins, trois pâtes artisanales, une conserve du jardin et une fiche recette imprimée.
          </p>
          <Link href="/menu" className="btn btn-primary">S&apos;abonner</Link>
        </div>

        <div className="curated__imgWrap">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=85"
            alt="Coffret dégustation"
            className="curated__img"
          />
        </div>
      </div>
    </section>
  );
}
