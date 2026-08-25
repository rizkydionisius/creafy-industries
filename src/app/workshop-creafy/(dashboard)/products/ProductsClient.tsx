'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UploadCloud, FileText, Edit2, GripVertical } from 'lucide-react';
import { addProduct, deleteProduct, editProduct, updateProductSequence } from '@/app/actions/products';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

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

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

function SortableRow({ product, onEdit, onDelete, deletingId }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.$id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#fdfdfd' : 'white',
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
  } as React.CSSProperties;

  const descPreview = product.description ? product.description.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : 'Tanpa deskripsi';

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
      <td style={{ padding: '1rem', width: '80px' }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
        ) : (
          <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', border: '1px solid #eee' }}>
            <FileText size={20} />
          </div>
        )}
      </td>
      <td style={{ padding: '1rem', fontWeight: 600, color: '#222' }}>
        {product.name}
      </td>
      <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem', maxWidth: '300px' }}>
        <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {descPreview}
        </div>
      </td>
      <td style={{ padding: '1rem', width: '150px' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onEdit(product)}
            style={{ flex: 1, background: '#f5f5f5', border: '1px solid #ddd', color: '#555', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', fontWeight: 500, justifyContent: 'center' }}
          >
            <Edit2 size={14} /> Edit
          </button>
          <button 
            onClick={() => onDelete(product.$id, product.imageUrl || '')}
            disabled={deletingId === product.$id}
            style={{ flex: 1, background: '#fee2e2', border: 'none', color: '#D32F2F', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', fontWeight: 500, justifyContent: 'center' }}
          >
            <Trash2 size={14} /> {deletingId === product.$id ? '...' : 'Hapus'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSavingSequence, setIsSavingSequence] = useState(false);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // DND State
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

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
      const oldIndex = products.findIndex((i) => i.$id === active.id);
      const newIndex = products.findIndex((i) => i.$id === over.id);
      
      const newItems = arrayMove(products, oldIndex, newIndex);
      
      // Update UI first
      setProducts(newItems);
      
      // Save new sequence to DB asynchronously
      const itemsToUpdate = newItems.map((item, index) => ({
        id: item.$id,
        sequence: index
      }));

      saveSequence(itemsToUpdate);
    }
  };

  const saveSequence = async (items: {id: string, sequence: number}[]) => {
    setIsSavingSequence(true);
    await updateProductSequence(items);
    setIsSavingSequence(false);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPreviewUrl(null);
    setIsFormOpen(true);
    setError('');
  };

  const openEditForm = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPreviewUrl(product.imageUrl || null);
    setIsFormOpen(true);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      if (editingProduct && editingProduct.imageUrl) {
        setPreviewUrl(editingProduct.imageUrl); 
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
    formData.set('description', description);

    let res;
    if (editingProduct) {
      res = await editProduct(editingProduct.$id, formData, editingProduct.imageUrl);
    } else {
      res = await addProduct(formData);
    }
    
    if (res?.error) {
      setError(res.error);
    } else {
      setIsFormOpen(false);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Hapus produk ini dari katalog?')) return;
    setDeletingId(id);
    await deleteProduct(id, url);
    setDeletingId(null);
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'strike', 'underline'],
      [{ 'header': 2 }, { 'header': 3 }],
      [{ 'list': 'bullet' }, { 'list': 'ordered' }],
      [{ 'align': [] }],
      ['image']
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!isFormOpen ? (
        // Mode: List Produk
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111', margin: '0 0 0.5rem 0' }}>
                Daftar Produk ({products.length})
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                {isSavingSequence ? 'Menyimpan urutan...' : 'Geser ikon (↕) untuk mengubah urutan tampilan.'}
              </p>
            </div>
            <button 
              onClick={openAddForm}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#D32F2F', color: 'white', border: 'none', padding: '0.65rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
            >
              <Plus size={16} /> Tambah Produk
            </button>
          </div>
          
          {products.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#888', border: '1px dashed #ddd', borderRadius: '8px' }}>
              Belum ada produk di dalam katalog.
            </div>
          ) : (
            <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
              <DndContext 
                id="dnd-products-context"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                    <tr>
                      <th style={{ padding: '1rem', width: '50px', textAlign: 'center' }}></th>
                      <th style={{ padding: '1rem', width: '80px' }}>Foto</th>
                      <th style={{ padding: '1rem', color: '#444', fontWeight: 600 }}>Nama Produk</th>
                      <th style={{ padding: '1rem', color: '#444', fontWeight: 600 }}>Spesifikasi Singkat</th>
                      <th style={{ padding: '1rem', color: '#444', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext 
                      items={products.map(p => p.$id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {products.map(product => (
                        <SortableRow 
                          key={product.$id} 
                          product={product} 
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
        // Mode: Form Tambah/Edit Produk
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              {editingProduct ? <Edit2 size={18} color="#D32F2F" /> : <Plus size={18} color="#D32F2F" />} 
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            <button 
              onClick={() => setIsFormOpen(false)}
              style={{ background: 'transparent', border: '1px solid #ccc', color: '#555', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Batal
            </button>
          </div>

          {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>Nama Produk</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Kaos Polos"
                style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' }} 
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>Harga & Spesifikasi Lengkap</label>
              
              <style dangerouslySetInnerHTML={{__html: `
                .quill-custom .ql-toolbar { border-top-left-radius: 6px; border-top-right-radius: 6px; background: #f9fafb; }
                .quill-custom .ql-container { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; min-height: 250px; font-size: 0.95rem; font-family: inherit; }
                .quill-custom .ql-editor { min-height: 250px; }
              `}} />

              <div className="quill-custom">
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} placeholder="Tuliskan daftar harga, bahan, dll di sini..." />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>Foto Produk (Opsional)</label>
              <div style={{ border: '1px dashed #ccc', padding: '2rem', borderRadius: '6px', textAlign: 'center', background: '#fafafa', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
                {previewUrl ? (
                   <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 5 }} />
                ) : (
                  <>
                    <UploadCloud size={32} color="#888" style={{ marginBottom: '1rem' }} />
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>Tarik & Lepas gambar ke sini atau klik untuk memilih</p>
                    {editingProduct?.imageUrl && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>*Akan mengganti gambar yang lama</p>}
                  </>
                )}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
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
