import React from 'react';
import styles from './page.module.css';
import { Package } from 'lucide-react';
import Reveal from "@/components/Reveal/Reveal";
import { prisma } from '@/lib/prisma';
import { normalizeProduct } from '@/lib/normalize';
import ProductCatalog from '@/app/ProductCatalog';

export const revalidate = 60;

export default async function Products() {
  let products: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      orderBy: [{ sequence: 'asc' }, { created_at: 'desc' }],
    });
    products = raw.map(normalizeProduct);
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
  }

  return (
    <>
      <section className={styles.productsHero}>
        <div className="container">
          <div className="sectionBadge">
            <Package size={16} /> Katalog Produk
          </div>
          <h1 className={`${styles.title} animate-fade-up`}>Katalog</h1>
          <p className={`${styles.introText} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
            Jelajahi berbagai pilihan apparel custom premium kami. Dirancang untuk memenuhi kebutuhan brand Anda dengan kualitas standar garment.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--secondary)', flex: 1 }}>
        <div className="container">
          <Reveal once>
            <ProductCatalog products={products} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
