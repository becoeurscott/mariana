import OneScreenHome from '@/components/OneScreenHome';
import HarvestPromise from '@/components/HarvestPromise';
import CuratedBox from '@/components/CuratedBox';
import RecipesFromHeart from '@/components/RecipesFromHeart';
import SnapScrollEnabler from '@/components/SnapScrollEnabler';

export default function HomePage() {
  return (
    <>
      <SnapScrollEnabler />
      <main>
        <div className="snap-section"><OneScreenHome /></div>
        <div className="snap-section"><HarvestPromise /></div>
        <div className="snap-section"><CuratedBox /></div>
        <div className="snap-section"><RecipesFromHeart /></div>
      </main>
    </>
  );
}
