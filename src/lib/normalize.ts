/**
 * Helper untuk normalisasi data dari Prisma (snake_case DB) ke format UI (camelCase).
 * Karena tabel DB diwarisi dari Appwrite, field names menggunakan snake_case.
 */

export function normalizeArticle(a: any) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    content: a.content,
    thumbnail: a.thumbnail,
    excerpt: a.excerpt,
    category: a.category,
    author: a.author,
    publishDate: a.publish_date,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export function normalizeProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.image_url,
    sequence: p.sequence,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export function normalizeLogo(l: any) {
  return {
    id: l.id,
    name: l.name,
    logoUrl: l.logo_url,
    sequence: l.sequence,
    createdAt: l.created_at,
    updatedAt: l.updated_at,
  };
}

export function normalizePortfolio(p: any) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    imageUrl: p.image_url,
    sequence: p.sequence,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export function normalizeSizeChart(s: any) {
  return {
    id: s.id,
    title: s.title,
    imageUrl: s.image_url,
    sequence: s.sequence,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  };
}
