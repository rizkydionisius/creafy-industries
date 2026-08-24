"use server";

import { ID } from 'node-appwrite';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { revalidatePath } from 'next/cache';

export async function addLogo(formData: FormData) {
  const name = formData.get('name') as string;
  const image = formData.get('image') as File;

  if (!name || !image || image.size === 0) {
    return { error: 'Nama dan gambar wajib diisi' };
  }

  try {
    const { databases, storage } = await createAdminClient();

    // 1. Upload image to Storage
    // `node-appwrite` can accept standard File objects from Next.js Server Actions
    const file = await storage.createFile('images', ID.unique(), image);
    
    // 2. Build the File View URL
    const fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/${file.$id}/view?project=6a8c438600024a08a21e`;

    // 3. Save to database
    await databases.createDocument(DATABASE_ID, 'logos', ID.unique(), {
      name,
      logoUrl: fileUrl,
    });

    revalidatePath('/admin/logos');
    revalidatePath('/'); // update public homepage carousel
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Gagal menambahkan logo' };
  }
}

export async function deleteLogo(documentId: string, fileUrl: string) {
  try {
    const { databases, storage } = await createAdminClient();
    
    // Extract file ID from the URL we generated earlier
    const fileIdMatch = fileUrl.match(/\/files\/([^/]+)\/view/);
    if (fileIdMatch && fileIdMatch[1]) {
      try {
        await storage.deleteFile('images', fileIdMatch[1]);
      } catch (e) {
        console.error('Failed to delete file from storage:', e);
      }
    }

    await databases.deleteDocument(DATABASE_ID, 'logos', documentId);
    
    revalidatePath('/admin/logos');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Gagal menghapus logo' };
  }
}
