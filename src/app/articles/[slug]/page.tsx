import React from 'react';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { User, Calendar, Clock, Eye } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css'; // Memastikan style dasar quill termuat

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'articles', [
      Query.equal('slug', resolvedParams.slug),
      Query.limit(1)
    ]);
    
    if (res.documents.length > 0) {
      const article = res.documents[0];
      const textContent = article.content ? article.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '';
      const excerpt = article.excerpt || (textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent);
      
      return {
        title: `${article.title} | Creafy Industries`,
        description: excerpt,
      };
    }
  } catch (error) {
    return { title: 'Artikel | Creafy Industries' };
  }
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  let article = null;
  const resolvedParams = await params;

  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'articles', [
      Query.equal('slug', resolvedParams.slug),
      Query.limit(1)
    ]);
    
    if (res.documents.length > 0) {
      article = JSON.parse(JSON.stringify(res.documents[0]));
    }
  } catch (error) {
    console.error("Gagal mengambil detail artikel:", error);
  }

  if (!article) {
    notFound();
  }

  // Helper values
  const displayDate = article.publishDate || article.$createdAt;
  const formattedDate = new Date(displayDate).toISOString().split('T')[0];
  const readTime = Math.max(1, Math.ceil((article.content?.length || 0) / 1000));
  const viewsCount = Math.floor(Math.random() * 50) + 10;

  return (
    <article style={{ background: '#fff', minHeight: '100vh', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '850px', paddingTop: '10rem' }}>
        
        {/* Header Artikel */}
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.3 }}>
            {article.title}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '20px', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
              <User size={14} /> {article.author || 'Tim Creafy'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fff1f2', color: 'var(--primary)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
              <Calendar size={14} /> {formattedDate}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '20px', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
              <Clock size={14} /> {readTime} min read
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '20px', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
              <Eye size={14} /> {viewsCount} Views
            </div>
          </div>
        </header>

        {/* Thumbnail Besar */}
        {article.thumbnail && (
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <img src={article.thumbnail} alt={article.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        
        {/* Konten Artikel (Render HTML dari Quill) */}
        <div 
          className="ql-editor article-content" 
          style={{ padding: 0, overflowY: 'visible', fontSize: '1.1rem', color: '#334155', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* Overrides tambahan untuk konten artikel agar bersih persis referensi */
        .article-content h2 { font-size: 1.75rem; margin-top: 2.5rem; margin-bottom: 1rem; color: #0f172a; font-weight: 700; }
        .article-content h3 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #1e293b; font-weight: 700; }
        .article-content p { margin-bottom: 1.5rem; }
        .article-content img { max-width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .article-content a { color: var(--primary); text-decoration: none; border-bottom: 1px solid var(--primary); padding-bottom: 1px; }
        .article-content a:hover { color: var(--primary-hover); border-color: var(--primary-hover); }
        .article-content ul, .article-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .article-content li { margin-bottom: 0.5rem; }
      `}} />
    </article>
  );
}
