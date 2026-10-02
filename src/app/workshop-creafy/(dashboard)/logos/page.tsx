import { prisma } from '@/lib/prisma';
import { normalizeLogo } from '@/lib/normalize';
import LogosClient from './LogosClient';

export default async function LogosPage() {
  let logos: any[] = [];
  try {
    const rawLogos = await prisma.logo.findMany({
      orderBy: [{ sequence: 'asc' }, { created_at: 'desc' }],
    });
    logos = rawLogos.map((doc) => ({
      $id: doc.id,
      name: doc.name,
      logoUrl: doc.logo_url,
      sequence: doc.sequence,
      $createdAt: doc.created_at.toISOString(),
    }));
  } catch (error) {
    console.error("Gagal memuat logo:", error);
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111' }}>Manajemen Logo Klien</h1>
      <p style={{ color: '#666', margin: '0 0 2rem 0', fontSize: '0.95rem' }}>Kelola daftar logo klien (mitra) yang akan muncul di tampilan carousel halaman utama.</p>
      
      <LogosClient initialLogos={logos} />
    </div>
  );
}
