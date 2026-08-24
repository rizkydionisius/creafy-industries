import React from 'react';
import styles from './page.module.css';
import { Package } from 'lucide-react';
import Reveal from "@/components/Reveal/Reveal";
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import ProductCatalog from '@/app/ProductCatalog';

export default async function Products() {
  let products = [];
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'products', [
      Query.orderAsc('sequence'),
      Query.orderDesc('$createdAt')
    ]);
    products = JSON.parse(JSON.stringify(res.documents));
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
