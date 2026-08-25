import React from 'react';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';
import ArticlesClient from './ArticlesClient';

export default async function ArticlesPage() {
  let articles = [];

  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(DATABASE_ID, 'articles', [
      Query.orderDesc('$createdAt')
    ]);
    articles = JSON.parse(JSON.stringify(res.documents));
  } catch (error) {
    console.error("Gagal mengambil data artikel:", error);
  }

  return (
    <div style={{ width: '100%' }}>
      <ArticlesClient initialArticles={articles} />
    </div>
  );
}
