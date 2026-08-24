import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import SizeChartClient from './SizeChartClient';

export default async function SizeChartAdminPage() {
  let sizeCharts = [];
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'size_charts', [
      Query.orderAsc('sequence'),
      Query.orderDesc('$createdAt')
    ]);
    
    sizeCharts = JSON.parse(JSON.stringify(res.documents));
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
