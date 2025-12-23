
import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Priority, TaskStatus } from '../types';
import { CheckCircle2, Circle, Calendar, User, LayoutGrid, List, Plus, Clock, AlertCircle } from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, updateTask } = useCRM();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const nextStatus = task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed;
        updateTask({ ...task, status: nextStatus });
    }
  };

  const getPriorityColor = (priority: Priority) => {
     switch(priority) {
         case Priority.High: return 'bg-red-500/10 text-red-400 border-red-500/20';
         case Priority.Medium: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
         default: return 'bg-green-500/10 text-green-400 border-green-500/20';
     }
  };

  const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: TaskStatus) => {
      const id = e.dataTransfer.getData('taskId');
      const task = tasks.find(t => t.id === id);
      if (task && task.status !== status) {
          updateTask({ ...task, status });
      }
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData('taskId', id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col pb-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Tarefas</h1>
            <p className="text-textSecondary mt-1">Acompanhe as atividades e pendências da equipe.</p>
        </div>
        <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                <Plus size={18}/> Nova Tarefa
            </button>
            <div className="flex bg-surfaceHighlight p-1 rounded-lg border border-borderColor">
            <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-surface text-textPrimary shadow' : 'text-textSecondary hover:text-textPrimary'}`}
            >
                <List size={18} />
            </button>
            <button 
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'board' ? 'bg-surface text-textPrimary shadow' : 'text-textSecondary hover:text-textPrimary'}`}
            >
                <LayoutGrid size={18} />
            </button>
            </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-surface border border-borderColor rounded-2xl overflow-hidden shadow-xl">
            {tasks.map((task, index) => (
            <div 
                key={task.id} 
                className={`p-5 flex items-center justify-between group transition-colors hover:bg-surfaceHighlight/30 cursor-pointer ${index !== tasks.length - 1 ? 'border-b border-borderColor' : ''}`}
            >
                <div className="flex items-start gap-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}
                    className={`mt-1 transition-colors ${task.status === TaskStatus.Completed ? 'text-emerald-500' : 'text-textSecondary hover:text-primary'}`}
                >
                    {task.status === TaskStatus.Completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                
                <div>
                    <h4 className={`text-base font-medium transition-all ${task.status === TaskStatus.Completed ? 'text-textSecondary line-through' : 'text-textPrimary group-hover:text-primary'}`}>
                    {task.title}
                    </h4>
                    <p className="text-sm text-textSecondary mt-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1.5 text-xs ${task.priority === Priority.High ? 'text-red-400' : 'text-textSecondary'}`}>
                        <Calendar size={14} />
                        <span>{task.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                        <User size={14} />
                        <span>{task.assignedTo}</span>
                    </div>
                    </div>
                </div>
                </div>

                <div className="flex items-center">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
                </div>
            </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
            {[TaskStatus.Pending, TaskStatus.InProgress, TaskStatus.Completed].map((status) => (
                <div 
                    key={status} 
                    className="flex flex-col bg-surface/30 rounded-2xl border border-borderColor h-full backdrop-blur-sm"
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, status)}
                >
                    <div className="p-4 border-b border-borderColor bg-surface/50 rounded-t-2xl flex justify-between items-center">
                        <h3 className="font-bold text-textPrimary flex items-center gap-2">
                            {status === TaskStatus.Completed && <CheckCircle2 size={16} className="text-emerald-500"/>}
                            {status === TaskStatus.InProgress && <Clock size={16} className="text-blue-500"/>}
                            {status === TaskStatus.Pending && <Circle size={16} className="text-textSecondary"/>}
                            {status}
                        </h3>
                        <span className="text-xs bg-surfaceHighlight px-2 py-0.5 rounded text-textSecondary font-mono">{tasks.filter(t => t.status === status).length}</span>
                    </div>
                    <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                        {tasks.filter(t => t.status === status).map(task => (
                            <div 
                                key={task.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, task.id)}
                                className={`
                                    bg-surface border border-borderColor p-4 rounded-xl shadow-lg cursor-grab active:cursor-grabbing hover:border-textSecondary transition-colors
                                    ${task.status === TaskStatus.Completed ? 'opacity-60' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                    {task.priority === Priority.High && task.status !== TaskStatus.Completed && (
                                        <AlertCircle size={14} className="text-red-500 animate-pulse"/>
                                    )}
                                </div>
                                <h4 className={`font-medium text-sm mb-1 ${task.status === TaskStatus.Completed ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>{task.title}</h4>
                                <p className="text-xs text-textSecondary mb-3 line-clamp-2">{task.description}</p>
                                <div className="flex items-center justify-between border-t border-borderColor pt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                                        <Calendar size={12} />
                                        <span>{task.dueDate}</span>
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-surfaceHighlight text-[10px] text-textPrimary flex items-center justify-center border border-borderColor">
                                        {task.assignedTo.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
