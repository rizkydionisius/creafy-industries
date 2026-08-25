"use server";

import { ID, Query } from 'node-appwrite';
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

    const file = await storage.createFile('images', ID.unique(), image);
    const fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/${file.$id}/view?project=6a8c438600024a08a21e`;

    let newSequence = 0;
    try {
      const lastDoc = await databases.listDocuments(DATABASE_ID, 'logos', [
        Query.orderDesc('sequence'),
        Query.limit(1)
      ]);
      if (lastDoc.documents.length > 0) {
        newSequence = (lastDoc.documents[0].sequence || 0) + 1;
      }
    } catch (e) {
      console.log("Could not fetch last sequence", e);
    }

    await databases.createDocument(DATABASE_ID, 'logos', ID.unique(), {
      name,
      logoUrl: fileUrl,
      sequence: newSequence
    });

    revalidatePath('/workshop-creafy/logos');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Gagal menambahkan logo' };
  }
}

export async function deleteLogo(documentId: string, fileUrl: string) {
  try {
    const { databases, storage } = await createAdminClient();
    
    const fileIdMatch = fileUrl.match(/\/files\/([^/]+)\/view/);
    if (fileIdMatch && fileIdMatch[1]) {
      try {
        await storage.deleteFile('images', fileIdMatch[1]);
      } catch (e) {
        console.error('Failed to delete file from storage:', e);
      }
    }

    await databases.deleteDocument(DATABASE_ID, 'logos', documentId);
    
    revalidatePath('/workshop-creafy/logos');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Gagal menghapus logo' };
  }
}

export async function updateLogoSequence(items: { id: string; sequence: number }[]) {
  try {
    const { databases } = await createAdminClient();

    await Promise.all(
      items.map(item => 
        databases.updateDocument(DATABASE_ID, 'logos', item.id, {
          sequence: item.sequence
        })
      )
    );

    revalidatePath('/workshop-creafy/logos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Update Sequence Error:", error);
    return { error: error.message || 'Gagal menyimpan urutan' };
  }
}
