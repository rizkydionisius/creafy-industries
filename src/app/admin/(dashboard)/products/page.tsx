import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import ProductsClient from './ProductsClient';

export default async function ProductsPage() {
  let products = [];
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'products', [
      Query.orderAsc('sequence'),
      Query.orderDesc('$createdAt')
    ]);
    // Konversi ke plain object untuk SSR Next.js
    products = JSON.parse(JSON.stringify(res.documents));
  } catch (error) {
    console.error("Gagal memuat produk:", error);
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }}>Katalog</h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>Kelola daftar katalog produk yang ditawarkan.</p>
      </div>

      <ProductsClient initialProducts={products} />
    </div>
  );
}
