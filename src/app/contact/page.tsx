"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waNumber = "628973706000";
    const text = `Halo Creafy Industries!%0A%0APerkenalkan saya *${formData.name}* (${formData.email}).%0A%0A${formData.message}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      <section className={styles.contactHero}>
        <div className="container">
          <div className="sectionBadge">
            <MessageSquare size={16} /> Hubungi Kami
          </div>
          <h1 className={`${styles.title} animate-fade-up`}>Hubungi Kami</h1>
          <p className={`${styles.introText} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
            Punya pertanyaan atau siap memulai proyek apparel custom Anda? Jangan ragu untuk menghubungi kami melalui form atau kontak di bawah ini.
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={`container ${styles.contactGrid}`}>
          
          {/* Contact Information */}
          <div className={`${styles.infoColumn} animate-fade-up`} style={{ animationDelay: '0.2s' }}>
            
            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <MapPin size={24} />
              </div>
              <div className={styles.infoDetails}>
                <h3>Lokasi Workshop</h3>
                <a 
                  href="https://maps.app.goo.gl/31XakLeAZ3p7ooQt5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  4835+V4, Kadisoro, Gilangharjo, Pandak, Bantul Regency, Special Region of Yogyakarta 55761
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Phone size={24} />
              </div>
              <div className={styles.infoDetails}>
                <h3>WhatsApp / Telepon</h3>
                <a href="https://wa.me/628973706000" target="_blank" rel="noopener noreferrer">
                  0897-3706-000
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Mail size={24} />
              </div>
              <div className={styles.infoDetails}>
                <h3>Email</h3>
                <a href="mailto:creafyIndustries@gmail.com">
                  creafyIndustries@gmail.com
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Clock size={24} />
              </div>
              <div className={styles.infoDetails}>
                <h3>Jam Operasional</h3>
                <p>Senin - Sabtu <br/> 08:00 - 17:00 WIB</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className={`${styles.formColumn} animate-fade-up`} style={{ animationDelay: '0.3s' }}>
            <h2>Kirim Pesan</h2>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  placeholder="Masukkan nama Anda" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email / WhatsApp</label>
                <input 
                  type="text" 
                  id="email" 
                  required 
                  placeholder="Masukkan email atau no WA Anda" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Detail Kebutuhan (Pesan)</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  required 
                  placeholder="Ceritakan detail pesanan, jumlah, atau pertanyaan Anda di sini..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                Kirim Pesan via WhatsApp
              </button>
            </form>
          </div>

        </div>

        {/* Map Section */}
        <div className={`container animate-fade-up`} style={{ animationDelay: '0.4s' }}>
          <div className={styles.mapSection}>
            {/* Embed Google Maps */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15807.039014169603!2d110.31011831738283!3d-7.9197941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7b003a270fc6cf%3A0xbcf2392dfbe62bd0!2sKadisoro%2C%20Gilangharjo%2C%20Pandak%2C%20Bantul%20Regency%2C%20Special%20Region%20of%20Yogyakarta!5e0!3m2!1sen!2sid!4v1716300000000!5m2!1sen!2sid" 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Creafy Industries"
            ></iframe>
          </div>
        </div>

      </section>
    </>
  );
}
