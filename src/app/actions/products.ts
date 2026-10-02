'use server'

import { prisma } from '@/lib/prisma';
import { saveFile, deleteFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    if (!name || !description) {
      return { error: 'Nama dan deskripsi wajib diisi' };
    }

    let image_url: string | null = null;
    if (image && image.size > 0) {
      image_url = await saveFile(image);
    }

    const lastProduct = await prisma.product.findFirst({
      orderBy: { sequence: 'desc' },
    });
    const newSequence = lastProduct ? lastProduct.sequence + 1 : 0;

    await prisma.product.create({
      data: { name, description, image_url, sequence: newSequence },
    });

    revalidatePath('/workshop-creafy/products');
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
    await prisma.product.delete({ where: { id } });
    if (fileUrl) await deleteFile(fileUrl);

    revalidatePath('/workshop-creafy/products');
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

    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) return { error: 'Produk tidak ditemukan' };

    let image_url = oldFileUrl || current.image_url || null;

    if (image && image.size > 0) {
      image_url = await saveFile(image);
      if (oldFileUrl) await deleteFile(oldFileUrl);
    }

    await prisma.product.update({
      where: { id },
      data: { name, description, image_url },
    });

    revalidatePath('/workshop-creafy/products');
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
    await Promise.all(
      items.map(item =>
        prisma.product.update({
          where: { id: item.id },
          data: { sequence: item.sequence },
        })
      )
    );

    revalidatePath('/workshop-creafy/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Update Sequence Error:", error);
    return { error: error.message || 'Gagal menyimpan urutan' };
  }
}
