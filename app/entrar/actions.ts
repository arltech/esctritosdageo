'use server';

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Allowlist a partir de env vars: ALLOWED_EMAILS (CSV) tem prioridade,
 * ALLOWED_EMAIL (singular) é fallback de compat.
 */
function buildAllowlist(): Set<string> {
  const csv = process.env.ALLOWED_EMAILS;
  const single = process.env.ALLOWED_EMAIL;
  const raw = csv && csv.trim().length > 0 ? csv : (single ?? '');
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0),
  );
}

export async function signIn(formData: FormData): Promise<void> {
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const password = typeof rawPassword === 'string' ? rawPassword : '';

  if (!email || !EMAIL_REGEX.test(email) || !password) {
    redirect('/entrar?erro=campos-invalidos');
  }

  const allowlist = buildAllowlist();

  // Allowlist: rejeita silenciosamente qualquer email fora da lista
  // sem revelar a diferença entre "fora da allowlist" e "senha errada".
  if (allowlist.size === 0 || !allowlist.has(email)) {
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
