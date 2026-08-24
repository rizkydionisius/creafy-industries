"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function PortfolioFilterClient({ portfolios }: { portfolios: any[] }) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  // Generate unique categories dynamically from the data
  const uniqueCategories = Array.from(new Set(portfolios.map(p => p.category).filter(Boolean)));
  const categories = ["Semua", ...uniqueCategories];

  const filteredData = activeFilter === "Semua" 
    ? portfolios 
    : portfolios.filter(item => item.category === activeFilter);

  return (
    <>
      {/* Filters */}
      <div className={`${styles.filterContainer} animate-fade-up`} style={{ animationDelay: '0.2s' }}>
        {categories.map(cat => (
          <button 
            key={cat as string}
            className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
            onClick={() => setActiveFilter(cat as string)}
          >
            {cat as string}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.portfolioGrid}>
        {filteredData.map((item, index) => (
          <div 
            key={item.$id} 
            className={`${styles.portfolioItem} animate-fade-up`}
            style={{ animationDelay: `${0.1 * ((index % 4) + 1)}s` }}
          >
            <div className={styles.itemImage}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#888' }}>
                  No Image
                </div>
              )}
            </div>
            <div className={styles.itemOverlay}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <span className={styles.itemCategory}>{item.category}</span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredData.length === 0 && (
        <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0'}}>
          Belum ada portofolio untuk kategori ini.
        </div>
      )}
    </>
  );
}
