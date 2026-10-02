import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * Upload file ke Vercel Blob dan kembalikan URL-nya
 */
export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${uuidv4()}${ext}`;
  
  const blob = await put(`uploads/${filename}`, buffer, {
    access: 'public',
    contentType: file.type || 'image/jpeg',
  });
  
  return blob.url;
}

/**
 * Hapus file dari Vercel Blob berdasarkan URL
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    if (!url) return false;
    
    // Hanya hapus jika URL mengarah ke Vercel Blob
    if (url.includes('public.blob.vercel-storage.com')) {
      await del(url);
    }
    return true;
  } catch (error) {
    console.error("Failed to delete file from Vercel Blob:", error);
    return false;
  }
}
