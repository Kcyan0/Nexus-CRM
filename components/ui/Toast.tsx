
import React from 'react';
import { ToastMessage } from '../../types';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />
  };

  const borders = {
    success: 'border-emerald-500/50',
    error: 'border-red-500/50',
    info: 'border-blue-500/50'
  };

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-xl bg-surface border ${borders[toast.type]} shadow-2xl backdrop-blur-md
      transform transition-all duration-300 animate-slide-in mb-3 w-80 pointer-events-auto
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-textPrimary">{toast.title}</h4>
        <p className="text-xs text-textSecondary mt-1">{toast.message}</p>
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="text-textSecondary hover:text-textPrimary transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
