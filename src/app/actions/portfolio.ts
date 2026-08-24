'use server';

import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

const COLLECTION_ID = 'portfolio';
const STORAGE_BUCKET_ID = 'images'; // Same as products/articles

export async function addPortfolio(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !category) {
      return { error: 'Judul dan kategori wajib diisi.' };
    }

    const { databases, storage } = await createAdminClient();
    let imageUrl = '';

    if (imageFile && imageFile.size > 0) {
      const uploadRes = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), imageFile);
      imageUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadRes.$id}/view?project=6a8c438600024a08a21e`;
    }

    const res = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      title,
      category,
      imageUrl,
      sequence: 0,
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    return { success: true, id: res.$id };
  } catch (error: any) {
    console.error("Gagal menambah portofolio:", error);
    return { error: error.message || 'Terjadi kesalahan saat menyimpan.' };
  }
}

export async function editPortfolio(id: string, formData: FormData, oldImageUrl: string | null) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !category) {
      return { error: 'Judul dan kategori wajib diisi.' };
    }

    const { databases, storage } = await createAdminClient();
    let imageUrl = oldImageUrl;

    if (imageFile && imageFile.size > 0) {
      const uploadRes = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), imageFile);
      imageUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadRes.$id}/view?project=6a8c438600024a08a21e`;

      if (oldImageUrl) {
        try {
          const urlObj = new URL(oldImageUrl);
          const parts = urlObj.pathname.split('/');
          const fileId = parts[parts.indexOf('files') + 1];
          if (fileId) {
            await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
          }
        } catch (e) {
          console.error("Gagal menghapus foto lama:", e);
        }
      }
    }

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
      title,
      category,
      imageUrl,
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error: any) {
    console.error("Gagal mengedit portofolio:", error);
    return { error: error.message || 'Terjadi kesalahan saat menyimpan.' };
  }
}

export async function deletePortfolio(id: string, imageUrl: string) {
  try {
    const { databases, storage } = await createAdminClient();
    
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    
    if (imageUrl) {
      try {
        const urlObj = new URL(imageUrl);
        const parts = urlObj.pathname.split('/');
        const fileId = parts[parts.indexOf('files') + 1];
        if (fileId) {
          await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
        }
      } catch (e) {
        console.error("Gagal menghapus foto:", e);
      }
    }

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error: any) {
    console.error("Gagal menghapus portofolio:", error);
    return { error: error.message || 'Terjadi kesalahan saat menghapus.' };
  }
}

export async function updatePortfolioSequence(items: {id: string, sequence: number}[]) {
  try {
    const { databases } = await createAdminClient();
    
    await Promise.all(
      items.map(item => 
        databases.updateDocument(DATABASE_ID, COLLECTION_ID, item.id, {
          sequence: item.sequence
        })
      )
    );

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error: any) {
    console.error("Gagal mengupdate urutan:", error);
    return { error: error.message || 'Gagal menyimpan urutan baru.' };
  }
}
