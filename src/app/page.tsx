import styles from "./page.module.css";
import Link from "next/link";
import { CheckCircle, Clock, ShieldCheck, Palette, Calendar, Eye, FileText, ArrowRight } from "lucide-react";
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import ProductCatalog from "./ProductCatalog";
import { Query } from "node-appwrite";

export default async function Home() {
  let logos: any[] = [];
  let products: any[] = [];
  let articles: any[] = [];

  try {
    const { databases } = await createAdminClient();
    const resLogos = await databases.listDocuments(DATABASE_ID, 'logos');
    // Konversi ke plain object agar Next.js tidak error saat di-pass ke Client Component
    logos = JSON.parse(JSON.stringify(resLogos.documents));

    const resProducts = await databases.listDocuments(DATABASE_ID, 'products', [
      Query.orderAsc('sequence'),
      Query.limit(6)
    ]);
    products = JSON.parse(JSON.stringify(resProducts.documents));

    const resArticles = await databases.listDocuments(DATABASE_ID, 'articles', [
      Query.orderDesc('$createdAt'),
      Query.limit(4)
    ]);
    articles = JSON.parse(JSON.stringify(resArticles.documents));
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Abstract Background Elements */}
        <div className={styles.heroBackground}>
          <div className={styles.glow1}></div>
          <div className={styles.glow2}></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className={`${styles.badge} animate-fade-up`}>
            <span className={styles.badgeIcon}>#</span>
            Vendor Konveksi & Manufaktur Terbaik
          </div>

          <h1 className={`${styles.heroTitle} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
            VENDOR PILIHAN <br />
            UNTUK <span className={styles.highlight}>PRODUK IMPIAN</span>
          </h1>

          <p className={`${styles.heroSubtitle} animate-fade-up`} style={{ animationDelay: '0.2s' }}>
            Konveksi & Manufaktur Apparel B2B terpercaya. Jahitan standar garment, tepat waktu, dan material berkualitas tinggi.
          </p>

          <div className={`${styles.heroActions} animate-fade-up`} style={{ animationDelay: '0.3s' }}>
            <Link href="/products" className={styles.primaryBtn}>
              Lihat Katalog
            </Link>
            <Link href="/contact" className={styles.secondaryBtn}>
              Konsultasi Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Infinite Logo Carousel */}
      <section className={styles.logoCarouselSection}>
        <div className={styles.carouselContainer}>
          {logos.length > 0 ? (
            <>
              {/* Track 1 */}
              <div className={styles.carouselTrack}>
                {logos.map(logo => (
                  <div key={`logo-1-${logo.$id}`} className={styles.carouselLogo}>
                    <img src={logo.logoUrl} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
              {/* Track 2 (Duplicated for seamless loop) */}
              <div className={styles.carouselTrack}>
                {logos.map(logo => (
                  <div key={`logo-2-${logo.$id}`} className={styles.carouselLogo}>
                    <img src={logo.logoUrl} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
              {/* Track 3 (Extra duplicate in case logos are very few) */}
              <div className={styles.carouselTrack}>
                {logos.map(logo => (
                  <div key={`logo-3-${logo.$id}`} className={styles.carouselLogo}>
                    <img src={logo.logoUrl} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
              {/* Track 4 (Extra duplicate in case logos are very few) */}
              <div className={styles.carouselTrack}>
                {logos.map(logo => (
                  <div key={`logo-4-${logo.$id}`} className={styles.carouselLogo}>
                    <img src={logo.logoUrl} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Fallback Tracks */}
              {[1, 2, 3, 4].map((trackIndex) => (
                <div key={`track-${trackIndex}`} className={styles.carouselTrack}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <div key={`fallback-${trackIndex}-${num}`} className={styles.carouselLogo}>
                      <span style={{ opacity: 0.4, fontWeight: 'bold' }}>Logo {num}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Mengapa Memilih Kami?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ShieldCheck size={48} strokeWidth={1.5} />
              </div>
              <h3>Standar Garment</h3>
              <p>Hasil jahitan rapi dengan quality control ketat untuk memastikan setiap produk sempurna.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Clock size={48} strokeWidth={1.5} />
              </div>
              <h3>On-Time</h3>
              <p>Ketepatan waktu produksi adalah prioritas kami. Pesanan Anda selesai sesuai jadwal.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <CheckCircle size={48} strokeWidth={1.5} />
              </div>
              <h3>Material Berkualitas</h3>
              <p>Menggunakan bahan kain terbaik (Cotton Combed, Drill, dll) yang nyaman dan awet.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Palette size={48} strokeWidth={1.5} />
              </div>
              <h3>Kustomisasi Fleksibel</h3>
              <p>Bebas menentukan desain bordir komputer atau sablon (Plastisol, DTF, Rubber).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className={`${styles.section} ${styles.productsBg}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Katalog Kami</h2>

          <ProductCatalog products={products} />

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/products" className="btn btn-primary">Lihat Selengkapnya</Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ margin: 0, textAlign: 'left' }}>Artikel Terbaru</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Update informasi dan wawasan seputar industri garment.</p>
            </div>
            <Link href="/articles" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
              <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <p>Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {articles.map((article: any, index: number) => {
                let finalExcerpt = article.excerpt || '';
                if (!finalExcerpt && article.content) {
                  const textContent = article.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
                  finalExcerpt = textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
                }

                const displayDate = article.publishDate || article.$createdAt;
                const formattedDate = new Date(displayDate).toISOString().split('T')[0];

                return (
                  <Link key={article.$id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }} className="article-card-home">
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      .article-card-home:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
                      .article-card-home:hover h3 { color: var(--primary) !important; }
                    `}} />

                    <div style={{ height: '180px', position: 'relative', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {index === 0 && (
                        <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 }}>
                          Baru
                        </span>
                      )}

                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <FileText size={32} color="#cbd5e1" />
                      )}
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} color="var(--primary)" /> {formattedDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={12} /> {Math.floor(Math.random() * 50) + 10}</span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem 0', lineHeight: 1.4, transition: 'color 0.2s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.title}
                      </h3>

                      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {finalExcerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
