"use client";

import React, { useState } from 'react';
import { addLogo, deleteLogo } from '@/app/actions/logos';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

export default function LogosClient({ initialLogos }: { initialLogos: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await addLogo(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
      setPreviewUrl(null);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Hapus logo ini?')) return;
    setDeletingId(id);
    await deleteLogo(id, url);
    setDeletingId(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Kolom Tambah Logo */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} color="#D32F2F" /> Tambah Logo Baru
        </h3>

        {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>Nama Klien</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Contoh: PT. Maju Jaya"
              style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>File Logo (Gambar)</label>
            <div style={{ border: '1px dashed #ccc', padding: '1rem', borderRadius: '6px', textAlign: 'center', background: '#fafafa', position: 'relative', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleFileChange}
                required 
                style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
              />
              {previewUrl ? (
                 <img src={previewUrl} alt="Preview" style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 5 }} />
              ) : (
                <>
                  <UploadCloud size={24} color="#888" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Klik untuk memilih gambar</p>
                </>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#D32F2F', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '6px', 
              fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Mengunggah...' : 'Simpan Logo'}
          </button>
        </form>
      </div>

      {/* Kolom Daftar Logo */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111' }}>
          Daftar Logo Tersimpan ({initialLogos.length})
        </h3>

        {initialLogos.length === 0 ? (
          <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>Belum ada logo klien yang diunggah.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {initialLogos.map((logo) => (
              <div key={logo.$id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                  <img src={logo.logoUrl} alt={logo.name} style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '0.75rem', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={logo.name}>
                    {logo.name}
                  </span>
                  <button 
                    onClick={() => handleDelete(logo.$id, logo.logoUrl)}
                    disabled={deletingId === logo.$id}
                    style={{ background: 'transparent', border: 'none', cursor: deletingId === logo.$id ? 'wait' : 'pointer', padding: '0.25rem' }}
                    title="Hapus Logo"
                  >
                    <Trash2 size={16} color={deletingId === logo.$id ? '#ccc' : '#ef4444'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
