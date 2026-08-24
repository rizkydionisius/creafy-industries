import React from 'react';
import styles from './FloatingWhatsApp.module.css';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const phoneNumber = "628973706000";
  const message = "Halo Creafy Industries, saya ingin berkonsultasi mengenai pembuatan produk.";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.floatingBtn} aria-label="Chat via WhatsApp">
      <MessageCircle size={28} className={styles.icon} />
    </a>
  );
}
