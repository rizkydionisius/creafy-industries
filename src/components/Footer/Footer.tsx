import React from 'react';
import styles from './Footer.module.css';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        
        {/* Brand Column */}
        <div className={styles.footerBrand}>
          <img src="/images/logo-no-bg.png" alt="Creafy Industries" className={styles.logoImage} />
          <p className={styles.tagline}>Vendor Pilihan untuk Produk Impian</p>
        </div>
        
        {/* Operational Hours */}
        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>Jam Operasional</h4>
          <ul className={styles.contactList}>
            <li>
              <Clock size={18} className={styles.icon} />
              <span>Senin - Sabtu <br/> 08.00 - 17.00 WIB</span>
            </li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>Kontak Kami</h4>
          <ul className={styles.contactList}>
            <li>
              <Phone size={18} className={styles.icon} />
              <a href="https://wa.me/628973706000" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                0897-3706-000
              </a>
            </li>
            <li>
              <Mail size={18} className={styles.icon} />
              <a href="mailto:creafyIndustries@gmail.com" className={styles.footerLink}>
                creafyIndustries@gmail.com
              </a>
            </li>
            <li>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={styles.icon}
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <a href="https://instagram.com/creafy.industries" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                @creafy.industries
              </a>
            </li>
          </ul>
        </div>

        {/* Location */}
        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>Lokasi</h4>
          <ul className={styles.contactList}>
            <li>
              <MapPin size={18} className={styles.icon} />
              <a 
                href="https://maps.app.goo.gl/31XakLeAZ3p7ooQt5" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                4835+V4, Kadisoro, Gilangharjo, Pandak, Bantul Regency, Special Region of Yogyakarta 55761
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Creafy Industries. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
