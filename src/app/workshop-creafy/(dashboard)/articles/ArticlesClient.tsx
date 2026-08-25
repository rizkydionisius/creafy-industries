'use client';

import React, { useState } from 'react';
import { Trash2, Edit2, ArrowLeft, Calendar, FileText, UploadCloud, Save } from 'lucide-react';
import { addArticle, deleteArticle, editArticle } from '@/app/actions/articles';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ArticlesClient({ initialArticles }: { initialArticles: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // New Fields
  const [publishDate, setPublishDate] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const openAddForm = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setContent('');
    setPreviewUrl(null);
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setPublishDate(today);
    
    setCategory('Informasi'); // default
    setAuthor('');
    setExcerpt('');
    
    setIsFormOpen(true);
    setError('');
  };

  const openEditForm = (article: any) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setContent(article.content || '');
    setPreviewUrl(article.thumbnail || null);
    
    if (article.publishDate) {
      setPublishDate(new Date(article.publishDate).toISOString().split('T')[0]);
    } else if (article.$createdAt) {
      setPublishDate(new Date(article.$createdAt).toISOString().split('T')[0]);
    } else {
      setPublishDate('');
    }
    
    setCategory(article.category || 'Informasi');
    setAuthor(article.author || '');
    setExcerpt(article.excerpt || '');
    
    setIsFormOpen(true);
    setError('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!editingArticle) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      if (editingArticle && editingArticle.thumbnail) {
        setPreviewUrl(editingArticle.thumbnail); 
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('content', content);
    formData.set('slug', slug.toLowerCase().replace(/[^a-z0-9-]/g, ''));

    try {
      let res;
      if (editingArticle) {
        res = await editArticle(editingArticle.$id, formData, editingArticle.thumbnail);
      } else {
        res = await addArticle(formData);
      }
      
      if (res?.error) {
        setError(res.error);
      } else {
        setIsFormOpen(false);
      }
    } catch (err: any) {
      console.error("Client Error:", err);
      // Next.js server actions throw errors for Payload Too Large (e.g. pasting base64 images in text editor)
      if (err.message && err.message.includes("Payload Too Large")) {
        setError("Konten terlalu besar. Jika Anda memasukkan gambar (Copy-Paste) ke dalam isi artikel, harap hapus dan gunakan fitur insert image dari URL.");
      } else {
        setError(err.message || "Gagal menghubungi server. Pastikan koneksi stabil.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Hapus artikel ini secara permanen?')) return;
    setDeletingId(id);
    await deleteArticle(id, url);
    setDeletingId(null);
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'strike', 'underline'],
      [{ 'header': 2 }, { 'header': 3 }],
      [{ 'list': 'bullet' }, { 'list': 'ordered' }],
      [{ 'align': [] }],
      ['link', 'image']
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!isFormOpen ? (
        // Mode: List Artikel (Redesign like parokibantul.org)
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.25rem 0' }}>Kelola Artikel</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Daftar semua artikel dan berita</p>
            </div>
            <button 
              onClick={openAddForm}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#D32F2F', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(211,47,47,0.2)' }}
            >
              + Buat Artikel Baru
            </button>
          </div>
          
          <div style={{ background: 'transparent', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ borderBottom: '1px solid #e2e8f0', background: 'transparent' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem 1rem 0', color: '#475569', fontWeight: 600, fontSize: '0.85rem' }}>Judul Artikel</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 600, fontSize: '0.85rem', width: '200px' }}>Tanggal Publish</th>
                  <th style={{ padding: '1rem 0 1rem 1.5rem', color: '#475569', fontWeight: 600, fontSize: '0.85rem', width: '100px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {initialArticles.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      Belum ada artikel yang diterbitkan.
                    </td>
                  </tr>
                ) : (
                  initialArticles.map((article) => {
                    const displayDate = article.publishDate ? article.publishDate : article.$createdAt;
                    const dateFormatted = new Date(displayDate).toISOString().split('T')[0];
                    
                    return (
                      <tr key={article.$id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f1f5f9', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {article.thumbnail ? (
                                <img src={article.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <FileText size={20} color="#cbd5e1" />
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ 
                                display: 'inline-block', 
                                padding: '0.1rem 0.5rem', 
                                background: '#fef2f2', 
                                color: '#b91c1c', 
                                fontSize: '0.65rem', 
                                fontWeight: 700, 
                                borderRadius: '4px', 
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                marginBottom: '0.35rem',
                                width: 'fit-content'
                              }}>
                                {article.category || 'Berita'}
                              </span>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{article.title}</h4>
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/articles/{article.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', paddingTop: '0.5rem' }}>
                            <Calendar size={14} />
                            {dateFormatted}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'top', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                            <button 
                              onClick={() => openEditForm(article)}
                              title="Edit"
                              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(article.$id, article.thumbnail || '')}
                              disabled={deletingId === article.$id}
                              title="Hapus"
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Mode: Form Tambah/Edit Artikel (Redesign like parokibantul.org)
        <div>
          <button 
            onClick={() => setIsFormOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '0 0 1rem 0', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Kembali ke Daftar Artikel
          </button>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: '0 0 2rem 0' }}>
            {editingArticle ? 'Edit Artikel' : 'Buat Artikel Baru'}
          </h2>

          {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</div>}

          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Judul Artikel</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Masukkan judul artikel..."
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', color: '#1e293b' }} 
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Slug (URL)</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                  <span style={{ padding: '0.75rem 1rem', color: '#94a3b8', borderRight: '1px solid #e2e8f0', fontSize: '0.95rem' }}>/articles/</span>
                  <input 
                    type="text" 
                    name="slug" 
                    required 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="slug-otomatis"
                    style={{ flex: 1, padding: '0.75rem 1rem', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', color: '#1e293b' }} 
                  />
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Slug dibuat otomatis dari judul, tetapi bisa diedit manual.</p>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Tanggal Publish</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    name="publishDate"
                    required
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', appearance: 'none' }} 
                  />
                  <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Upload Gambar Cover</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', padding: 0 }}>
                  <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', cursor: 'pointer' }} 
                    />
                    <div style={{ padding: '0.75rem 1rem', width: '100%', background: 'transparent', color: previewUrl ? '#1e293b' : '#94a3b8', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {previewUrl ? '1 file terpilih' : 'Choose File No file chosen'}
                    </div>
                  </div>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Pilih gambar dari perangkat Anda (.jpg, .png, .jpeg).</p>
                {previewUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={previewUrl} alt="Preview" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Kategori</label>
                <select 
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', background: 'white' }}
                >
                  <option value="Informasi">Informasi</option>
                  <option value="Tips & Trik">Tips & Trik</option>
                  <option value="Bahan Kaos">Bahan Kaos</option>
                  <option value="Desain">Desain</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Nama Penulis</label>
                <input 
                  type="text" 
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b' }} 
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Ringkasan (Excerpt)</label>
                <textarea 
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Tulis ringkasan singkat untuk ditampilkan di kartu..."
                  rows={3}
                  style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', resize: 'vertical', fontFamily: 'inherit' }} 
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Isi Artikel</label>
                
                <style dangerouslySetInnerHTML={{__html: `
                  .quill-clean .ql-toolbar { border: 1px solid #e2e8f0; border-top-left-radius: 8px; border-top-right-radius: 8px; background: #f8fafc; padding: 0.5rem; }
                  .quill-clean .ql-container { border: 1px solid #e2e8f0; border-top: none; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; min-height: 300px; font-size: 1rem; font-family: inherit; }
                  .quill-clean .ql-editor { min-height: 300px; padding: 1.5rem; }
                `}} />

                <div className="quill-clean">
                  <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', textAlign: 'right', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: loading ? '#94a3b8' : '#D32F2F', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(211,47,47,0.25)' }}>
                  <Save size={18} />
                  {loading ? 'Menyimpan...' : 'Simpan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
