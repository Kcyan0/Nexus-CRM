
import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  colorClass: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon: Icon, colorClass, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
  const isCurrency = typeof value === 'string' && value.includes('$');

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) return;

    let totalDuration = 1500;
    let incrementTime = (totalDuration / end) * 2;
    // Cap animation speed for large numbers
    if (incrementTime < 10) incrementTime = 10;
    if (incrementTime > 100) incrementTime = 100;

    let timer = setInterval(() => {
      start += Math.ceil(end / 50); // Increment by chunks
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(start);
    }, 20);

    return () => clearInterval(timer);
  }, [numericValue]);

  const formattedValue = isCurrency 
    ? `$${displayValue.toLocaleString()}` 
    : displayValue.toLocaleString();

  return (
    <div 
      className="bg-surface border border-surfaceHighlight rounded-xl p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 shadow-lg shadow-black/20 group relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background glow effect */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${colorClass.replace('bg-', 'bg-')} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{formattedValue}</h3>
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-bold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className="bg-surfaceHighlight/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                 {trendUp ? '↑' : '↓'} {trend}
              </span>
              <span className="ml-2 text-slate-500 font-medium">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 border border-white/5 shadow-inner`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};
