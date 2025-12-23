
import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LeadStatus, Priority, Activity as ActivityType } from '../../types';
import { Modal } from '../ui/Modal';
import { User, Building, Mail, Phone, DollarSign, Tag, Calendar, Loader2 } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead, user, addToast } = useCRM();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    priority: Priority.Medium,
    status: LeadStatus.New,
    tags: '',
    meetingDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user) return;
    
    setIsSubmitting(true);
    try {
      const history: ActivityType[] = [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'status_change',
          content: 'Lead criado no sistema via painel',
          date: new Date().toLocaleString('pt-BR'),
          user: user.name
        }
      ];

      const newLead = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        value: Number(formData.value) || 0,
        priority: formData.priority,
        owner: user.name,
        last_interaction: 'Agora mesmo',
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        history: history
      };

      // Fixed: The addLead function now correctly returns a Promise<boolean> via the context interface update
      const success = await addLead(newLead as any);
      
      if (success) {
        setFormData(initialFormState);
        onClose();
      }
    } catch (error: any) {
      addToast('Erro ao salvar', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Nova Oportunidade">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Contato Principal</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-surfaceHighlight/30 border border-borderColor rounded-xl py-3 pl-10 text-white focus:border-primary outline-none" placeholder="Ex: Rodrigo Santos" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Empresa</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required name="company" value={formData.company} onChange={handleChange} className="w-full bg-surfaceHighlight/30 border border-borderColor rounded-xl py-3 pl-10 text-white focus:border-primary outline-none" placeholder="Nome da Empresa" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Valor Estimado (USD)</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input type="number" name="value" value={formData.value} onChange={handleChange} className="w-full bg-surfaceHighlight/30 border border-borderColor rounded-xl py-3 pl-10 text-white focus:border-primary outline-none" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Prioridade</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-surfaceHighlight/30 border border-borderColor rounded-xl py-3 px-4 text-white focus:border-primary outline-none">
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-400 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surfaceHighlight/30 border border-borderColor rounded-xl py-3 pl-10 text-white focus:border-primary outline-none" placeholder="contato@empresa.com" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-primary hover:bg-primaryHover text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Salvar Lead'}
            </button>
        </div>
      </form>
    </Modal>
  );
};
