"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, ShoppingBag, Image, Building2, LogOut, Ruler } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Artikel', path: '/admin/articles', icon: FileText },
    { name: 'Katalog', path: '/admin/products', icon: ShoppingBag },
    { name: 'Portofolio', path: '/admin/portfolio', icon: Image },
    { name: 'Panduan Ukuran', path: '/admin/size-chart', icon: Ruler },
    { name: 'Logo Klien', path: '/admin/logos', icon: Building2 },
  ];

  return (
    <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #eaeaea', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
        <h2 style={{ margin: 0, color: '#111', fontSize: '1.25rem', fontWeight: '700' }}>Admin Panel</h2>
        <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.85rem' }}>Creafy Industries</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 1rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                borderRadius: '8px', textDecoration: 'none', 
                background: isActive ? '#fff7ed' : 'transparent',
                color: isActive ? '#ea580c' : '#555',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={20} color={isActive ? '#ea580c' : '#888'} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid #eaeaea' }}>
        <form action={logout}>
          <button type="submit" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
            borderRadius: '8px', background: 'transparent', border: 'none', width: '100%',
            color: '#dc2626', fontWeight: 500, cursor: 'pointer', textAlign: 'left',
            fontSize: '0.95rem'
          }}>
            <LogOut size={20} />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
