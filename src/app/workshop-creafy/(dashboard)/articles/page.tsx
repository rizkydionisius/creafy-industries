import React from 'react';
import { prisma } from '@/lib/prisma';
import { normalizeArticle } from '@/lib/normalize';
import ArticlesClient from './ArticlesClient';

export default async function ArticlesPage() {
  let articles: any[] = [];

  try {
    const raw = await prisma.article.findMany({
      orderBy: { created_at: 'desc' },
    });
    articles = raw.map(normalizeArticle);
  } catch (error) {
    console.error("Gagal mengambil data artikel:", error);
  }

  return (
    <div style={{ width: '100%' }}>
      <ArticlesClient initialArticles={articles} />
    </div>
  );
}
