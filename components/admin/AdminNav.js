'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTIONS = [
  {
    title: 'Exploitation',
    links: [
      { href: '/admin',           label: "Vue d'ensemble",     icon: '◐' },
      { href: '/admin/orders',    label: 'Commandes',          icon: '☰' },
      { href: '/admin/analytics', label: 'Analytiques',        icon: '↗' },
    ],
  },
  {
    title: 'Catalogue',
    links: [
      { href: '/admin/menu',       label: 'Articles',           icon: '◆' },
      { href: '/admin/categories', label: 'Catégories',         icon: '☷' },
    ],
  },
  {
    title: 'Comptes',
    links: [
      { href: '/admin/customers',  label: 'Clients',            icon: '♙' },
      { href: '/admin/users',      label: 'Utilisateurs & rôles', icon: '⚑' },
    ],
  },
  {
    title: 'Établissement',
    links: [
      { href: '/admin/restaurant', label: 'Paramètres',         icon: '⚙' },
    ],
  },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="admin-nav">
      {SECTIONS.map((s) => (
        <div key={s.title}>
          <div className="admin-nav__section">{s.title}</div>
          {s.links.map((l) => {
            const active = l.href === '/admin' ? path === l.href : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`admin-nav__link${active ? ' admin-nav__link--active' : ''}`}>
                <span className="admin-nav__icon">{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
