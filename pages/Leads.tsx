
import React, { useMemo, useState, useEffect } from "react";
import { useCRM } from "../context/CRMContext";
import { LeadStatus, Priority, Lead } from "../types";
import {
  Plus,
  Search,
  ChevronRight,
  LayoutList,
  AlertCircle,
  Trash2,
  Sparkles,
  Trophy,
  Zap,
  Filter,
  Check,
  RefreshCw
} from "lucide-react";

import { LeadDetailModal } from "../components/leads/LeadDetailModal";
import { NewLeadModal } from "../components/leads/NewLeadModal";

export const Leads: React.FC = () => {
  // ✅ Puxando TUDO do contexto global
  const { leads, deleteLead, deleteLeads, addToast, searchQuery, setSearchQuery } = useCRM();
  
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [activeView, setActiveView] = useState<"all" | "my" | "urgent" | "new" | "win" | "loss">("all");

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sincroniza a busca global com o filtro local se necessário
  useEffect(() => {
    if (searchQuery) setLocalSearch(searchQuery);
  }, [searchQuery]);

  // ✅ Prevenção: se o lead selecionado for excluído, fecha modal
  useEffect(() => {
    if (selectedLeadId && !leads.find((l) => l.id === selectedLeadId)) {
      setIsModalOpen(false);
      setSelectedLeadId(null);
    }
  }, [leads, selectedLeadId]);

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = localSearch.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query);

      let matchesView = true;
      switch (activeView) {
        case "urgent":
          matchesView = lead.priority === Priority.High;
          break;
        case "new":
          matchesView = lead.status === LeadStatus.New;
          break;
        case "win":
          matchesView = lead.status === LeadStatus.Closed;
          break;
        case "loss":
          matchesView = lead.status === LeadStatus.Loss;
          break;
        default:
          matchesView = true;
      }

      const matchesStatus =
        statusFilter === "Todos" || lead.status === statusFilter;

      return matchesSearch && matchesStatus && matchesView;
    });
  }, [leads, localSearch, statusFilter, activeView]);

  const toggleSelectAll = () => {
    if (filteredLeads.length === 0) return;
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelectLead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Excluir permanentemente ${selectedIds.length} leads?`)) {
      await deleteLeads(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Excluir o lead "${name}" permanentemente?`)) {
      await deleteLead(id);
    }
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const getScoreColor = (score?: number) => {
    const s = score || 0;
    if (s > 75) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (s > 40) return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return "text-slate-400 bg-slate-500/10 border-slate-500/30";
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.New: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case LeadStatus.Contacted: return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case LeadStatus.Proposal: return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case LeadStatus.Negotiation: return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case LeadStatus.Closed: return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case LeadStatus.Loss: return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-textSecondary";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter">
            Gestão de Leads
          </h1>
          <p className="text-textSecondary mt-2 flex items-center gap-2">
            <Filter size={16} className="text-primary" />
            <span className="text-white font-bold">{filteredLeads.length}</span> oportunidades filtradas na base.
          </p>
        </div>

        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-sm font-black transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl shadow-rose-500/20 animate-in slide-in-from-right-4"
            >
              <Trash2 size={20} />
              Excluir ({selectedIds.length})
            </button>
          )}

          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primaryHover hover:to-indigo-500 text-white rounded-2xl text-sm font-black transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl shadow-primary/20"
          >
            <Plus size={20} />
            Novo Lead
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="xl:w-72 flex-shrink-0 space-y-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">
            Visualização
          </h3>

          <button
            onClick={() => setActiveView("all")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold ${
              activeView === "all"
                ? "bg-white/5 border border-white/10 text-white shadow-xl"
                : "text-textSecondary hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutList size={20} className={activeView === "all" ? "text-primary" : ""} />
            Todos os Leads
          </button>

          <button
            onClick={() => setActiveView("urgent")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold ${
              activeView === "urgent"
                ? "bg-white/5 border border-white/10 text-white shadow-xl"
                : "text-textSecondary hover:text-white hover:bg-white/5"
            }`}
          >
            <AlertCircle size={20} className={activeView === "urgent" ? "text-rose-500" : ""} />
            Críticos / Urgentes
          </button>

          <button
            onClick={() => setActiveView("win")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold ${
              activeView === "win"
                ? "bg-white/5 border border-white/10 text-white shadow-xl"
                : "text-textSecondary hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy size={20} className={activeView === "win" ? "text-emerald-400" : ""} />
            Ganhos (Fechados)
          </button>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-surface border border-borderColor rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="flex items-center bg-white/5 rounded-2xl px-5 py-3 w-full md:w-96 border border-white/5 focus-within:border-primary/40 focus-within:bg-white/10 transition-all shadow-inner">
              <Search size={20} className="text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar nome, empresa ou email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white ml-3 w-full placeholder-slate-600"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                className="flex-1 md:flex-none bg-surfaceHighlight/50 border border-white/5 text-slate-400 text-xs font-bold rounded-2xl px-5 py-3 outline-none cursor-pointer hover:bg-white/10 transition-colors uppercase tracking-widest"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todos">Status: Todos</option>
                {Object.values(LeadStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-surface border border-borderColor rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surfaceHighlight/50 text-slate-500 uppercase font-black text-[10px] tracking-[0.15em]">
                  <tr>
                    <th className="px-6 py-6 w-12">
                      <button
                        onClick={toggleSelectAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          filteredLeads.length > 0 && selectedIds.length === filteredLeads.length
                            ? "bg-primary border-primary"
                            : "bg-transparent border-slate-700"
                        }`}
                      >
                        {filteredLeads.length > 0 && selectedIds.length === filteredLeads.length && (
                          <Check size={14} className="text-white" />
                        )}
                      </button>
                    </th>
                    <th className="px-8 py-6">Lead & Empresa</th>
                    <th className="px-8 py-6">Score</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Valor</th>
                    <th className="px-8 py-6 text-right pr-12">Gestão</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-500 italic">
                        Nenhuma oportunidade encontrada com esses filtros.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => { setSelectedLeadId(lead.id); setIsModalOpen(true); }}
                        className={`hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer ${
                          isSelected(lead.id) ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="px-6 py-5" onClick={(e) => toggleSelectLead(e, lead.id)}>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            isSelected(lead.id) ? "bg-primary border-primary" : "bg-transparent border-slate-700"
                          }`}>
                            {isSelected(lead.id) && <Check size={14} className="text-white" />}
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-[15px] group-hover:text-primary transition-colors tracking-tight">
                              {lead.name}
                            </span>
                            <span className="text-slate-500 text-xs mt-1 font-medium">{lead.company}</span>
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black ${getScoreColor(lead.score)} shadow-inner`}>
                            <Zap size={10} className="fill-current" />
                            {lead.score || 0}%
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)} shadow-lg`}>
                            {lead.status}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-white font-black font-mono tracking-tight text-base">
                          ${Number(lead.value).toLocaleString()}
                        </td>

                        <td className="px-8 py-5 text-right pr-12">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <button
                              onClick={(e) => handleDelete(e, lead.id, lead.name)}
                              className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                            <ChevronRight size={20} className="text-slate-700" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <LeadDetailModal lead={selectedLead} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} />
    </div>
  );
};
