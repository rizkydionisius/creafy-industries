'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Eye, Share2, X } from 'lucide-react';

export default function SizeChartGridClient({ sizeCharts }: { sizeCharts: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleShare = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Size Chart: ${title}`,
          text: `Lihat Size Chart ${title} dari Creafy Industries`,
          url: url, // Maybe share the current page URL with a hash or just the image URL
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Tautan gambar telah disalin ke clipboard!');
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <>
      <div className={styles.chartGrid}>
        {sizeCharts.map((item: any, index: number) => (
          <div 
            key={item.$id} 
            className={`${styles.chartCard} animate-fade-up`}
            style={{ animationDelay: `${0.1 * ((index % 4) + 1)}s` }}
          >
            <h3 className={styles.chartTitle}>{item.title}</h3>
            <div className={styles.imageWrapper}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className={styles.chartImage} />
              ) : (
                <div className={styles.placeholderImage}>No Image</div>
              )}
            </div>
            
            {/* Action Buttons */}
            {item.imageUrl && (
              <div className={styles.actionButtons}>
                <button 
                  className={styles.actionBtn} 
                  onClick={() => setSelectedImage(item.imageUrl)}
                >
                  <Eye size={18} /> Lihat Detail
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.shareBtn}`} 
                  onClick={() => handleShare(item.title, item.imageUrl)}
                >
                  <Share2 size={18} /> Bagikan
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Size Chart Fullscreen" className={styles.fullscreenImage} />
          </div>
        </div>
      )}
    </>
  );
}
