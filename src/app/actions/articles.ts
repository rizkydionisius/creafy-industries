'use server'

import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

export async function addArticle(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;
    
    // New fields
    const publishDate = formData.get('publishDate') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;

    if (!title || !slug || !content) {
      return { error: 'Judul, slug, dan konten wajib diisi' };
    }

    const { databases, storage } = await createAdminClient();

    // Cek apakah slug sudah ada
    const existing = await databases.listDocuments(DATABASE_ID, 'articles', [
      Query.equal('slug', slug)
    ]);
    if (existing.total > 0) {
      return { error: 'Slug sudah digunakan, silakan ganti judul atau ubah slug' };
    }

    let fileUrl = '';
    if (image && image.size > 0) {
      const file = await storage.createFile('images', ID.unique(), image);
      fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/${file.$id}/view?project=6a8c438600024a08a21e`;
    }

    // Prepare document data
    const data: any = {
      title,
      slug,
      content,
      thumbnail: fileUrl || null,
    };
    
    // Only add if provided to avoid Appwrite errors on empty strings for datetime
    if (publishDate) data.publishDate = new Date(publishDate).toISOString();
    if (category) data.category = category;
    if (author) data.author = author;
    if (excerpt) data.excerpt = excerpt;

    await databases.createDocument(DATABASE_ID, 'articles', ID.unique(), data);

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Add Article Error:", error);
    return { error: error.message || 'Gagal menambahkan artikel' };
  }
}

export async function deleteArticle(id: string, fileUrl: string) {
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

    await databases.deleteDocument(DATABASE_ID, 'articles', id);

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Article Error:", error);
    return { error: error.message || 'Gagal menghapus artikel' };
  }
}

export async function editArticle(id: string, formData: FormData, oldFileUrl?: string) {
  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;
    
    // New fields
    const publishDate = formData.get('publishDate') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;

    if (!title || !slug || !content) {
      return { error: 'Judul, slug, dan konten wajib diisi' };
    }

    const { databases, storage } = await createAdminClient();

    // Cek slug jika diubah
    const current = await databases.getDocument(DATABASE_ID, 'articles', id);
    if (current.slug !== slug) {
      const existing = await databases.listDocuments(DATABASE_ID, 'articles', [
        Query.equal('slug', slug)
      ]);
      if (existing.total > 0) {
        return { error: 'Slug sudah digunakan artikel lain' };
      }
    }

    let fileUrl = oldFileUrl || '';
    
    if (image && image.size > 0) {
      const file = await storage.createFile('images', ID.unique(), image);
      fileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/${file.$id}/view?project=6a8c438600024a08a21e`;
      
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

    // Prepare document data
    const data: any = {
      title,
      slug,
      content,
      thumbnail: fileUrl || null,
      category: category || null,
      author: author || null,
      excerpt: excerpt || null,
    };
    
    // Only update publishDate if valid
    if (publishDate) {
      data.publishDate = new Date(publishDate).toISOString();
    } else {
      data.publishDate = null;
    }

    await databases.updateDocument(DATABASE_ID, 'articles', id, data);

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Edit Article Error:", error);
    return { error: error.message || 'Gagal mengubah artikel' };
  }
}
