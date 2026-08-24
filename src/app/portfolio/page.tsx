import React from 'react';
import styles from './page.module.css';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import { Briefcase } from 'lucide-react';
import PortfolioFilterClient from './PortfolioFilterClient';

export default async function PortfolioPage() {
  let portfolios = [];

  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'portfolio', [
      Query.orderAsc('sequence'),
      Query.orderDesc('$createdAt')
    ]);
    
    portfolios = JSON.parse(JSON.stringify(res.documents));
  } catch (error) {
    console.error("Gagal memuat portofolio:", error);
  }

  return (
    <>
      <section className={styles.portfolioHero}>
        <div className="container">
          <div className="sectionBadge">
            <Briefcase size={16} /> Portofolio
          </div>
          <h1 className={`${styles.title} animate-fade-up`}>Portofolio Kami</h1>
          <p className={`${styles.introText} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
            Lihat hasil karya terbaik kami. Bukti nyata komitmen Creafy Industries dalam menghadirkan kualitas jahitan dan sablon berstandar tinggi untuk klien kami.
          </p>
        </div>
      </section>

      <section className={styles.portfolioSection}>
        <div className="container">
          <PortfolioFilterClient portfolios={portfolios} />
        </div>
      </section>
    </>
  );
}
