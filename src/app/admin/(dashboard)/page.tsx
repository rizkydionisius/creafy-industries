import { FileText, ShoppingBag, Image, Building2, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const cards = [
    { title: 'Manajemen Artikel', desc: 'Kelola tulisan blog dan berita terbaru seputar industri.', link: '/admin/articles', icon: FileText, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Manajemen Produk', desc: 'Tambah atau edit katalog produk konveksi.', link: '/admin/products', icon: ShoppingBag, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Manajemen Portofolio', desc: 'Tampilkan hasil produksi dan jahitan terbaik.', link: '/admin/portfolio', icon: Image, color: '#ec4899', bg: '#fdf2f8' },
    { title: 'Logo Klien', desc: 'Kelola gambar logo untuk carousel di halaman utama.', link: '/admin/logos', icon: Building2, color: '#f59e0b', bg: '#fffbeb' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#111' }}>Selamat Datang, Admin!</h1>
      <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Masuk sebagai creafy.industries@creafy.id</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {cards.map((item, i) => (
          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: item.bg, padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={24} color={item.color} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#111', fontWeight: 600 }}>{item.title}</h3>
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem', flex: 1, lineHeight: 1.5 }}>{item.desc}</p>
            <a href={item.link} style={{ color: item.color, fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Kelola {item.title.replace('Manajemen ', '')} <ArrowRight size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
