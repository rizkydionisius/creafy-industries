"use server";

import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let success = false;

  try {
    const client = new Client()
      .setEndpoint('https://sgp.cloud.appwrite.io/v1')
      .setProject('6a8c438600024a08a21e');

    const account = new Account(client);
    
    // Create session using node-appwrite
    const session = await account.createEmailPasswordSession(email, password);

    // Set the cookie manually for Next.js to read
    const cookieStore = await cookies();
    cookieStore.set('creafy_cms_session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(session.expire),
      path: '/',
    });
    
    success = true;
  } catch (error: any) {
    return { error: error.message || 'Login gagal. Periksa kembali email dan password.' };
  }

  if (success) {
    redirect('/workshop-creafy');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('creafy_cms_session');
  redirect('/workshop-creafy/login');
}
