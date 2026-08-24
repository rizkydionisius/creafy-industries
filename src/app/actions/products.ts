'use server'

import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    if (!name || !description) {
      return { error: 'Nama dan deskripsi wajib diisi' };
    }

    const { databases, storage } = await createAdminClient();

    let fileUrl = '';
    if (image && image.size > 0) {
      const file = await storage.createFile('images', ID.unique(), image);
      fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/${file.$id}/view?project=6a8c438600024a08a21e`;
    }

    // Ambil produk terakhir untuk mendapatkan urutan terakhir
    let newSequence = 0;
    try {
      const lastProduct = await databases.listDocuments(DATABASE_ID, 'products', [
        Query.orderDesc('sequence'),
        Query.limit(1)
      ]);
      if (lastProduct.documents.length > 0) {
        newSequence = (lastProduct.documents[0].sequence || 0) + 1;
      }
    } catch (e) {
      // Abaikan jika error (mungkin atribut sequence belum ada atau tipe data salah)
      console.log("Could not fetch last sequence", e);
    }

    await databases.createDocument(DATABASE_ID, 'products', ID.unique(), {
      name,
      description,
      imageUrl: fileUrl || null,
      sequence: newSequence
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Add Product Error:", error);
    return { error: error.message || 'Gagal menambahkan produk' };
  }
}

export async function deleteProduct(id: string, fileUrl: string) {
  try {
    const { databases, storage } = await createAdminClient();

    if (fileUrl) {
      const fileIdMatch = fileUrl.match(/files\/([^/]+)\/view/);
      if (fileIdMatch && fileIdMatch[1]) {
        try {
          await storage.deleteFile('images', fileIdMatch[1]);
        } catch (e) {
          console.error("Gagal menghapus file lama:", e);
        }
      }
    }

    await databases.deleteDocument(DATABASE_ID, 'products', id);

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return { error: error.message || 'Gagal menghapus produk' };
  }
}

export async function editProduct(id: string, formData: FormData, oldFileUrl?: string) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    if (!name || !description) {
      return { error: 'Nama dan deskripsi wajib diisi' };
    }

    const { databases, storage } = await createAdminClient();

    let fileUrl = oldFileUrl || '';
    
    // Jika ada gambar baru yang diunggah
    if (image && image.size > 0) {
      const file = await storage.createFile('images', ID.unique(), image);
      fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/${file.$id}/view?project=6a8c438600024a08a21e`;
      
      // Hapus gambar lama jika ada
      if (oldFileUrl) {
        const fileIdMatch = oldFileUrl.match(/files\/([^/]+)\/view/);
        if (fileIdMatch && fileIdMatch[1]) {
          try {
            await storage.deleteFile('images', fileIdMatch[1]);
          } catch (e) {
            console.error("Gagal menghapus file lama saat update:", e);
          }
        }
      }
    }

    await databases.updateDocument(DATABASE_ID, 'products', id, {
      name,
      description,
      imageUrl: fileUrl || null,
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Edit Product Error:", error);
    return { error: error.message || 'Gagal mengubah produk' };
  }
}

export async function updateProductSequence(items: { id: string; sequence: number }[]) {
  try {
    const { databases } = await createAdminClient();

    await Promise.all(
      items.map(item => 
        databases.updateDocument(DATABASE_ID, 'products', item.id, {
          sequence: item.sequence
        })
      )
    );

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Update Sequence Error:", error);
    return { error: error.message || 'Gagal menyimpan urutan' };
  }
}
