import { prisma } from '@/lib/prisma';
import { normalizePortfolio } from '@/lib/normalize';
import PortfolioClient from './PortfolioClient';

export default async function PortfolioAdminPage() {
  let portfolios: any[] = [];
  try {
    const raw = await prisma.portfolio.findMany({
      orderBy: [{ sequence: 'asc' }, { created_at: 'desc' }],
    });
    portfolios = raw.map(normalizePortfolio);
  } catch (error) {
    console.error("Gagal memuat portofolio:", error);
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }}>Manajemen Portofolio</h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>Kelola daftar karya portofolio yang ditampilkan di website.</p>
      </div>

      <PortfolioClient initialPortfolios={portfolios} />
    </div>
  );
}
