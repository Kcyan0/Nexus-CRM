
import { Lead, LeadStatus, Priority, Task, TaskStatus, ChartData, TeamMember, Notification } from './types';

export const MOCK_USER = {
  id: 'u1',
  name: 'Alexandre Silva',
  email: 'alex.silva@nexuscrm.com.br',
  role: 'Admin' as const,
  avatar: 'https://picsum.photos/seed/alex/200/200',
};

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'Sarah Costa',
    company: 'Skynet Sistemas',
    email: 'sarah@skynet.com',
    phone: '(11) 99999-1234',
    status: LeadStatus.New,
    value: 12500,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: '2 horas atrás',
    priority: Priority.High,
    owner: 'Alexandre Silva',
    tags: ['Tecnologia', 'Enterprise'],
    history: [
      { id: 'h1', type: 'note', content: 'Contato inicial via LinkedIn.', date: '25/10/2023 10:00', user: 'Alexandre Silva' },
      { id: 'h2', type: 'status_change', content: 'Status alterado para Novo', date: '25/10/2023 09:55', user: 'Sistema' }
    ]
  },
  {
    id: 'l2',
    name: 'João Andrade',
    company: 'MetaCortex S.A.',
    email: 'joao@metacortex.com',
    phone: '(11) 98888-7777',
    status: LeadStatus.Proposal,
    value: 45000,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: '1 dia atrás',
    priority: Priority.High,
    owner: 'Tainá Moura',
    tags: ['Software', 'Indicação'],
    history: [
        { id: 'h3', type: 'email', content: 'Proposta v2.0 enviada', date: '24/10/2023 14:00', user: 'Tainá Moura' },
        { id: 'h4', type: 'meeting', content: 'Reunião de descoberta com CTO.', date: '22/10/2023 11:00', user: 'Tainá Moura' }
    ]
  },
  {
    id: 'l3',
    name: 'Eliana Ribeiro',
    company: 'Weyland Logística',
    email: 'eliana@weyland.com',
    phone: '(21) 97777-6666',
    status: LeadStatus.Contacted,
    value: 8000,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: '3 dias atrás',
    priority: Priority.Medium,
    owner: 'Alexandre Silva',
    tags: ['Logística', 'Q4'],
    history: [
         { id: 'h5', type: 'call', content: 'Discutido requisitos de envio.', date: '20/10/2023 16:30', user: 'Alexandre Silva' }
    ]
  },
  {
    id: 'l4',
    name: 'Antônio Stark',
    company: 'Indústrias Stark',
    email: 'tony@stark.com',
    phone: '(11) 91111-2222',
    status: LeadStatus.Negotiation,
    value: 150000,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: '5 horas atrás',
    priority: Priority.High,
    owner: 'Patrícia Potes',
    tags: ['VIP', 'Defesa'],
    history: [
        { id: 'h6', type: 'note', content: 'Cliente solicitou 5% de desconto no pedido em massa.', date: '26/10/2023 09:15', user: 'Patrícia Potes' }
    ]
  },
  {
    id: 'l5',
    name: 'Bruno Wayne',
    company: 'Wayne Empreendimentos',
    email: 'bruce@wayne.com',
    phone: '(11) 92222-3333',
    status: LeadStatus.Closed,
    value: 85000,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: '1 semana atrás',
    priority: Priority.Low,
    owner: 'Alfredo P.',
    tags: ['Finanças', 'Legado'],
    history: [
        { id: 'h7', type: 'status_change', content: 'Negócio Fechado e Ganho!', date: '15/10/2023 17:00', user: 'Alfredo P.' }
    ]
  },
  {
    id: 'l6',
    name: 'Diana Prince',
    company: 'Artes Temiscira',
    email: 'diana@amazon.com',
    phone: '(61) 93333-4444',
    status: LeadStatus.New,
    value: 5000,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: 'Agora mesmo',
    priority: Priority.Medium,
    owner: 'Estevão T.',
    tags: ['Artes', 'ONG'],
    history: []
  },
  {
    id: 'l7',
    name: 'Walter Branco',
    company: 'Matéria Cinza',
    email: 'heisenberg@quimica.com',
    phone: '(51) 94444-5555',
    status: LeadStatus.Contacted,
    value: 22000,
    // Fix: Changed lastInteraction to last_interaction
    last_interaction: '2 dias atrás',
    priority: Priority.High,
    owner: 'Jesse P.',
    tags: ['Química'],
    history: [
        { id: 'h8', type: 'email', content: 'Catálogo de produtos enviado.', date: '23/10/2023 13:00', user: 'Jesse P.' }
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Preparar Relatório Q3',
    description: 'Compilar dados de vendas para a reunião da diretoria.',
    dueDate: '15/11/2023',
    status: TaskStatus.InProgress,
    priority: Priority.High,
    assignedTo: 'Alexandre Silva'
  },
  {
    id: 't2',
    title: 'Follow-up com Indústrias Stark',
    description: 'Enviar a version atualizada do contrato.',
    dueDate: '12/11/2023',
    status: TaskStatus.Pending,
    priority: Priority.High,
    assignedTo: 'Patrícia Potes'
  },
  {
    id: 't3',
    title: 'Atualizar Contatos no CRM',
    description: 'Limpar entradas duplicadas.',
    dueDate: '20/11/2023',
    status: TaskStatus.Completed,
    priority: Priority.Low,
    assignedTo: 'Estagiário'
  },
  {
    id: 't4',
    title: 'Agendar Demo com Skynet',
    description: 'Coordenar horário com Sarah.',
    dueDate: '16/11/2023',
    status: TaskStatus.Pending,
    priority: Priority.Medium,
    assignedTo: 'Alexandre Silva'
  }
];

