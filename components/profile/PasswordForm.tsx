'use client';

import { Check, KeyRound } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';

import { updatePassword, type UpdatePasswordResult } from '@/app/_actions/profile';

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState<UpdatePasswordResult | null, FormData>(
    updatePassword,
    null,
  );

  // Limpa form em sucesso
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="text-on-surface-variant flex items-center gap-2 text-sm">
        <KeyRound size={14} strokeWidth={1.6} />
        <span className="font-sans">Trocar senha</span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-on-surface-variant font-sans text-xs tracking-wide uppercase">
          Nova senha
        </span>
        <input
          type="password"
          name="next_password"
          required
          autoComplete="new-password"
          minLength={6}
          maxLength={200}
          className="border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary rounded-sm border px-4 py-2.5 text-base outline-none transition-colors"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-on-surface-variant font-sans text-xs tracking-wide uppercase">
          Confirmar senha
        </span>
        <input
          type="password"
          name="confirm_password"
          required
          autoComplete="new-password"
          minLength={6}
          maxLength={200}
          className="border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary rounded-sm border px-4 py-2.5 text-base outline-none transition-colors"
        />
      </label>

      {state && !state.ok ? (
        <p className="text-error font-sans text-sm italic">{state.error}</p>
      ) : null}

      {state?.ok ? (
        <p className="text-secondary font-sans inline-flex items-center gap-1.5 text-sm">
          <Check size={14} strokeWidth={2} />
          senha trocada
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-on-primary hover:bg-primary-container font-sans self-start rounded-full px-5 py-2 text-sm tracking-wide transition-colors disabled:opacity-50"
      >
        {pending ? 'salvando...' : 'trocar senha'}
      </button>
    </form>
  );
}
