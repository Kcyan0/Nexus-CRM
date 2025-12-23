
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User as UserIcon, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { useCRM } from '../context/CRMContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useCRM();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      if (isRegistering) {
        if (!name.trim()) throw new Error("Por favor, informe seu nome.");
        
        // Tenta criar o usuário diretamente como confirmado usando a chave Admin
        // Isso evita o erro "Error sending confirmation email"
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Confirma automaticamente
          user_metadata: { name: name.trim() }
        });

        if (error) throw error;
        
        // Se criou com sucesso, faz o login imediatamente
        if (data.user) {
           const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
           if (signInError) throw signInError;

           addToast('Bem-vindo!', 'Conta ativada com sucesso.', 'success');
           navigate('/');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          addToast('Acesso Autorizado', 'Bem-vindo ao Nexus CRM Pro.', 'success');
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error("Auth Error Detail:", err);
      const msg = err.message || 'Verifique suas credenciais.';
      setErrorMsg(msg);
      addToast('Erro na Autenticação', msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-surface/40 backdrop-blur-2xl border border-white/5 w-full max-w-md p-10 rounded-[2rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-primary/20 transform hover:rotate-6 transition-transform">
            <span className="text-white font-black text-3xl">N</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {isRegistering ? 'Nexus Engine' : 'Nexus Access'}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {isRegistering ? 'Crie seu ambiente de alta performance' : 'Conecte-se à sua inteligência de vendas'}
          </p>
        </div>

        {errorMsg && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs text-red-200 font-medium">{errorMsg}</p>
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seu Nome</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-slate-600" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  placeholder="Nome completo"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-600" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                placeholder="exemplo@empresa.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-600" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 text-white rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primaryHover text-white font-black py-4 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>{isRegistering ? 'Ativar Conta' : 'Acessar Nexus'} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(null); }}
            className="text-slate-500 hover:text-white text-xs font-bold transition-colors uppercase tracking-widest"
          >
            {isRegistering ? 'Já possui acesso? Conecte-se' : 'Novo por aqui? Criar conta Nexus'}
          </button>
        </div>
      </div>
    </div>
  );
};
