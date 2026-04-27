import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Health check — verifica conectividade com Supabase.
 *
 * Usado por:
 * - Monitoramento externo (UptimeRobot a cada 5 min)
 * - Smoke tests pós-deploy
 * - Diagnóstico em CI
 *
 * Retorna 200 se DB + Auth respondem; 503 se algo falha.
 * Não expõe detalhes sensíveis no payload.
 */
export async function GET() {
  const checks: { database: 'ok' | 'fail'; auth: 'ok' | 'fail' } = {
    database: 'fail',
    auth: 'fail',
  };

  try {
    const supabase = await createServerSupabaseClient();

    // Check DB: query trivial em tabela pública
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
    checks.database = dbError ? 'fail' : 'ok';

    // Check Auth: getSession deve responder mesmo quando não autenticado
    const { error: authError } = await supabase.auth.getSession();
    checks.auth = authError ? 'fail' : 'ok';
  } catch {
    return NextResponse.json(
      { ok: false, timestamp: new Date().toISOString(), checks },
      { status: 503 },
    );
  }

  const allOk = checks.database === 'ok' && checks.auth === 'ok';

  return NextResponse.json(
    { ok: allOk, timestamp: new Date().toISOString(), checks },
    { status: allOk ? 200 : 503 },
  );
}
