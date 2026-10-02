import { prisma } from '@/lib/prisma';
import { normalizeSizeChart } from '@/lib/normalize';
import SizeChartClient from './SizeChartClient';

export default async function SizeChartAdminPage() {
  let sizeCharts: any[] = [];
  try {
    const raw = await prisma.sizeChart.findMany({
      orderBy: [{ sequence: 'asc' }, { created_at: 'desc' }],
    });
    sizeCharts = raw.map(normalizeSizeChart);
  } catch (error) {
    console.error("Gagal memuat panduan ukuran:", error);
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }}>Manajemen Panduan Ukuran</h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>Kelola daftar gambar Size Chart (Panduan Ukuran) yang akan ditampilkan di website.</p>
      </div>

      <SizeChartClient initialItems={sizeCharts} />
    </div>
  );
}
