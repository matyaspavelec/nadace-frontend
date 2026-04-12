'use client';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Users, FolderOpen, ClipboardList, ScrollText } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Přehled', icon: BarChart3 },
  { href: '/admin/uzivatele', label: 'Uživatelé', icon: Users },
  { href: '/admin/projekty', label: 'Projekty', icon: FolderOpen },
  { href: '/admin/pohovory', label: 'Pohovory', icon: ClipboardList },
  { href: '/admin/audit', label: 'Audit log', icon: ScrollText },
];

export default function AdminLayout({ children }) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !hasRole('ADMIN', 'REGISTRATION_MANAGER', 'PROJECT_REVIEWER', 'CONTENT_EDITOR', 'COMMENT_MODERATOR'))) {
      router.push('/login');
    }
  }, [user, loading, router, hasRole]);

  if (loading) return <div className="loading"><div className="spinner" />Načítání...</div>;
  if (!user) return null;

  return (
    <div className="page-container">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          {links.map(l => {
            const Icon = l.icon;
            const isActive = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className={`admin-sidebar-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} /> {l.label}
              </Link>
            );
          })}
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
