import React from 'react';
import Link from 'next/link';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import { Calendar, Eye, FileText, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Artikel & Berita | Creafy Industries',
  description: 'Baca tips seputar konveksi, bahan pakaian, dan tren fashion terbaru dari Creafy Industries.',
};

export default async function ArticlesPage() {
  let articles = [];

  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'articles', [
      Query.orderDesc('$createdAt')
    ]);
    articles = JSON.parse(JSON.stringify(res.documents));
  } catch (error) {
    console.error("Gagal mengambil data artikel:", error);
  }

  return (
    <>
      <section style={{ padding: '8rem 2rem 4rem', background: 'var(--surface)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="sectionBadge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <FileText size={16} /> Artikel & Wawasan
          </div>
          <h1 className="animate-fade-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
            Artikel & Wawasan
          </h1>
          <p className="animate-fade-up" style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', animationDelay: '0.1s', lineHeight: 1.6 }}>
            Temukan panduan memilih bahan, tips merawat pakaian, hingga informasi terkini seputar industri konveksi dan garment.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'white', flex: 1, minHeight: '50vh' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
              <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <p>Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {articles.map((article: any, index: number) => {
                // Gunakan excerpt asli jika ada, jika tidak generate dari konten
                let finalExcerpt = article.excerpt || '';
                if (!finalExcerpt && article.content) {
                  const textContent = article.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
                  finalExcerpt = textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
                }

                const displayDate = article.publishDate || article.$createdAt;
                const formattedDate = new Date(displayDate).toISOString().split('T')[0];

                return (
                  <Link key={article.$id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }} className="article-card">
                    <style dangerouslySetInnerHTML={{__html: `
                      .article-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: var(--primary); }
                      .article-card:hover h2 { color: var(--primary) !important; }
                    `}} />
                    
                    <div style={{ height: '200px', position: 'relative', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {index === 0 && (
                        <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', color: 'var(--primary)', padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', zIndex: 10 }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={14} color="var(--primary)" /> {formattedDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Eye size={14} /> {Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                      
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0', lineHeight: 1.4, transition: 'color 0.2s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.title}
                      </h2>
                      
                      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem 0', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                        {finalExcerpt}
                      </p>
                      
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto' }}>
                        Baca Selengkapnya <ArrowRight size={16} />
                      </div>
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
