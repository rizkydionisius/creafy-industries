'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './page.module.css';
import { X } from 'lucide-react';

export default function ProductCatalog({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <>
      <div className={styles.productsGrid}>
        {products.map((prod) => (
          <div className={styles.productCard} key={prod.$id}>
            <div 
              className={styles.productBg} 
              style={{ backgroundImage: `url(${prod.imageUrl || ''})` }}
            ></div>
            <div className={styles.productOverlay}></div>
            <div className={styles.productContent}>
              <h3>{prod.name}</h3>
              <button 
                className={styles.detailPillBtn}
                onClick={() => setSelectedProduct(prod)}
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && typeof document !== 'undefined' && createPortal(
        <div className={styles.modalBackdrop} onClick={() => setSelectedProduct(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedProduct(null)}>
              <X size={24} color="#333" />
            </button>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalImageWrapper}>
                {selectedProduct.imageUrl ? (
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className={styles.modalImage} />
                ) : (
                  <div className={styles.modalImagePlaceholder}>[FOTO {selectedProduct.name}]</div>
                )}
              </div>
              <div className={styles.modalDetails}>
                <h2 className={styles.modalTitle}>{selectedProduct.name.toUpperCase()}</h2>
                
                {/* Render HTML content from Quill */}
                <div 
                  className={styles.richTextContent}
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }} 
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
