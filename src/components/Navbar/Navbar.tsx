"use client";

import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Tentang Kami', path: '/about' },
  { name: 'Katalog', path: '/products' },
  { name: 'Portofolio', path: '/portfolio' },
  { name: 'Panduan Ukuran', path: '/size-chart' },
  { name: 'Artikel', path: '/articles' },
  { name: 'Kontak', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="/images/logo-no-bg.png" alt="Creafy Industries" className={styles.logoImage} />
        </Link>
        <div className={styles.navRight}>
          <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
            {NAV_LINKS.map(link => (
              <Link 
                key={link.path} 
                href={link.path}
                className={pathname === link.path ? styles.active : ''}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <a href="https://wa.me/628973706000" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            <Phone size={18} />
            <span>Hubungi Kami</span>
          </a>

          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
}
