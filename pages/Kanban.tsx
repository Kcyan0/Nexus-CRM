
import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { LeadStatus, Lead, Priority } from '../types';
import { Plus, Clock, Filter, Trash2, GripVertical, DollarSign } from 'lucide-react';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { NewLeadModal } from '../components/leads/NewLeadModal';

export const Kanban: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead } = useCRM();
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;
  const columns = Object.values(LeadStatus);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Pequeno atraso para o efeito visual de fantasma ser capturado
    setTimeout(() => {
        const el = document.getElementById(`card-${id}`);
        if (el) el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = document.getElementById(`card-${draggedItemId}`);
    if (el) el.style.opacity = '1';
    setDraggedItemId(null);
    setHoveredColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setHoveredColumn(status);
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('leadId');
    updateLeadStatus(id, status);
    setHoveredColumn(null);
    setDraggedItemId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation(); 
      if (window.confirm('Excluir este negócio do pipeline?')) {
          deleteLead(id);
      }
  };
  
  const getColumnColor = (status: LeadStatus) => {
    switch(status) {
      case LeadStatus.New: return 'border-blue-500';
      case LeadStatus.Contacted: return 'border-orange-500';
      case LeadStatus.Proposal: return 'border-purple-500';
      case LeadStatus.Negotiation: return 'border-pink-500';
      case LeadStatus.Closed: return 'border-emerald-500';
      case LeadStatus.Loss: return 'border-red-500';
      default: return 'border-slate-700';
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Pipeline de Vendas</h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie o fluxo de cadência e conversão do seu funil.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-surfaceHighlight border border-white/5 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Filter size={16}/> Filtros
           </button>
           <button 
              onClick={() => setIsNewLeadModalOpen(true)}
              className="px-6 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-sm font-black transition-all shadow-xl shadow-primary/20"
            >
              + Novo Negócio
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-6 scroll-smooth custom-scrollbar">
        <div className="flex gap-6 min-w-max h-full pb-2">
          {columns.map(status => {
            const columnItems = leads.filter(item => item.status === status);
            const totalValue = columnItems.reduce((sum, item) => sum + item.value, 0);
            const isHovered = hoveredColumn === status;
            
            return (
              <div 
                key={status}
                className={`w-80 flex flex-col rounded-3xl border transition-all duration-300 ${isHovered ? 'bg-white/5 border-primary/50' : 'bg-surface/40 border-white/5'}`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={() => setHoveredColumn(null)}
                onDrop={(e) => handleDrop(e, status)}
              >
                {/* Column Header */}
                <div className={`p-5 border-t-4 ${getColumnColor(status)} rounded-t-3xl bg-surface/80 backdrop-blur-md shadow-lg sticky top-0 z-20`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white text-sm uppercase tracking-widest">{status}</h3>
                    <span className="bg-white/5 text-slate-400 text-[10px] px-2 py-1 rounded-lg font-black">
                      {columnItems.length}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 text-emerald-400">
                    <span className="text-xs font-bold">$</span>
                    <p className="text-lg font-black tracking-tight">{totalValue.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar min-h-[150px]">
                  {columnItems.map(item => (
                    <div
                      key={item.id}
                      id={`card-${item.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => { setSelectedLeadId(item.id); setIsModalOpen(true); }}
                      className={`
                        bg-surfaceHighlight/40 backdrop-blur-sm border border-white/5 p-4 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing
                        hover:border-primary/40 hover:bg-surfaceHighlight/60 transition-all duration-300 group relative
                        ${draggedItemId === item.id ? 'scale-95' : 'scale-100'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border 
                          ${item.priority === Priority.High ? 'text-red-400 border-red-500/20 bg-red-500/10' : 
                            item.priority === Priority.Medium ? 'text-orange-400 border-orange-500/20 bg-orange-500/10' : 
                            'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'}`}>
                          {item.priority}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => handleDelete(e, item.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Excluir"
                            >
                                <Trash2 size={14} />
                            </button>
                            <GripVertical size={14} className="text-slate-600 mt-1.5" />
                        </div>
                      </div>
                      
                      <h4 className="text-white font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.company}</h4>
                      <p className="text-slate-400 text-[11px] mb-4 truncate">{item.name}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 font-black text-white text-sm">
                          <DollarSign size={14} className="text-emerald-500" />
                          {item.value.toLocaleString()}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {item.last_interaction.includes('Agora') && (
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            )}
                            <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm" title={item.owner}>
                                {item.owner.charAt(0)}
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {columnItems.length === 0 && (
                      <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Fase Vazia</p>
                      </div>
                  )}

                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:border-primary/40 hover:text-white hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                      <Plus size={14} /> Novo Lead
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LeadDetailModal 
        lead={selectedLead} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
      />
    </div>
  );
};
