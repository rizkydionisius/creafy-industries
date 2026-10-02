import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

// Helper untuk mengunduh gambar dan mengunggahnya ke Vercel Blob
async function migrateImageToBlob(appwriteUrl: string, prefix: string): Promise<string> {
  try {
    if (!appwriteUrl || !appwriteUrl.includes('sgp.cloud.appwrite.io')) {
      return appwriteUrl; // Lewati jika bukan URL Appwrite
    }

    console.log(`- Downloading from Appwrite: ${appwriteUrl}`);
    const response = await fetch(appwriteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Generate filename yang unik
    const filename = `${prefix}-${Date.now()}.jpg`;

    console.log(`- Uploading to Vercel Blob: uploads/${filename}`);
    const blob = await put(`uploads/${filename}`, buffer, {
      access: 'public',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN, // Pastikan ini ada
    });

    console.log(`- Success! New URL: ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error(`- Error migrating image ${appwriteUrl}:`, error);
    return appwriteUrl; // Fallback ke URL lama jika gagal
  }
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ ERROR: BLOB_READ_WRITE_TOKEN tidak ditemukan di .env.local");
    console.error("Silakan tambahkan token Vercel Blob terlebih dahulu.");
    process.exit(1);
  }

  console.log("=== MEMULAI MIGRASI GAMBAR KE VERCEL BLOB ===");

  // 1. Migrasi Artikel (thumbnail)
  console.log("\n[1] Migrasi Artikel...");
  const articles = await prisma.article.findMany();
  for (const article of articles) {
    if (article.thumbnail && article.thumbnail.includes('appwrite.io')) {
      console.log(`Memigrasi artikel: ${article.title}`);
      const newUrl = await migrateImageToBlob(article.thumbnail, 'article');
      if (newUrl !== article.thumbnail) {
        await prisma.article.update({
          where: { id: article.id },
          data: { thumbnail: newUrl },
        });
      }
    }
  }

  // 2. Migrasi Logo (logo_url)
  console.log("\n[2] Migrasi Logo...");
  const logos = await prisma.logo.findMany();
  for (const logo of logos) {
    if (logo.logo_url && logo.logo_url.includes('appwrite.io')) {
      console.log(`Memigrasi logo: ${logo.name}`);
      const newUrl = await migrateImageToBlob(logo.logo_url, 'logo');
      if (newUrl !== logo.logo_url) {
        await prisma.logo.update({
          where: { id: logo.id },
          data: { logo_url: newUrl },
        });
      }
    }
  }

  // 3. Migrasi Portfolio (image_url)
  console.log("\n[3] Migrasi Portfolio...");
  const portfolios = await prisma.portfolio.findMany();
  for (const portfolio of portfolios) {
    if (portfolio.image_url && portfolio.image_url.includes('appwrite.io')) {
      console.log(`Memigrasi portfolio: ${portfolio.title}`);
      const newUrl = await migrateImageToBlob(portfolio.image_url, 'portfolio');
      if (newUrl !== portfolio.image_url) {
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: { image_url: newUrl },
        });
      }
    }
  }

  // 4. Migrasi Produk (image_url)
  console.log("\n[4] Migrasi Produk...");
  const products = await prisma.product.findMany();
  for (const product of products) {
    if (product.image_url && product.image_url.includes('appwrite.io')) {
      console.log(`Memigrasi produk: ${product.name}`);
      const newUrl = await migrateImageToBlob(product.image_url, 'product');
      if (newUrl !== product.image_url) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image_url: newUrl },
        });
      }
    }
  }

  // 5. Migrasi Size Chart (image_url)
  console.log("\n[5] Migrasi Size Chart...");
  const sizeCharts = await prisma.sizeChart.findMany();
  for (const chart of sizeCharts) {
    if (chart.image_url && chart.image_url.includes('appwrite.io')) {
      console.log(`Memigrasi size chart: ${chart.title}`);
      const newUrl = await migrateImageToBlob(chart.image_url, 'sizechart');
      if (newUrl !== chart.image_url) {
        await prisma.sizeChart.update({
          where: { id: chart.id },
          data: { image_url: newUrl },
        });
      }
    }
  }

  console.log("\n=== MIGRASI SELESAI ===");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
