'use server';

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signIn(formData: FormData): Promise<void> {
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const password = typeof rawPassword === 'string' ? rawPassword : '';

  if (!email || !EMAIL_REGEX.test(email) || !password) {
    redirect('/entrar?erro=campos-invalidos');
  }

  const allowed = process.env.ALLOWED_EMAIL?.trim().toLowerCase();

  // Allowlist: rejeita silenciosamente qualquer email fora da lista
  // sem revelar a diferença entre "fora da allowlist" e "senha errada".
  if (!allowed || email !== allowed) {
    redirect('/entrar?erro=credenciais-invalidas');
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[signIn] signInWithPassword falhou', error.message);
    redirect('/entrar?erro=credenciais-invalidas');
  }

  redirect('/casa');
}
