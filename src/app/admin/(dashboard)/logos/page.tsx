import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import LogosClient from './LogosClient';

export default async function LogosPage() {
  const { databases } = await createAdminClient();
  const res = await databases.listDocuments(DATABASE_ID, 'logos');
  
  // Clean up object for passing to client component
  const logos = res.documents.map((doc: any) => ({
    $id: doc.$id,
    name: doc.name,
    logoUrl: doc.logoUrl,
    $createdAt: doc.$createdAt,
  }));

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#111' }}>Manajemen Logo Klien</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Kelola daftar logo klien (mitra) yang akan muncul di tampilan carousel halaman utama.</p>
      
      <LogosClient initialLogos={logos} />
    </div>
  );
}
