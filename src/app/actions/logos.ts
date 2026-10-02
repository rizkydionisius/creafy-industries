"use server";

import { prisma } from '@/lib/prisma';
import { saveFile, deleteFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

export async function addLogo(formData: FormData) {
  const name = formData.get('name') as string;
  const image = formData.get('image') as File;

  if (!name || !image || image.size === 0) {
    return { error: 'Nama dan gambar wajib diisi' };
  }

  try {
    const logo_url = await saveFile(image);

    const lastLogo = await prisma.logo.findFirst({
      orderBy: { sequence: 'desc' },
    });
    const newSequence = lastLogo ? lastLogo.sequence + 1 : 0;

    await prisma.logo.create({
      data: { name, logo_url, sequence: newSequence },
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
    await prisma.logo.delete({ where: { id: documentId } });
    if (fileUrl) await deleteFile(fileUrl);

    revalidatePath('/workshop-creafy/logos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Gagal menghapus logo' };
  }
}

export async function updateLogoSequence(items: { id: string; sequence: number }[]) {
  try {
    await Promise.all(
      items.map(item =>
        prisma.logo.update({
          where: { id: item.id },
          data: { sequence: item.sequence },
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
