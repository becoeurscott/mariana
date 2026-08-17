'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

/**
 * Shows the site-wide Navbar/Footer/CartSidebar everywhere EXCEPT inside /admin,
 * which has its own admin console shell.
 */
export default function SiteChrome({ children }) {
  const path = usePathname() || '';
  const isAdmin = path.startsWith('/admin');
  if (isAdmin) return children;
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartSidebar />
    </>
  );
}
