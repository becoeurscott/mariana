import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDishDetail } from '@/services/menuService';
import DishDetailActions from '@/components/DishDetailActions';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const detail = await getDishDetail(id).catch(() => null);
  if (!detail) return { title: 'Plat introuvable — Huff & Puff' };
  return {
    title: `${detail.item.name} — Huff & Puff`,
    description: detail.item.description || undefined,
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const detail = await getDishDetail(id);
  if (!detail) notFound();

  const { item, related } = detail;

  return (
    <main className="dish-page">
      <div className="dish-page__container">
        <nav className="dish-page__breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/menu">Menu</Link>
          <span>/</span>
          <Link href={`/menu?cat=${encodeURIComponent(item.category.name)}`}>{item.category.name}</Link>
          <span>/</span>
          <span className="dish-page__breadcrumbCurrent">{item.name}</span>
        </nav>

        <div className="dish-page__layout">
          {item.image && (
            <Reveal from="up" className="dish-page__imgWrap">
              <img src={item.image} alt={item.name} className="dish-page__img" />
            </Reveal>
          )}

          <Reveal from="up" delay={0.1} className="dish-page__info">
            <h1 className="serif dish-page__title">{item.name}</h1>

            <div className="dish-page__meta">
              <span className="dish-page__price">${item.price.toFixed(2)}</span>
              {item.dietary === 'Vegetarian' && <span className="chip veg">🌱 Végétarien</span>}
              {item.dietary === 'Gluten-Free' && <span className="chip gf">Sans gluten</span>}
              {item.dietary === 'Vegan' && <span className="chip veg">Vegan</span>}
            </div>

            {item.description && <p className="dish-page__desc">{item.description}</p>}

            <DishDetailActions item={item} />
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="dish-page__related">
            <h2 className="serif dish-page__relatedTitle">Vous aimerez aussi</h2>
            <div className="dish-page__relatedGrid">
              {related.map((r) => (
                <Link key={r.id} href={`/menu/${r.id}`} className="dish-page__relatedCard">
                  {r.image && <img src={r.image} alt={r.name} className="dish-page__relatedImg" />}
                  <div className="dish-page__relatedBody">
                    <div className="dish-page__relatedName">{r.name}</div>
                    <div className="dish-page__relatedPrice">${r.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
