import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'MariAnafood — Ce n’est pas juste un repas, c’est une expérience.',
  description:
    'Cuisine gastronomique éditoriale, menus de saison de la ferme à la table, coffrets dégustation et livraison le jour même.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
