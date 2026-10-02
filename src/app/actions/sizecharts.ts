'use server'

import { prisma } from '@/lib/prisma';
import { saveFile, deleteFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

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

    const image_url = await saveFile(image);

    const lastItem = await prisma.sizeChart.findFirst({
      orderBy: { sequence: 'desc' },
    });
    const newSequence = lastItem ? lastItem.sequence + 1 : 0;

    await prisma.sizeChart.create({
      data: { title, image_url, sequence: newSequence },
    });

    revalidatePath('/workshop-creafy/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Add Size Chart Error:", error);
    return { error: error.message || 'Gagal menambahkan panduan ukuran' };
  }
}

export async function deleteSizeChart(id: string, fileUrl: string) {
  try {
    await prisma.sizeChart.delete({ where: { id } });
    if (fileUrl) await deleteFile(fileUrl);

    revalidatePath('/workshop-creafy/size-chart');
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

    const current = await prisma.sizeChart.findUnique({ where: { id } });
    if (!current) return { error: 'Data tidak ditemukan' };

    let image_url = oldFileUrl || current.image_url;

    if (image && image.size > 0) {
      image_url = await saveFile(image);
      if (oldFileUrl) await deleteFile(oldFileUrl);
    }

    await prisma.sizeChart.update({
      where: { id },
      data: { title, image_url },
    });

    revalidatePath('/workshop-creafy/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Edit Size Chart Error:", error);
    return { error: error.message || 'Gagal mengubah panduan ukuran' };
  }
}

export async function updateSizeChartSequence(items: { id: string; sequence: number }[]) {
  try {
    await Promise.all(
      items.map(item =>
        prisma.sizeChart.update({
          where: { id: item.id },
          data: { sequence: item.sequence },
        })
      )
    );

    revalidatePath('/workshop-creafy/size-chart');
    revalidatePath('/size-chart');
    return { success: true };
  } catch (error: any) {
    console.error("Update Sequence Error:", error);
    return { error: error.message || 'Gagal menyimpan urutan' };
  }
}
