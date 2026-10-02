import React from 'react';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import { normalizeSizeChart } from '@/lib/normalize';
import { Ruler } from 'lucide-react';
import SizeChartGridClient from './SizeChartGridClient';

export default async function SizeChartPage() {
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
    <>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.badge}>
            <Ruler size={16} /> Panduan Ukuran
          </div>
          <h1 className={`${styles.title} animate-fade-up`}>Panduan Ukuran (Size Chart)</h1>
          <p className={`${styles.introText} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
            Pastikan pesanan garmen Anda pas dan nyaman dipakai. Berikut adalah standar ukuran yang kami gunakan di Creafy Industries untuk berbagai jenis pakaian. Toleransi ukuran jahitan berkisar antara 1-3 cm.
          </p>
        </div>
      </section>

      <section className={styles.chartSection}>
        <div className="container">
          {sizeCharts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Belum ada data panduan ukuran yang tersedia.
            </div>
          ) : (
            <SizeChartGridClient sizeCharts={sizeCharts} />
          )}
        </div>
      </section>
    </>
  );
}
