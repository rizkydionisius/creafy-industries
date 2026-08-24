"use client";

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Reveal from "@/components/Reveal/Reveal";
import { Target, Eye, Scissors, Layers, CheckCircle2, Factory, Info } from 'lucide-react';

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className="container">
          <Reveal once>
            <div className="sectionBadge">
              <Info size={16} /> Tentang Kami
            </div>
          </Reveal>
          <Reveal once direction="up">
            <h1 className={`${styles.title} animate-fade-up`}>Di Balik Creafy Industries</h1>
          </Reveal>
          <Reveal once direction="up" delay={0.1}>
            <p className={`${styles.introText} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
              Lebih dari sekadar vendor konveksi. Kami adalah mitra strategis yang berdedikasi penuh untuk mengangkat nilai brand Anda melalui apparel dan merchandise berkualitas premium.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className={styles.visionSection}>
        <div className={`container ${styles.visionGrid}`}>
          <Reveal once direction="up" delay={0.2}>
            <div className={`${styles.visionCard} animate-fade-up`} style={{ animationDelay: '0.2s' }}>
              <div className={styles.iconWrapper}>
                <Eye size={32} />
              </div>
              <h2>Visi Kami</h2>
              <p>
                Menjadi manufaktur apparel custom dan merchandise terdepan di tingkat nasional yang selalu menetapkan standar tertinggi dalam kualitas jahitan, cetak, dan ketepatan waktu.
              </p>
            </div>
          </Reveal>
          
          <Reveal once direction="up" delay={0.3}>
            <div className={`${styles.visionCard} animate-fade-up`} style={{ animationDelay: '0.3s' }}>
              <div className={styles.iconWrapper}>
                <Target size={32} />
              </div>
              <h2>Misi Kami</h2>
              <p>
                Memadukan teknologi mesin modern dengan keahlian pengrajin lokal untuk menghasilkan produk yang tidak hanya awet, tetapi juga merepresentasikan kebanggaan setiap komunitas dan perusahaan klien kami.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tahapan Produksi (Behind the Scenes) */}
      <section className={styles.processSection}>
        <div className="container">
          <Reveal once direction="up" delay={0.5}>
            <h2 className={`${styles.sectionTitle} animate-fade-up`} style={{ animationDelay: '0.5s' }}>
              Standar Kerja Kami
            </h2>
            <p className={`${styles.sectionSubtitle} animate-fade-up`} style={{ animationDelay: '0.5s' }}>
              Setiap produk melewati 4 tahapan krusial untuk memastikan hasil akhir yang sempurna.
            </p>
          </Reveal>

          <div className={styles.processGrid}>
            <Reveal once direction="up" delay={100}>
              <div className={styles.processCard}>
                <div className={styles.processIcon}><Layers size={28} /></div>
                <h3>1. Pemilihan Material</h3>
                <p>Hanya menggunakan kain dan benang grade A yang disesuaikan dengan kebutuhan dan budget klien.</p>
              </div>
            </Reveal>
            
            <Reveal once direction="up" delay={200}>
              <div className={styles.processCard}>
                <div className={styles.processIcon}><Scissors size={28} /></div>
                <h3>2. Pemotongan Presisi</h3>
                <p>Pola dipotong menggunakan mesin berteknologi tinggi untuk akurasi ukuran (size chart) yang konsisten.</p>
              </div>
            </Reveal>

            <Reveal once direction="up" delay={300}>
              <div className={styles.processCard}>
                <div className={styles.processIcon}><Factory size={28} /></div>
                <h3>3. Produksi Jahit & Cetak</h3>
                <p>Dikerjakan oleh penjahit berpengalaman dengan standar jahitan rantai/dobel, serta aplikasi sablon/bordir komputer presisi.</p>
              </div>
            </Reveal>

            <Reveal once direction="up" delay={400}>
              <div className={styles.processCard}>
                <div className={styles.processIcon}><CheckCircle2 size={28} /></div>
                <h3>4. Quality Control (QC)</h3>
                <p>Pemeriksaan ketat 2 lapis sebelum pengemasan untuk memastikan nihil cacat (zero defect).</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
