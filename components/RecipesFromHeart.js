const RECIPES = [
  {
    title: 'Ravioli à la truffe',
    body: 'Pliez vos raviolis à la main — les plus imparfaits sont toujours les meilleurs.',
    image: 'https://images.unsplash.com/photo-1587740908075-9e245311f26d?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Pappardelle aux légumes',
    body: 'Grillez les légumes chaud & vite, assaisonnez doux & lentement — la règle d’or.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Masterclass & rencontres',
    body: 'Tables du chef réservées à l’avance, ateliers de saison et sessions Q&R.',
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=85',
  },
];

export default function RecipesFromHeart() {
  return (
    <section className="recipes">
      <div className="container">
        <h2 className="serif recipes__title">RECETTES DU CŒUR</h2>

        <div className="recipes__grid">
          {RECIPES.map((r) => (
            <article key={r.title} className="recipes__card">
              <div className="recipes__imgWrap">
                <img src={r.image} alt={r.title} className="recipes__img" />
              </div>
              <div className="recipes__body">
                <h3 className="recipes__h">{r.title}</h3>
                <p className="recipes__p">{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
