'use server'

import { prisma } from '@/lib/prisma';
import { saveFile, deleteFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

export async function addArticle(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;

    const publishDate = formData.get('publishDate') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;

    if (!title || !slug || !content) {
      return { error: 'Judul, slug, dan konten wajib diisi' };
    }

    // Cek apakah slug sudah ada
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return { error: 'Slug sudah digunakan, silakan ganti judul atau ubah slug' };
    }

    let thumbnail: string | null = null;
    if (image && image.size > 0) {
      thumbnail = await saveFile(image);
    }

    await prisma.article.create({
      data: {
        title,
        slug,
        content,
        thumbnail,
        category: category || null,
        author: author || null,
        excerpt: excerpt || null,
        publish_date: publishDate ? new Date(publishDate) : null,
      },
    });

    revalidatePath('/workshop-creafy/articles');
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
    await prisma.article.delete({ where: { id } });
    if (fileUrl) await deleteFile(fileUrl);

    revalidatePath('/workshop-creafy/articles');
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

    const publishDate = formData.get('publishDate') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;

    if (!title || !slug || !content) {
      return { error: 'Judul, slug, dan konten wajib diisi' };
    }

    const current = await prisma.article.findUnique({ where: { id } });
    if (!current) return { error: 'Artikel tidak ditemukan' };

    if (current.slug !== slug) {
      const existing = await prisma.article.findUnique({ where: { slug } });
      if (existing) {
        return { error: 'Slug sudah digunakan artikel lain' };
      }
    }

    let thumbnail = oldFileUrl || current.thumbnail || null;

    if (image && image.size > 0) {
      thumbnail = await saveFile(image);
      if (oldFileUrl) await deleteFile(oldFileUrl);
    }

    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        thumbnail,
        category: category || null,
        author: author || null,
        excerpt: excerpt || null,
        publish_date: publishDate ? new Date(publishDate) : null,
      },
    });

    revalidatePath('/workshop-creafy/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Edit Article Error:", error);
    return { error: error.message || 'Gagal mengubah artikel' };
  }
}
