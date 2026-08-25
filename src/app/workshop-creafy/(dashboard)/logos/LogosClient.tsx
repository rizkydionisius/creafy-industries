"use client";

import React, { useState, useEffect } from 'react';
import { addLogo, deleteLogo, updateLogoSequence } from '@/app/actions/logos';
import { Trash2, Plus, UploadCloud, GripHorizontal } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableLogoCard({ logo, onDelete, deletingId }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: logo.$id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.1)' : 'none',
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={{ ...style, border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div 
        {...attributes} 
        {...listeners} 
        style={{ padding: '0.25rem', background: '#f5f5f5', display: 'flex', justifyContent: 'center', cursor: 'grab', borderBottom: '1px solid #eee' }}
        title="Geser untuk mengatur urutan"
      >
        <GripHorizontal size={16} color="#bbb" />
      </div>
      <div style={{ padding: '1rem', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <img src={logo.logoUrl} alt={logo.name} style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
      </div>
      <div style={{ padding: '0.75rem', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={logo.name}>
          {logo.name}
        </span>
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(logo.$id, logo.logoUrl); }}
          disabled={deletingId === logo.$id}
          style={{ background: 'transparent', border: 'none', cursor: deletingId === logo.$id ? 'wait' : 'pointer', padding: '0.25rem' }}
          title="Hapus Logo"
        >
          <Trash2 size={16} color={deletingId === logo.$id ? '#ccc' : '#ef4444'} />
        </button>
      </div>
    </div>
  );
}

export default function LogosClient({ initialLogos }: { initialLogos: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isSavingSequence, setIsSavingSequence] = useState(false);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);

  // DND State
  const [items, setItems] = useState(initialLogos);

  useEffect(() => {
    setItems(initialLogos);
  }, [initialLogos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.$id === active.id);
      const newIndex = items.findIndex((i) => i.$id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      const itemsToUpdate = newItems.map((item, index) => ({
        id: item.$id,
        sequence: index
      }));

      setIsSavingSequence(true);
      await updateLogoSequence(itemsToUpdate);
      setIsSavingSequence(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    setIsDraggingFile(false);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      const res = await addLogo(formData);
      
      if (res?.error) {
        setError(res.error);
      } else {
        (e.target as HTMLFormElement).reset();
        setPreviewUrl(null);
        setIsFormOpen(false); // Close form on success
      }
    } catch (err: any) {
      setError('Gagal mengunggah. Pastikan ukuran file tidak melebihi 10MB atau cek koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Hapus logo ini?')) return;
    setDeletingId(id);
    await deleteLogo(id, url);
    setDeletingId(null);
  };

  const openAddForm = () => {
    setIsFormOpen(true);
    setError('');
    setPreviewUrl(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!isFormOpen ? (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111', margin: '0 0 0.5rem 0' }}>
                Daftar Logo Tersimpan ({items.length})
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                {isSavingSequence ? 'Menyimpan urutan...' : 'Geser baris abu-abu di atas logo untuk mengatur urutan tampilan.'}
              </p>
            </div>
            <button 
              onClick={openAddForm}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#D32F2F', color: 'white', border: 'none', padding: '0.65rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
            >
              <Plus size={16} /> Tambah Logo Baru
            </button>
          </div>

          {items.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#888', border: '1px dashed #ddd', borderRadius: '8px' }}>
              Belum ada logo klien yang diunggah.
            </div>
          ) : (
            <DndContext 
              id="dnd-logos-context"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={items.map(p => p.$id)}
                strategy={rectSortingStrategy}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {items.map((logo) => (
                    <SortableLogoCard 
                      key={logo.$id} 
                      logo={logo} 
                      onDelete={handleDelete} 
                      deletingId={deletingId} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Plus size={18} color="#D32F2F" /> Tambah Logo Baru
            </h3>
            <button 
              onClick={() => setIsFormOpen(false)}
              style={{ background: 'transparent', border: '1px solid #ccc', color: '#555', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Batal
            </button>
          </div>

          {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              <div style={{ border: `2px dashed ${isDraggingFile ? '#D32F2F' : '#ccc'}`, padding: '2rem', borderRadius: '6px', textAlign: 'center', background: isDraggingFile ? '#fef2f2' : '#fafafa', position: 'relative', minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  onDragEnter={() => setIsDraggingFile(true)}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={() => setIsDraggingFile(false)}
                  required 
                  style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                />
                {previewUrl ? (
                   <img src={previewUrl} alt="Preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 5 }} />
                ) : (
                  <>
                    <UploadCloud size={32} color={isDraggingFile ? '#D32F2F' : '#888'} style={{ marginBottom: '1rem', transition: 'color 0.2s ease' }} />
                    <p style={{ margin: 0, fontSize: '0.95rem', color: isDraggingFile ? '#D32F2F' : '#666', fontWeight: isDraggingFile ? 600 : 400 }}>
                      {isDraggingFile ? 'Lepaskan gambar di sini...' : 'Tarik & lepas gambar ke sini atau klik untuk memilih'}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ background: loading ? '#ccc' : '#D32F2F', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              >
                {loading ? 'Mengunggah...' : 'Simpan Logo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
