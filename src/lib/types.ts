// Tipos para o sistema multi-prefeituras

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  cidade: string;
  bairro: string;
  tipo: 'cidadao' | 'funcionario' | 'admin_prefeitura' | 'super_admin';
  prefeituraId?: string;
  ativo: boolean;
  dataCriacao: string;
  ultimoAcesso?: string;
}

export interface Prefeitura {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  cnpj: string;
  prefeito: string;
  logo?: string;
  brasao?: string;
  corPrimaria: string;
  corSecundaria: string;
  ativa: boolean;
  dataCriacao: string;
  configuracoes: {
    modulosAtivos: string[];
    integracoes: IntegracaoAPI[];
    limiteUsuarios: number;
  };
  contato: {
    telefone: string;
    email: string;
    endereco: string;
  };
}

export interface IntegracaoAPI {
  id: string;
  nome: string;
  tipo: 'iptu' | 'protocolo' | 'saude' | 'educacao' | 'outros';
  url: string;
  chaveApi?: string;
  ativa: boolean;
  configuracoes: Record<string, any>;
}

export interface Solicitacao {
  id: string;
  protocolo: string;
  tipo: string;
  descricao: string;
  status: 'pendente' | 'andamento' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  data: string;
  dataAtualizacao?: string;
  localizacao: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  fotos?: string[];
  usuarioId: string;
  prefeituraId: string;
  responsavelId?: string;
  observacoes?: string;
  avaliacaoUsuario?: {
    nota: number;
    comentario: string;
  };
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  dataFim?: string;
  local: string;
  endereco?: string;
  tipo: 'cultural' | 'esportivo' | 'oficial' | 'saude' | 'educacao';
  prefeituraId: string;
  organizador: string;
  capacidade?: number;
  inscricoesAbertas: boolean;
  gratuito: boolean;
  valor?: number;
  imagem?: string;
  ativo: boolean;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'emergencia' | 'comunicado' | 'lembrete' | 'sistema';
  prioridade: 'baixa' | 'media' | 'alta';
  data: string;
  dataExpiracao?: string;
  prefeituraId?: string; // null = notificação global
  usuarioId?: string; // null = para todos os usuários
  lida: boolean;
  canais: ('app' | 'sms' | 'email' | 'push')[];
  metadados?: Record<string, any>;
}

export interface Sessao {
  id: string;
  usuarioId: string;
  token: string;
  tipo: 'cidadao' | 'funcionario' | 'admin_prefeitura' | 'super_admin';
  prefeituraId?: string;
  dataInicio: string;
  dataExpiracao: string;
  ativa: boolean;
  dispositivo?: string;
  ip?: string;
}

export interface RecuperacaoSenha {
  id: string;
  usuarioId: string;
  codigo: string;
  tipo: 'sms' | 'email';
  dataEnvio: string;
  dataExpiracao: string;
  usado: boolean;
  tentativas: number;
}

export interface LogAuditoria {
  id: string;
  usuarioId: string;
  acao: string;
  recurso: string;
  detalhes: Record<string, any>;
  ip: string;
  userAgent?: string;
  data: string;
  prefeituraId?: string;
}

export interface Estatisticas {
  prefeituraId?: string; // null = estatísticas globais
  periodo: {
    inicio: string;
    fim: string;
  };
  usuarios: {
    total: number;
    novos: number;
    ativos: number;
  };
  solicitacoes: {
    total: number;
    pendentes: number;
    emAndamento: number;
    concluidas: number;
    canceladas: number;
    tempoMedioResolucao: number;
  };
  eventos: {
    total: number;
    participantes: number;
  };
  notificacoes: {
    enviadas: number;
    lidas: number;
    taxaLeitura: number;
  };
  acessos: {
    total: number;
    unicos: number;
    picos: Array<{
      data: string;
      acessos: number;
    }>;
  };
}

export interface ConfiguracaoSistema {
  id: string;
  chave: string;
  valor: any;
  tipo: 'string' | 'number' | 'boolean' | 'object' | 'array';
  descricao: string;
  categoria: 'geral' | 'seguranca' | 'notificacoes' | 'integracao';
  editavel: boolean;
  dataAtualizacao: string;
}

// Tipos para formulários e validações
export interface CadastroUsuario {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  cidade: string;
  bairro: string;
  senha: string;
  confirmarSenha: string;
  aceitouTermos: boolean;
}

export interface LoginForm {
  cpf: string;
  senha: string;
  lembrarMe: boolean;
}

export interface RecuperarSenhaForm {
  cpf: string;
  metodo: 'sms' | 'email';
}

export interface RedefinirSenhaForm {
  codigo: string;
  novaSenha: string;
  confirmarSenha: string;
}

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  sucesso: boolean;
  dados?: T;
  mensagem?: string;
  erro?: string;
  codigo?: number;
}

export interface PaginacaoResponse<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// Tipos para contextos React
export interface AuthContextType {
  usuario: Usuario | null;
  sessao: Sessao | null;
  prefeitura: Prefeitura | null;
  carregando: boolean;
  login: (cpf: string, senha: string) => Promise<boolean>;
  logout: () => void;
  atualizarUsuario: (dados: Partial<Usuario>) => Promise<boolean>;
  verificarPermissao: (permissao: string) => boolean;
}

export interface AppContextType {
  tema: 'claro' | 'escuro';
  idioma: 'pt-BR' | 'en-US' | 'es-ES';
  notificacoes: Notificacao[];
  configuracoes: Record<string, any>;
  alterarTema: (tema: 'claro' | 'escuro') => void;
  alterarIdioma: (idioma: string) => void;
  marcarNotificacaoLida: (id: string) => void;
  atualizarConfiguracao: (chave: string, valor: any) => void;
}

// Enums úteis
export enum TipoUsuario {
  CIDADAO = 'cidadao',
  FUNCIONARIO = 'funcionario',
  ADMIN_PREFEITURA = 'admin_prefeitura',
  SUPER_ADMIN = 'super_admin'
}

export enum StatusSolicitacao {
  PENDENTE = 'pendente',
  ANDAMENTO = 'andamento',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada'
}

export enum TipoNotificacao {
  EMERGENCIA = 'emergencia',
  COMUNICADO = 'comunicado',
  LEMBRETE = 'lembrete',
  SISTEMA = 'sistema'
}

export enum ModuloSistema {
  SOLICITACOES = 'solicitacoes',
  OUVIDORIA = 'ouvidoria',
  AGENDA = 'agenda',
  SAUDE = 'saude',
  EDUCACAO = 'educacao',
  TRIBUTOS = 'tributos',
  MOBILIDADE = 'mobilidade',
  TURISMO = 'turismo',
  TRANSPARENCIA = 'transparencia'
}