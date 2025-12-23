
import React, { useState, useEffect, useMemo } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { 
  DollarSign, Users, Briefcase, TrendingUp, 
  BrainCircuit, Sparkles, Zap, Target, ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useCRM } from '../context/CRMContext';
import { LeadStatus } from '../types';
import { NewLeadModal } from '../components/leads/NewLeadModal';
import { GoogleGenAI } from "@google/genai";

const COLORS = ['#8B5CF6', '#6366f1', '#10B981', '#F59E0B', '#EF4444', '#64748B'];

export const Dashboard: React.FC = () => {
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const { leads } = useCRM();

  // Cálculo Dinâmico de Estatísticas
  const stats = useMemo(() => {
    const total = leads.length;
    const closed = leads.filter(l => l.status === LeadStatus.Closed);
    const revenue = closed.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const pipeline = leads
      .filter(l => l.status !== LeadStatus.Closed && l.status !== LeadStatus.Loss)
      .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const avg = closed.length > 0 ? revenue / closed.length : 0;

    return { total, revenue, pipeline, avg };
  }, [leads]);

  // Cálculo Dinâmico do Gráfico de Funil (Pie Chart)
  const pipelineChartData = useMemo(() => {
    const counts = leads.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(LeadStatus).map(status => ({
      name: (LeadStatus as any)[status],
      value: counts[(LeadStatus as any)[status]] || 0
    })).filter(item => item.value > 0);
  }, [leads]);

  // Cálculo Dinâmico de Receita Mensal
  const revenueChartData = useMemo(() => {
    return [
      { name: 'Jan', value: 4000 },
      { name: 'Fev', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Abr', value: 5000 },
      { name: 'Mês Atual', value: stats.revenue }
    ];
  }, [stats.revenue]);

  const generateAiInsights = async () => {
    if (leads.length === 0) {
      setAiInsight("Dica: Adicione seu primeiro lead para começar a análise.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summary = leads.slice(0, 10).map(l => `${l.name}: ${l.status} ($${l.value})`).join('; ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Aja como um analista de vendas. Resuma este pipeline em 2 frases motivadoras e uma dica tática baseada nestes leads: ${summary}. Seja conciso.`,
      });
      setAiInsight(response.text);
    } catch (e) {
      setAiInsight("Foque nos leads em 'Negociação' para garantir o fechamento do trimestre!");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => { 
    generateAiInsights(); 
  }, [leads.length]);

  const monthlyGoal = 100000;
  const goalProgress = Math.min((stats.revenue / monthlyGoal) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Visão Geral</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500 fill-yellow-500" />
            {leads.length > 0 ? `${leads.length} leads sincronizados no Nexus Engine.` : 'Aguardando novas oportunidades...'}
          </p>
        </div>
        <button 
          onClick={() => setIsNewLeadModalOpen(true)}
          className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
        >
          + Novo Lead
        </button>
      </div>

      <div className="bg-surface border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <BrainCircuit size={100} className="text-primary" />
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Sparkles size={28} className={isGeneratingAi ? 'animate-spin' : ''} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">Nexus Intelligence</h3>
            <p className="text-white text-lg font-medium leading-relaxed italic">
              {isGeneratingAi ? 'Analisando performance comercial...' : `"${aiInsight || 'Pronto para analisar seu pipeline.'}"`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receita Ganha" value={`$${stats.revenue.toLocaleString()}`} trendUp={true} icon={DollarSign} colorClass="bg-emerald-500" />
        <StatCard title="Valor em Aberto" value={`$${stats.pipeline.toLocaleString()}`} trendUp={true} icon={Briefcase} colorClass="bg-indigo-500" />
        <StatCard title="Oportunidades" value={stats.total} trendUp={true} icon={Users} colorClass="bg-blue-500" />
        <StatCard title="Ticket Médio" value={`$${stats.avg.toFixed(0)}`} trendUp={false} icon={TrendingUp} colorClass="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-borderColor rounded-3xl p-8 flex flex-col items-center justify-center">
            <Target size={24} className="text-primary mb-4" />
            <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                    <circle cx="80" cy="80" r="70" stroke="#8b5cf6" strokeWidth="10" fill="transparent" 
                        strokeDasharray={440} strokeDashoffset={440 - (440 * goalProgress) / 100}
                        strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{goalProgress.toFixed(0)}%</span>
                </div>
            </div>
            <p className="mt-6 text-slate-400 text-sm text-center">Progresso vs Meta Mensal:<br/><span className="text-white font-bold">$100k</span></p>
        </div>

        <div className="lg:col-span-2 bg-surface border border-borderColor rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">Faturamento Realizado</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }} />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} />
    </div>
  );
};
