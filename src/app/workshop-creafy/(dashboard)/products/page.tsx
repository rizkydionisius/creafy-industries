import { prisma } from '@/lib/prisma';
import { normalizeProduct } from '@/lib/normalize';
import ProductsClient from './ProductsClient';

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      orderBy: [{ sequence: 'asc' }, { created_at: 'desc' }],
    });
    products = raw.map(normalizeProduct);
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
