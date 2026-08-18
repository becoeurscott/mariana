import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import '@/app/admin/admin.css';

export const metadata = { title: 'Admin — MariAnafood' };

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand__mark">◈</span>
          <span>
            <div className="admin-brand__name">MariAnafood</div>
            <div className="admin-brand__role">Console admin</div>
          </span>
        </Link>
        <AdminNav />
        <div className="admin-side__foot">
          <Link href="/" className="admin-side__leave">← Retour au site</Link>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
