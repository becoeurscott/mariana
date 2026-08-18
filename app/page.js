import OneScreenHome from '@/components/OneScreenHome';
import HarvestPromise from '@/components/HarvestPromise';
import CuratedBox from '@/components/CuratedBox';
import RecipesFromHeart from '@/components/RecipesFromHeart';
import SnapScrollEnabler from '@/components/SnapScrollEnabler';
import { getPublicMenu } from '@/services/menuService';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // The "Menu du jour" strip shows real dishes so it can never advertise
  // something that isn't actually on the menu.
  const { categories } = await getPublicMenu();
  const dishes = categories.flatMap((c) => c.items);

  return (
    <>
      <SnapScrollEnabler />
      <main>
        <div className="snap-section"><OneScreenHome dishes={dishes} /></div>
        <div className="snap-section"><HarvestPromise /></div>
        <div className="snap-section"><CuratedBox /></div>
        <div className="snap-section"><RecipesFromHeart /></div>
      </main>
    </>
  );
}
