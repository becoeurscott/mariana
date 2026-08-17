export default function HarvestPromise() {
  return (
    <section className="harvest">
      <div className="container">
        <div className="harvest__eyebrow">Huff &amp; Puff Épicerie</div>
        <h2 className="serif harvest__title">LA PROMESSE DE LA RÉCOLTE</h2>
        <p className="harvest__lead">
          Une expérience d’épicerie artisanale, avec des trésors de saison mis en conserve
          et un menu qui change au rythme de ce que la ferme nous envoie.
        </p>

        <div className="harvest__grid">
          <div className="harvest__imageWrap">
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=85"
              alt="Table de produits frais"
              className="harvest__image"
            />
          </div>

          <div className="harvest__dark">
            <div className="harvest__entry">
              <div className="harvest__icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v18M4 12h16" />
                  <path d="M6 8c2 2 4 2 6 0M18 8c-2 2-4 2-6 0" />
                </svg>
              </div>
              <div>
                <div className="harvest__h">Notre approvisionnement 100 % éthique</div>
                <p className="harvest__p">
                  Chaque producteur avec qui nous travaillons signe notre Charte de sourcing —
                  salaires justes, sols régénératifs et transparence totale, du champ à l&apos;assiette.
                </p>
              </div>
            </div>

            <div className="harvest__entry">
              <div className="harvest__icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 20h16M6 20V8h4v12M14 20V4h4v16" />
                </svg>
              </div>
              <div>
                <div className="harvest__h">De la ferme à la table, au fil des saisons</div>
                <p className="harvest__p">
                  Les menus changent chaque semaine — nous cuisinons ce qui est au sommet
                  de sa maturité, jamais ce qui est simplement pratique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
