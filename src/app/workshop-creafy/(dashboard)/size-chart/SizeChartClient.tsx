'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UploadCloud, FileText, Edit2, GripVertical } from 'lucide-react';
import { addSizeChart, deleteSizeChart, editSizeChart, updateSizeChartSequence } from '@/app/actions/sizecharts';

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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ item, onEdit, onDelete, deletingId }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.$id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#fdfdfd' : 'white',
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
  } as React.CSSProperties;

  return (
    <tr ref={setNodeRef} style={{ ...style, borderBottom: '1px solid #eaeaea' }}>
      <td style={{ padding: '1rem', width: '50px', textAlign: 'center' }}>
        <button 
          {...attributes} 
          {...listeners} 
          style={{ background: 'transparent', border: 'none', cursor: 'grab', color: '#888', padding: '0.5rem' }}
          title="Geser untuk mengatur urutan"
        >
          <GripVertical size={20} />
        </button>
      </td>
      <td style={{ padding: '1rem', width: '120px' }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #eee' }} />
        ) : (
          <div style={{ width: '100px', height: '100px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', border: '1px solid #eee' }}>
            <FileText size={24} />
          </div>
        )}
      </td>
      <td style={{ padding: '1rem', fontWeight: 600, color: '#222' }}>
        {item.title}
      </td>
      <td style={{ padding: '1rem', width: '150px' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onEdit(item)}
            style={{ flex: 1, background: '#f5f5f5', border: '1px solid #ddd', color: '#555', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', fontWeight: 500, justifyContent: 'center' }}
          >
            <Edit2 size={14} /> Edit
          </button>
          <button 
            onClick={() => onDelete(item.$id, item.imageUrl || '')}
            disabled={deletingId === item.$id}
            style={{ flex: 1, background: '#fee2e2', border: 'none', color: '#D32F2F', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', fontWeight: 500, justifyContent: 'center' }}
          >
            <Trash2 size={14} /> {deletingId === item.$id ? '...' : 'Hapus'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function SizeChartClient({ initialItems }: { initialItems: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSavingSequence, setIsSavingSequence] = useState(false);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // DND State
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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

      saveSequence(itemsToUpdate);
    }
  };

  const saveSequence = async (items: {id: string, sequence: number}[]) => {
    setIsSavingSequence(true);
    await updateSizeChartSequence(items);
    setIsSavingSequence(false);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setTitle('');
    setPreviewUrl(null);
    setIsFormOpen(true);
    setError('');
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    setTitle(item.title);
    setPreviewUrl(item.imageUrl || null);
    setIsFormOpen(true);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      if (editingItem && editingItem.imageUrl) {
        setPreviewUrl(editingItem.imageUrl); 
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

    let res;
    if (editingItem) {
      res = await editSizeChart(editingItem.$id, formData, editingItem.imageUrl);
    } else {
      res = await addSizeChart(formData);
    }
    
    if (res?.error) {
      setError(res.error);
    } else {
      setIsFormOpen(false);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Hapus panduan ukuran ini?')) return;
    setDeletingId(id);
    await deleteSizeChart(id, url);
    setDeletingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!isFormOpen ? (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111', margin: '0 0 0.5rem 0' }}>
                Daftar Panduan Ukuran ({items.length})
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                {isSavingSequence ? 'Menyimpan urutan...' : 'Geser ikon (↕) untuk mengubah urutan tampilan.'}
              </p>
            </div>
            <button 
              onClick={openAddForm}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#D32F2F', color: 'white', border: 'none', padding: '0.65rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
            >
              <Plus size={16} /> Tambah Size Chart
            </button>
          </div>
          
          {items.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#888', border: '1px dashed #ddd', borderRadius: '8px' }}>
              Belum ada panduan ukuran.
            </div>
          ) : (
            <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
              <DndContext 
                id="dnd-sizechart-context"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                    <tr>
                      <th style={{ padding: '1rem', width: '50px', textAlign: 'center' }}></th>
                      <th style={{ padding: '1rem', width: '120px' }}>Foto</th>
                      <th style={{ padding: '1rem', color: '#444', fontWeight: 600 }}>Judul Kategori / Pakaian</th>
                      <th style={{ padding: '1rem', color: '#444', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext 
                      items={items.map(p => p.$id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items.map(item => (
                        <SortableRow 
                          key={item.$id} 
                          item={item} 
                          onEdit={openEditForm} 
                          onDelete={handleDelete}
                          deletingId={deletingId}
                        />
                      ))}
                    </SortableContext>
                  </tbody>
                </table>
              </DndContext>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              {editingItem ? <Edit2 size={18} color="#D32F2F" /> : <Plus size={18} color="#D32F2F" />} 
              {editingItem ? 'Edit Size Chart' : 'Tambah Size Chart Baru'}
            </h3>
            <button 
              onClick={() => setIsFormOpen(false)}
              style={{ background: 'transparent', border: '1px solid #ccc', color: '#555', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Batal
            </button>
          </div>

          {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>Judul Panduan Ukuran</label>
              <input 
                type="text" 
                name="title" 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Size Chart Kaos Oblong"
                style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>Gambar Panduan</label>
              <div style={{ border: '1px dashed #ccc', padding: '2rem', borderRadius: '6px', textAlign: 'center', background: '#fafafa', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} required={!editingItem} style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
                {previewUrl ? (
                   <img src={previewUrl} alt="Preview" style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 5 }} />
                ) : (
                  <>
                    <UploadCloud size={32} color="#888" style={{ marginBottom: '1rem' }} />
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>Tarik & Lepas gambar tabel ukuran ke sini atau klik untuk memilih</p>
                    {editingItem?.imageUrl && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>*Akan mengganti gambar yang lama</p>}
                  </>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button type="submit" disabled={loading} style={{ background: loading ? '#ccc' : '#D32F2F', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
