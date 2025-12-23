
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { PIPELINE_DATA, REVENUE_DATA } from '../constants';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const MONTHLY_PERFORMANCE = [
  { name: 'Jan', sales: 4000, target: 2400 },
  { name: 'Fev', sales: 3000, target: 1398 },
  { name: 'Mar', sales: 2000, target: 9800 },
  { name: 'Abr', sales: 2780, target: 3908 },
  { name: 'Mai', sales: 1890, target: 4800 },
  { name: 'Jun', sales: 2390, target: 3800 },
];

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Análise & Relatórios</h1>
            <p className="text-slate-400 mt-1">Aprofunde-se nas métricas de vendas.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center bg-surface border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
                <Calendar size={16} className="mr-2 text-slate-500"/>
                <span>01 Out - 31 Out, 2023</span>
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                Baixar PDF
            </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 shadow-xl">
             <p className="text-slate-500 text-xs font-bold uppercase mb-2">Crescimento de Receita</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">$45,200</h3>
                <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold">
                    <ArrowUpRight size={14} className="mr-1"/> +12%
                </span>
             </div>
             <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[70%] rounded-full"></div>
             </div>
             <p className="text-xs text-slate-500 mt-2">Vs $39,800 mês passado</p>
          </div>

          <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 shadow-xl">
             <p className="text-slate-500 text-xs font-bold uppercase mb-2">Conversão de Negócios</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">24%</h3>
                <span className="flex items-center text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs font-bold">
                    <ArrowDownRight size={14} className="mr-1"/> -2.5%
                </span>
             </div>
             <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[24%] rounded-full"></div>
             </div>
             <p className="text-xs text-slate-500 mt-2">Vs 26.5% mês passado</p>
          </div>

          <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 shadow-xl">
             <p className="text-slate-500 text-xs font-bold uppercase mb-2">Tempo Médio de Fechamento</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">18 Dias</h3>
                <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold">
                    <ArrowUpRight size={14} className="mr-1"/> -3 dias
                </span>
             </div>
             <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
             </div>
             <p className="text-xs text-slate-500 mt-2">Mais rápido que a média</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales vs Target */}
        <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Vendas vs Meta</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6B7280" tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: '#374151', color: '#F3F4F6', borderRadius: '0.75rem' }}
                   cursor={{fill: '#1F2937'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="sales" fill="#8B5CF6" name="Vendas Reais" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="target" fill="#1F2937" stroke="#3B82F6" strokeWidth={1} strokeDasharray="4 4" name="Meta" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Distribuição do Pipeline</h3>
          <div className="h-[350px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIPELINE_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  innerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                  paddingAngle={5}
                >
                  {PIPELINE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: '#374151', color: '#F3F4F6', borderRadius: '0.75rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <TrendingUp className="text-slate-600 w-12 h-12 opacity-50"/>
             </div>
          </div>
        </div>

        {/* Lead Origins */}
        <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 shadow-xl lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6">Tendência de Aquisição de Leads</h3>
             <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6B7280" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: '#374151', color: '#F3F4F6', borderRadius: '0.75rem' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke:'#fff'}} activeDot={{ r: 6, fill: '#fff' }} />
                <Line type="monotone" dataKey="uv" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, fill: '#F59E0B', strokeWidth: 2, stroke:'#fff'}} activeDot={{ r: 6, fill: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
