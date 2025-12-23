
import { createClient } from '@supabase/supabase-js';

// Chaves do Projeto
const supabaseUrl = 'https://ouskakvbuvehwbccldbg.supabase.co';
const supabaseAnonKey = 'sb_publishable_VcHNI1jc92o6tnK_F9wzMA_GSUtKb8Y';

// SERVICE KEY: Utilizada para contornar erros de envio de e-mail no plano gratuito.
// ATENÇÃO: Em produção real, esta chave deve ficar apenas no backend (Node.js/Edge Functions).
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91c2tha3ZidXZlaHdiY2NsZGJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUzMDE5OCwiZXhwIjoyMDgyMTA2MTk4fQ.Iu5Nj-OCbBIPcehSMaLUmnwWwxE0JYQiVu9Yvc6KhUg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Cliente Admin para operações privilegiadas (Criação direta de usuário confirmado)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
