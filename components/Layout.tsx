
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, KanbanSquare, PieChart, CheckSquare, 
  Settings, LogOut, Menu, Bell, Search, X, Sun, Moon, Zap
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Toast } from './ui/Toast';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, notifications, theme, toggleTheme, toasts, searchQuery, setSearchQuery } = useCRM();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = (e: any) => {
      setScrolled(e.target.scrollTop > 10);
    };
    const mainArea = document.getElementById('main-content-area');
    mainArea?.addEventListener('scroll', handleScroll);
    return () => mainArea?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await useCRM().addToast('Encerrando Sessão', 'Até breve!', 'info');
    // Implement direct logout if necessary or let onAuthStateChange handle it
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Painel' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/kanban', icon: KanbanSquare, label: 'Pipeline' },
    { path: '/reports', icon: PieChart, label: 'Business Intelligence' },
    { path: '/tasks', icon: CheckSquare, label: 'Minhas Tarefas' },
    { path: '/settings', icon: Settings, label: 'Preferências' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Safety guard: If user is not yet loaded, show a minimal loading or return null
  // This prevents the "Cannot read properties of null (reading 'avatar')" error.
  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative text-textPrimary">
      {/* Dynamic Background Blur Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-secondary/10 blur-[100px]"></div>
      </div>

      <div className="fixed top-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => {}} />
        ))}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Glassmorphism */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-surface/80 lg:bg-surface/40 backdrop-blur-2xl border-r border-white/5 transform transition-all duration-500 ease-in-out
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
        lg:relative lg:translate-x-0 lg:border-r lg:border-borderColor
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30 transform hover:rotate-6 transition-transform">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Nexus<span className="text-primary">CRM</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-textSecondary hover:text-textPrimary p-2 hover:bg-white/5 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-white/5 text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : ''}`} />
                    <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    {isActive && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full blur-[1px]"></div>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-6">
            <div className="bg-surfaceHighlight/30 backdrop-blur-md rounded-3xl p-5 border border-white/5 shadow-inner">
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-textSecondary hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className={`
          h-20 flex items-center justify-between px-8 z-40 transition-all duration-300 border-b
          ${scrolled ? 'bg-surface/80 backdrop-blur-xl border-white/5 shadow-xl' : 'bg-transparent border-transparent'}
        `}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-textSecondary hover:text-white">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-2xl px-5 py-2.5 w-96 focus-within:w-[450px] focus-within:border-primary/50 focus-within:bg-white/10 transition-all shadow-inner">
              <Search size={18} className="text-textSecondary" />
              <input 
                type="text" 
                placeholder="Busca global avançada..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white ml-3 w-full placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
             <button 
               onClick={toggleTheme}
               className="p-3 rounded-2xl text-textSecondary hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>

            <div className="relative group">
                <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`relative p-3 rounded-2xl transition-all border ${notificationsOpen ? 'bg-primary/20 text-primary border-primary/20' : 'text-textSecondary hover:text-white hover:bg-white/5 border-transparent hover:border-white/5'}`}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping ring-4 ring-red-500/20"></span>
                    )}
                </button>
            </div>

            <div className="h-8 w-px bg-white/5"></div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Acesso Premium</p>
                  <p className="text-xs font-bold text-white">V. 4.0.0 Stable</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div id="main-content-area" className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
           <div className="max-w-7xl mx-auto h-full">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};
