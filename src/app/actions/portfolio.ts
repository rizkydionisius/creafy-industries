'use server';

import { prisma } from '@/lib/prisma';
import { saveFile, deleteFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

export async function addPortfolio(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !category) {
      return { error: 'Judul dan kategori wajib diisi.' };
    }

    let image_url: string | null = null;
    if (imageFile && imageFile.size > 0) {
      image_url = await saveFile(imageFile);
    }

    const res = await prisma.portfolio.create({
      data: { title, category, image_url, sequence: 0 },
    });

    revalidatePath('/workshop-creafy/portfolio');
    revalidatePath('/portfolio');
    return { success: true, id: res.id };
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

    let image_url = oldImageUrl;

    if (imageFile && imageFile.size > 0) {
      image_url = await saveFile(imageFile);
      if (oldImageUrl) await deleteFile(oldImageUrl);
    }

    await prisma.portfolio.update({
      where: { id },
      data: { title, category, image_url },
    });

    revalidatePath('/workshop-creafy/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error: any) {
    console.error("Gagal mengedit portofolio:", error);
    return { error: error.message || 'Terjadi kesalahan saat menyimpan.' };
  }
}

export async function deletePortfolio(id: string, imageUrl: string) {
  try {
    await prisma.portfolio.delete({ where: { id } });
    if (imageUrl) await deleteFile(imageUrl);

    revalidatePath('/workshop-creafy/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error: any) {
    console.error("Gagal menghapus portofolio:", error);
    return { error: error.message || 'Terjadi kesalahan saat menghapus.' };
  }
}

export async function updatePortfolioSequence(items: { id: string; sequence: number }[]) {
  try {
    await Promise.all(
      items.map(item =>
        prisma.portfolio.update({
          where: { id: item.id },
          data: { sequence: item.sequence },
        })
      )
    );

    revalidatePath('/workshop-creafy/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error: any) {
    console.error("Gagal mengupdate urutan:", error);
    return { error: error.message || 'Gagal menyimpan urutan baru.' };
  }
}
