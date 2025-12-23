
export enum LeadStatus {
  New = 'Novo',
  Contacted = 'Contatado',
  Proposal = 'Proposta',
  Negotiation = 'Negociação',
  Closed = 'Fechado',
  Loss = 'Perdido/Reembolso'
}

export enum TaskStatus {
  Pending = 'Pendente',
  InProgress = 'Em Progresso',
  Completed = 'Concluído'
}

export enum Priority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Vendas' | 'Suporte';
  avatar: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  content: string;
  date: string;
  user: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number;
  last_interaction: string;
  priority: Priority;
  owner: string; 
  tags: string[];
  history: Activity[];
  score?: number; // Calculated field
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo: string;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  leads: Lead[];
}

export interface ChartData {
  name: string;
  value: number;
  uv?: number; // Secondary metric
  amt?: number; // Tertiary metric
  [key: string]: any;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  sales?: number;
  target?: number;
  dealsClosed?: number;
  trend?: number;
  email?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export type Theme = 'dark' | 'light';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface CRMContextType {
  leads: Lead[];
  tasks: Task[];
  teamMembers: TeamMember[];
  user: User | null;
  theme: Theme;
  notifications: Notification[];
  toasts: ToastMessage[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  // Updated to return Promise<boolean> to allow success checking in UI components
  addLead: (lead: Lead) => Promise<boolean>;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  deleteLeads: (ids: string[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'avatar'>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  addToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  markNotificationRead: (id: string) => void;
  updateUser: (data: Partial<User>) => void;
}
