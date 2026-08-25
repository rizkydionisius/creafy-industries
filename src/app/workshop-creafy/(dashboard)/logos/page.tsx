import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import LogosClient from './LogosClient';

export default async function LogosPage() {
  let logos = [];
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'logos', [
      Query.orderAsc('sequence'),
      Query.orderDesc('$createdAt')
    ]);
    
    // Clean up object for passing to client component
    logos = res.documents.map((doc: any) => ({
      $id: doc.$id,
      name: doc.name,
      logoUrl: doc.logoUrl,
      sequence: doc.sequence || 0,
      $createdAt: doc.$createdAt,
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
