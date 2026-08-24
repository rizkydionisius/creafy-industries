'use server'

import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

const COLLECTION_ID = 'size_charts';
const STORAGE_BUCKET_ID = 'images'; // User uses 'images' bucket

export async function addSizeChart(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const image = formData.get('image') as File;

    if (!title) {
      return { error: 'Judul wajib diisi' };
    }

    if (!image || image.size === 0) {
      return { error: 'Gambar panduan ukuran wajib diunggah' };
    }

    const { databases, storage } = await createAdminClient();

    const uploadRes = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), image);
    const imageUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadRes.$id}/view?project=6a8c438600024a08a21e`;

    // Ambil item terakhir untuk mendapatkan urutan terakhir
    let newSequence = 0;
    try {
      const lastItem = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('sequence'),
        Query.limit(1)
      ]);
      if (lastItem.documents.length > 0) {
        newSequence = (lastItem.documents[0].sequence || 0) + 1;
      }
    } catch (e) {
      console.log("Could not fetch last sequence", e);
    }

    await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      title,
      imageUrl,
      sequence: newSequence
    });

    revalidatePath('/admin/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Add Size Chart Error:", error);
    return { error: error.message || 'Gagal menambahkan panduan ukuran' };
  }
}

export async function deleteSizeChart(id: string, fileUrl: string) {
  try {
    const { databases, storage } = await createAdminClient();

    if (fileUrl) {
      const fileIdMatch = fileUrl.match(/files\/([^/]+)\/view/);
      if (fileIdMatch && fileIdMatch[1]) {
        try {
          await storage.deleteFile(STORAGE_BUCKET_ID, fileIdMatch[1]);
        } catch (e) {
          console.error("Gagal menghapus file lama:", e);
        }
      }
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);

    revalidatePath('/admin/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Size Chart Error:", error);
    return { error: error.message || 'Gagal menghapus panduan ukuran' };
  }
}

export async function editSizeChart(id: string, formData: FormData, oldFileUrl?: string) {
  try {
    const title = formData.get('title') as string;
    const image = formData.get('image') as File;

    if (!title) {
      return { error: 'Judul wajib diisi' };
    }

    const { databases, storage } = await createAdminClient();

    let fileUrl = oldFileUrl || '';
    
    // Jika ada gambar baru yang diunggah
    if (image && image.size > 0) {
      const uploadRes = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), image);
      fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadRes.$id}/view?project=6a8c438600024a08a21e`;
      
      // Hapus gambar lama jika ada
      if (oldFileUrl) {
        const fileIdMatch = oldFileUrl.match(/files\/([^/]+)\/view/);
        if (fileIdMatch && fileIdMatch[1]) {
          try {
            await storage.deleteFile(STORAGE_BUCKET_ID, fileIdMatch[1]);
          } catch (e) {
            console.error("Gagal menghapus file lama saat update:", e);
          }
        }
      }
    }

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
      title,
      imageUrl: fileUrl,
    });

    revalidatePath('/admin/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Edit Size Chart Error:", error);
    return { error: error.message || 'Gagal mengubah panduan ukuran' };
  }
}

export async function updateSizeChartSequence(items: { id: string; sequence: number }[]) {
  try {
    const { databases } = await createAdminClient();

    await Promise.all(
      items.map(item => 
        databases.updateDocument(DATABASE_ID, COLLECTION_ID, item.id, {
          sequence: item.sequence
        })
      )
    );

    revalidatePath('/admin/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Update Sequence Error:", error);
    return { error: error.message || 'Gagal menyimpan urutan' };
  }
}