export const REVENUE_DATA: ChartData[] = [
  { name: 'Jan', value: 4000, uv: 2400 },
  { name: 'Fev', value: 3000, uv: 1398 },
  { name: 'Mar', value: 2000, uv: 9800 },
  { name: 'Abr', value: 2780, uv: 3908 },
  { name: 'Mai', value: 1890, uv: 4800 },
  { name: 'Jun', value: 2390, uv: 3800 },
  { name: 'Jul', value: 3490, uv: 4300 },
  { name: 'Ago', value: 5490, uv: 5300 },
  { name: 'Set', value: 4490, uv: 4100 },
  { name: 'Out', value: 6490, uv: 5800 },
  { name: 'Nov', value: 7490, uv: 6200 },
  { name: 'Dez', value: 8490, uv: 7100 },
];

export const PIPELINE_DATA: ChartData[] = [
  { name: 'Prospecção', value: 400 },
  { name: 'Qualificado', value: 300 },
  { name: 'Proposta', value: 300 },
  { name: 'Negociação', value: 200 },
  { name: 'Fechado Ganho', value: 100 },
];

export const LEAD_SOURCE_DATA: ChartData[] = [
  { name: 'LinkedIn', value: 35 },
  { name: 'Site', value: 25 },
  { name: 'Indicação', value: 20 },
  { name: 'Cold Call', value: 15 },
  { name: 'Outros', value: 5 },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alexandre Silva', role: 'Líder de Vendas', avatar: 'https://picsum.photos/seed/alex/200/200', sales: 125000, target: 150000, dealsClosed: 12, trend: 15 },
  { id: 'm2', name: 'Patrícia Potes', role: 'Vendas Sênior', avatar: 'https://picsum.photos/seed/pepper/200/200', sales: 210000, target: 180000, dealsClosed: 18, trend: 25 },
  { id: 'm3', name: 'Tainá Moura', role: 'Executiva de Vendas', avatar: 'https://picsum.photos/seed/trinity/200/200', sales: 98000, target: 120000, dealsClosed: 8, trend: -5 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Novo Lead Atribuído', message: 'Você foi atribuído ao lead Sarah Costa', time: '10 min atrás', read: false, type: 'info' },
  { id: 'n2', title: 'Tarefa Atrasada', message: 'Follow-up com Indústrias Stark venceu ontem', time: '2 horas atrás', read: false, type: 'alert' },
  { id: 'n3', title: 'Negócio Fechado', message: 'Negócio com Bruno Wayne marcado como Ganho', time: '1 dia atrás', read: true, type: 'success' },
];