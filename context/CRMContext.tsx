
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Lead, 
  Task, 
  User, 
  Theme, 
  Notification, 
  CRMContextType, 
  LeadStatus, 
  ToastMessage,
  Activity,
  Priority,
  TeamMember
} from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import { supabase } from '../lib/supabase';

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const calculateLeadScore = (lead: Lead): number => {
  let score = 0;
  const val = Number(lead.value) || 0;
  score += Math.min(val / 1000, 50);
  if (lead.priority === Priority.High) score += 25;
  if (lead.priority === Priority.Medium) score += 10;
  score += (lead.history?.length || 0) * 5;
  return Math.min(Math.max(score, 0), 100);
};

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Leads (RLS filtrará automaticamente pelo user_id)
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!leadsError && leadsData) {
        setLeads(leadsData.map(l => ({ ...l, score: calculateLeadScore(l) })));
      }

      // Tarefas
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!tasksError && tasksData) {
        setTasks(tasksData);
      }

      // Perfis da equipe
      const { data: membersData } = await supabase.from('profiles').select('*');
      if (membersData) {
        setTeamMembers(membersData.map(m => ({
          id: m.id,
          name: m.name || 'Sem nome',
          email: m.email || '',
          role: m.role || 'Vendas',
          avatar: m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`
        })));
      }
    } catch (e: any) {
      console.error("Erro na sincronização:", e.message);
    }
  };

  useEffect(() => {
    const syncUser = async (session: any) => {
      if (session?.user) {
        // Tenta buscar o perfil, mas não bloqueia se não encontrar (o trigger criará na sequência)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        const displayName = profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário Nexus';
        
        setUser({
          id: session.user.id,
          name: displayName,
          email: session.user.email || '',
          role: (profile?.role as any) || 'Vendas',
          avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        });
        
        await fetchData();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => syncUser(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => syncUser(session));
    return () => subscription.unsubscribe();
  }, []);

  const apiAction = async (action: () => any, successMsg: string): Promise<boolean> => {
    try {
      const { error } = await action();
      if (error) {
        console.error("Supabase Error:", error);
        addToast('Banco de Dados', error.message, 'error');
        return false;
      }
      if (successMsg) addToast('Nexus CRM', successMsg, 'success');
      await fetchData(); // Refresh imediato
      return true;
    } catch (e: any) {
      addToast('Conectividade', 'Erro de rede ou permissão.', 'error');
      return false;
    }
  };

  const contextValue: CRMContextType = {
    leads,
    tasks,
    teamMembers,
    user,
    theme,
    notifications,
    toasts,
    searchQuery,
    setSearchQuery,
    toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
    updateLeadStatus: async (id, status) => {
      if (!user) return;
      await apiAction(() => 
        supabase.from('leads')
          .update({ status, last_interaction: 'Atualizado agora' })
          .eq('id', id)
          .eq('user_id', user.id), 
        ''
      );
    },
    addLead: async (l) => {
      if (!user) return false;
      // Garante que o user_id seja enviado explicitamente
      return await apiAction(() => 
        supabase.from('leads').insert([{ ...l, user_id: user.id }]), 
        'Novo lead registrado com sucesso.'
      );
    },
    updateLead: async (l) => {
      if (!user) return;
      const { id, score, ...data } = l as any;
      await apiAction(() => 
        supabase.from('leads')
          .update(data)
          .eq('id', id)
          .eq('user_id', user.id), 
        'Alterações salvas.'
      );
    },
    deleteLead: async (id) => {
      if (!user) return;
      await apiAction(() => 
        supabase.from('leads')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id), 
        'Lead removido.'
      );
    },
    deleteLeads: async (ids) => {
      if (!user) return;
      await apiAction(() => 
        supabase.from('leads')
          .delete()
          .in('id', ids)
          .eq('user_id', user.id), 
        'Seleção excluída.'
      );
    },
    addTask: (t) => {
      if (!user) return;
      apiAction(() => supabase.from('tasks').insert([{ ...t, user_id: user.id }]), 'Tarefa criada.');
    },
    updateTask: (t) => {
      if (!user) return;
      const { id, ...data } = t;
      apiAction(() => supabase.from('tasks').update(data).eq('id', id).eq('user_id', user.id), 'Tarefa atualizada.');
    },
    deleteTask: (id) => {
      if (!user) return;
      apiAction(() => supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id), 'Tarefa removida.');
    },
    addTeamMember: async () => {
      addToast('Equipe', 'O convite deve ser feito via cadastro de usuário.', 'info');
    },
    deleteTeamMember: async (id) => {
      if (user?.role === 'Admin') {
        await apiAction(() => supabase.from('profiles').delete().eq('id', id), 'Membro removido.');
      }
    },
    addToast,
    markNotificationRead: (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
    updateUser: async (data) => {
      if (!user) return;
      const { error } = await supabase.from('profiles').update({ name: data.name, avatar_url: data.avatar }).eq('id', user.id);
      if (!error) {
        setUser(prev => prev ? ({ ...prev, ...data }) : null);
        addToast('Perfil', 'Dados atualizados.', 'success');
      }
    }
  };

  return (
    <CRMContext.Provider value={contextValue}>
      {isLoading ? (
        <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 mt-4 font-bold text-xs uppercase tracking-widest animate-pulse">Sincronizando Nexus...</p>
        </div>
      ) : children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
};
