
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, Activity, Priority } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Modal } from '../ui/Modal';
import { 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Tag, 
  MessageSquare,
  PhoneCall,
  Clock,
  CheckCircle2,
  Edit2,
  Save,
  Trash2,
  X,
  Send,
  Loader2
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose }) => {
  const { updateLead, updateLeadStatus, deleteLead, user } = useCRM();
  const [noteContent, setNoteContent] = useState('');
  const [activityType, setActivityType] = useState<'note' | 'call' | 'email' | 'meeting'>('note');
  const [activityDate, setActivityDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Lead | null>(null);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
      setIsEditing(false);
      setIsDeleting(false);
    }
  }, [lead, isOpen]);

  if (!lead || !formData) return null;

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;

    const newActivity: Activity = {
      id: Math.random().toString(36).substring(7),
      type: activityType,
      content: noteContent,
      date: new Date().toLocaleString('pt-BR'),
      user: user.name
    };

    const updatedLead = {
      ...lead,
      history: [newActivity, ...lead.history],
      last_interaction: 'Agora mesmo'
    };

    updateLead(updatedLead);
    setNoteContent('');
  };

  const handleSaveEdit = () => {
    if (formData) {
      updateLead({
          ...formData,
          value: Number(formData.value)
      });
      setIsEditing(false);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isDeleting) return;
      
      if (window.confirm(`Excluir permanentemente o lead "${lead.name}"?`)) {
          setIsDeleting(true);
          await deleteLead(lead.id);
          onClose();
      }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch(status) {
      case LeadStatus.New: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case LeadStatus.Contacted: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case LeadStatus.Proposal: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case LeadStatus.Negotiation: return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case LeadStatus.Closed: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case LeadStatus.Loss: return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-black text-white mb-4 shadow-2xl shadow-primary/30">
                {formData.company.charAt(0)}
            </div>
            <div className="text-center lg:text-left">
                <h2 className="text-2xl font-black text-white">{lead.name}</h2>
                <p className="text-slate-400 text-sm font-medium">{lead.company}</p>
            </div>
          </div>

          <div className="p-5 bg-surfaceHighlight/30 rounded-3xl border border-white/5 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Status Atual</label>
              <div>
                <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Valor Projetado</label>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xl">
                <DollarSign size={20} />
                {lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Responsável</label>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {formData.owner.charAt(0)}
                 </div>
                 <span className="text-sm text-white font-bold">{lead.owner}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 lg:border-l lg:border-white/5 lg:pl-8 flex flex-col h-full">
          <h3 className="text-lg font-black text-white mb-6">Timeline de Interações</h3>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 min-h-[300px] max-h-[450px]">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
                    <textarea 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Registrar nova nota ou follow-up..." 
                        className="w-full bg-transparent border-none outline-none text-sm text-white h-20 resize-none placeholder-slate-600"
                    />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                        <div className="flex gap-2">
                            <button onClick={() => setActivityType('note')} className={`p-2 rounded-xl transition-all ${activityType === 'note' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-white/5'}`}><MessageSquare size={16}/></button>
                            <button onClick={() => setActivityType('call')} className={`p-2 rounded-xl transition-all ${activityType === 'call' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-white/5'}`}><PhoneCall size={16}/></button>
                            <button onClick={() => setActivityType('email')} className={`p-2 rounded-xl transition-all ${activityType === 'email' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:bg-white/5'}`}><Mail size={16}/></button>
                        </div>
                        <button 
                            onClick={handleSaveNote}
                            disabled={!noteContent.trim()}
                            className="px-4 py-2 bg-primary hover:bg-primaryHover disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                        >
                            <Send size={14} /> Registrar
                        </button>
                    </div>
                </div>

                {lead.history.map((item) => (
                <div key={item.id} className="relative pl-10 border-l-2 border-white/5 ml-3 pb-6 last:pb-0">
                    <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-lg border-2 bg-surface flex items-center justify-center z-10 ${item.type === 'status_change' ? 'border-emerald-500' : 'border-primary'}`}>
                        {item.type === 'status_change' ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Clock size={10} className="text-primary" />}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-white uppercase tracking-wider">{item.user}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{item.date}</span>
                        </div>
                        <p className="text-sm text-slate-400">{item.content}</p>
                    </div>
                </div>
                ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <button 
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-xl"
        >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} 
            Excluir Negócio
        </button>
        <button 
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl text-sm font-black transition-all active:scale-95 shadow-xl"
        >
            Concluir
        </button>
      </div>
    </Modal>
  );
};
