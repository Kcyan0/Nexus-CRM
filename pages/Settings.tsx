
import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Bell, Moon, Sun, User, Users, ChevronRight, Trash2, Plus, Mail, Shield, UserPlus, X, Loader2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const Settings: React.FC = () => {
  const { user, updateUser, theme, toggleTheme, teamMembers, addTeamMember, deleteTeamMember } = useCRM();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Vendas' as any });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addTeamMember(newMember);
      setIsAddMemberModalOpen(false);
      setNewMember({ name: '', email: '', role: 'Vendas' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover ${name} da equipe?`)) {
      deleteTeamMember(id);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 animate-in fade-in duration-500">
      <h1 className="text-4xl font-extrabold text-white tracking-tight">Configurações</h1>

      {/* Profile Section */}
      <div className="bg-surface border border-surfaceHighlight rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative group/avatar">
            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-3xl border-2 border-primary/30 shadow-2xl shadow-primary/10 object-cover group-hover/avatar:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Plus size={20} className="text-white"/>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-slate-400">{user.email}</p>
            <span className="inline-block mt-3 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              {user.role} Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
            <input 
              type="text" 
              value={user.name} 
              onChange={(e) => updateUser({ name: e.target.value })}
              className="w-full bg-surfaceHighlight/30 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail de Acesso</label>
            <input 
              type="email" 
              value={user.email} 
              readOnly
              className="w-full bg-surfaceHighlight/20 border border-slate-700/50 rounded-2xl p-4 text-slate-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-surface border border-surfaceHighlight rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white">Interface e Alertas</h3>
        </div>
        <div className="divide-y divide-white/5">
          <div className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
              </div>
              <div>
                <p className="font-bold text-white">Modo de Visualização</p>
                <p className="text-sm text-slate-400">Alternar entre tema escuro e claro</p>
              </div>
            </div>
            <button 
                onClick={toggleTheme}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-slate-700'}`}
            >
                <div className={`bg-white w-6 h-6 rounded-full shadow-lg transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-surface border border-surfaceHighlight rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                    <Users size={20}/>
                </div>
                <h3 className="text-lg font-bold text-white">Membros da Equipe</h3>
            </div>
            <button 
                onClick={() => setIsAddMemberModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-secondary/20"
            >
                <UserPlus size={16}/> Adicionar
            </button>
        </div>
        
        <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {teamMembers.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                    <Users size={40} className="mx-auto mb-4 opacity-10" />
                    <p>Sua equipe está vazia ou carregando...</p>
                </div>
            ) : (
                teamMembers.map(member => (
                    <div key={member.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                        <div className="flex items-center gap-4">
                            <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl border border-white/5 object-cover" />
                            <div>
                                <h4 className="text-white font-bold text-sm">{member.name}</h4>
                                <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                                    <Shield size={10} className="text-primary"/> {member.role}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                               <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{member.email}</p>
                            </div>
                            <button 
                                onClick={() => confirmDelete(member.id, member.name)}
                                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                                title="Excluir Membro"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Modal Adicionar Membro */}
      <Modal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Convidar Novo Membro"
      >
        <form onSubmit={handleAddMember} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input 
                            required
                            type="text"
                            value={newMember.name}
                            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            className="w-full bg-surfaceHighlight/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-all shadow-inner"
                            placeholder="Ex: João Silva"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail Corporativo</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <input 
                            required
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            className="w-full bg-surfaceHighlight/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-all shadow-inner"
                            placeholder="joao@empresa.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cargo / Função</label>
                    <select 
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value as any})}
                        className="w-full bg-surfaceHighlight/50 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-primary transition-all cursor-pointer shadow-inner appearance-none"
                    >
                        <option value="Vendas">Executivo de Vendas</option>
                        <option value="Admin">Administrador</option>
                        <option value="Suporte">Suporte ao Cliente</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="flex-1 px-6 py-3 text-slate-400 hover:text-white transition-colors font-bold"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primaryHover text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
                >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin"/> : <><UserPlus size={18}/> Salvar Membro</>}
                </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};
