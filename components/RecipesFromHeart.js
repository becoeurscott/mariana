const RECIPES = [
  {
    title: 'Le secret du Jollof',
    body: 'Laissez le riz accrocher légèrement au fond — c’est là que naît le goût fumé.',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Suya & épices yaji',
    body: 'Torréfiez les arachides avant de les moudre : la différence est immédiate.',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Masterclass & rencontres',
    body: 'Tables du chef réservées à l’avance, ateliers de saison et sessions Q&R.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=85',
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
