"use server";

import { validateUser, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  let success = false;

  try {
    const user = await validateUser(email, password);
    if (!user) {
      return { error: 'Email atau password salah.' };
    }

    await setSessionCookie(user.id, user.email);
    success = true;
  } catch (error: any) {
    return { error: error.message || 'Login gagal. Periksa kembali email dan password.' };
  }

  if (success) {
    redirect('/workshop-creafy');
  }
}

export async function logout() {
  await clearSessionCookie();
  redirect('/workshop-creafy/login');
}
