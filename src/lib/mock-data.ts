// Dados mock para desenvolvimento e demonstração

import { 
  Usuario, 
  Prefeitura, 
  Solicitacao, 
  Evento, 
  Notificacao, 
  IntegracaoAPI,
  Estatisticas,
  TipoUsuario,
  StatusSolicitacao,
  TipoNotificacao
} from './types';
import { obterDataISOBrasilia } from './utils';

// Usuários mock
export const usuariosMock: Usuario[] = [
  {
    id: '1',
    nome: 'João Silva Santos',
    cpf: '123.456.789-01',
    telefone: '(11) 99999-1234',
    email: 'joao.silva@email.com',
    cidade: 'São Paulo',
    bairro: 'Centro',
    tipo: TipoUsuario.CIDADAO,
    prefeituraId: '1',
    ativo: true,
    dataCriacao: '2024-01-15',
    ultimoAcesso: '2024-01-20'
  },
  {
    id: '2',
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-09',
    telefone: '(11) 88888-5678',
    email: 'maria.oliveira@prefeitura.sp.gov.br',
    cidade: 'São Paulo',
    bairro: 'Vila Madalena',
    tipo: TipoUsuario.FUNCIONARIO,
    prefeituraId: '1',
    ativo: true,
    dataCriacao: '2024-01-10',
    ultimoAcesso: '2024-01-20'
  },
  {
    id: '3',
    nome: 'Carlos Eduardo Mendes',
    cpf: '456.789.123-45',
    telefone: '(11) 77777-9012',
    email: 'carlos.mendes@prefeitura.sp.gov.br',
    cidade: 'São Paulo',
    bairro: 'Jardins',
    tipo: TipoUsuario.ADMIN_PREFEITURA,
    prefeituraId: '1',
    ativo: true,
    dataCriacao: '2024-01-05',
    ultimoAcesso: '2024-01-20'
  },
  {
    id: '4',
    nome: 'Ana Paula Rodrigues',
    cpf: '789.123.456-78',
    telefone: '(21) 66666-3456',
    email: 'ana.rodrigues@email.com',
    cidade: 'Rio de Janeiro',
    bairro: 'Copacabana',
    tipo: TipoUsuario.CIDADAO,
    prefeituraId: '2',
    ativo: true,
    dataCriacao: '2024-01-12',
    ultimoAcesso: '2024-01-19'
  },
  {
    id: '5',
    nome: 'Administrador Sistema',
    cpf: '000.000.000-00',
    telefone: '(11) 99999-0000',
    email: 'admin@cidadeconectada.com.br',
    cidade: 'Sistema',
    bairro: 'Central',
    tipo: TipoUsuario.SUPER_ADMIN,
    ativo: true,
    dataCriacao: '2024-01-01',
    ultimoAcesso: '2024-01-20'
  }
];

// Prefeituras mock
export const prefeiturasMock: Prefeitura[] = [
  {
    id: '1',
    nome: 'Prefeitura Municipal de São Paulo',
    cidade: 'São Paulo',
    estado: 'SP',
    cnpj: '46.395.000/0001-39',
    prefeito: 'Ricardo Nunes',
    logo: '/logos/sp-logo.png',
    brasao: '/brasoes/sp-brasao.png',
    corPrimaria: '#0066CC',
    corSecundaria: '#004499',
    ativa: true,
    dataCriacao: '2024-01-01',
    configuracoes: {
      modulosAtivos: ['solicitacoes', 'ouvidoria', 'agenda', 'saude', 'educacao', 'tributos'],
      integracoes: [
        {
          id: '1',
          nome: 'Sistema IPTU SP',
          tipo: 'iptu',
          url: 'https://api.prefeitura.sp.gov.br/iptu',
          ativa: true,
          configuracoes: {
            versao: 'v2',
            timeout: 30000
          }
        }
      ],
      limiteUsuarios: 10000
    },
    contato: {
      telefone: '(11) 3113-9000',
      email: 'contato@prefeitura.sp.gov.br',
      endereco: 'Viaduto do Chá, 15 - Centro, São Paulo - SP'
    }
  },
  {
    id: '2',
    nome: 'Prefeitura Municipal do Rio de Janeiro',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cnpj: '42.498.733/0001-48',
    prefeito: 'Eduardo Paes',
    logo: '/logos/rj-logo.png',
    brasao: '/brasoes/rj-brasao.png',
    corPrimaria: '#1E40AF',
    corSecundaria: '#1E3A8A',
    ativa: true,
    dataCriacao: '2024-01-02',
    configuracoes: {
      modulosAtivos: ['solicitacoes', 'ouvidoria', 'agenda', 'turismo', 'mobilidade'],
      integracoes: [
        {
          id: '2',
          nome: 'Sistema Carioca Digital',
          tipo: 'protocolo',
          url: 'https://api.rio.rj.gov.br/protocolo',
          ativa: true,
          configuracoes: {
            versao: 'v1',
            timeout: 25000
          }
        }
      ],
      limiteUsuarios: 8000
    },
    contato: {
      telefone: '(21) 2976-1000',
      email: 'contato@rio.rj.gov.br',
      endereco: 'Rua Afonso Cavalcanti, 455 - Cidade Nova, Rio de Janeiro - RJ'
    }
  },
  {
    id: '3',
    nome: 'Prefeitura Municipal de Belo Horizonte',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cnpj: '18.715.383/0001-40',
    prefeito: 'Fuad Noman',
    logo: '/logos/bh-logo.png',
    brasao: '/brasoes/bh-brasao.png',
    corPrimaria: '#2563EB',
    corSecundaria: '#1D4ED8',
    ativa: false,
    dataCriacao: '2024-01-03',
    configuracoes: {
      modulosAtivos: ['solicitacoes', 'ouvidoria', 'agenda'],
      integracoes: [],
      limiteUsuarios: 5000
    },
    contato: {
      telefone: '(31) 3277-4000',
      email: 'contato@pbh.gov.br',
      endereco: 'Av. Afonso Pena, 1212 - Centro, Belo Horizonte - MG'
    }
  }
];

// Solicitações mock com horário de Brasília
export const solicitacoesMock: Solicitacao[] = [
  {
    id: '1',
    protocolo: 'SOL-2024-001',
    tipo: 'Iluminação Pública',
    descricao: 'Poste queimado na Rua das Flores, 123. Deixando a rua muito escura à noite.',
    status: StatusSolicitacao.ANDAMENTO,
    prioridade: 'media',
    data: obterDataISOBrasilia(),
    dataAtualizacao: obterDataISOBrasilia(),
    localizacao: 'Rua das Flores, 123 - Centro',
    coordenadas: {
      lat: -23.5505,
      lng: -46.6333
    },
    fotos: ['/fotos/poste-queimado-1.jpg'],
    usuarioId: '1',
    prefeituraId: '1',
    responsavelId: '2',
    observacoes: 'Equipe técnica já foi acionada. Previsão de reparo em 2 dias.'
  },
  {
    id: '2',
    protocolo: 'SOL-2024-002',
    tipo: 'Buraco na Via',
    descricao: 'Buraco grande na Av. Principal, próximo ao número 500. Está causando danos aos veículos.',
    status: StatusSolicitacao.CONCLUIDA,
    prioridade: 'alta',
    data: obterDataISOBrasilia(),
    dataAtualizacao: obterDataISOBrasilia(),
    localizacao: 'Av. Principal, 500 - Zona Norte',
    coordenadas: {
      lat: -23.5489,
      lng: -46.6388
    },
    fotos: ['/fotos/buraco-via-1.jpg', '/fotos/buraco-via-2.jpg'],
    usuarioId: '1',
    prefeituraId: '1',
    responsavelId: '2',
    observacoes: 'Buraco foi tapado com asfalto. Serviço concluído.',
    avaliacaoUsuario: {
      nota: 5,
      comentario: 'Excelente atendimento! Problema resolvido rapidamente.'
    }
  },
  {
    id: '3',
    protocolo: 'SOL-2024-003',
    tipo: 'Coleta de Lixo',
    descricao: 'Lixo acumulado na Rua dos Jardins há mais de uma semana.',
    status: StatusSolicitacao.PENDENTE,
    prioridade: 'media',
    data: obterDataISOBrasilia(),
    localizacao: 'Rua dos Jardins, 200 - Vila Madalena',
    usuarioId: '1',
    prefeituraId: '1'
  },
  {
    id: '4',
    protocolo: 'RJ-2024-001',
    tipo: 'Limpeza de Praia',
    descricao: 'Muito lixo acumulado na praia de Copacabana, próximo ao posto 4.',
    status: StatusSolicitacao.ANDAMENTO,
    prioridade: 'alta',
    data: obterDataISOBrasilia(),
    localizacao: 'Praia de Copacabana, Posto 4',
    coordenadas: {
      lat: -22.9711,
      lng: -43.1822
    },
    usuarioId: '4',
    prefeituraId: '2'
  }
];

// Eventos mock
export const eventosMock: Evento[] = [
  {
    id: '1',
    titulo: 'Festival de Inverno 2024',
    descricao: 'Grande festival com shows, gastronomia e atividades culturais para toda a família.',
    data: '2024-07-20',
    dataFim: '2024-07-22',
    local: 'Praça Central',
    endereco: 'Praça da Sé, s/n - Centro, São Paulo - SP',
    tipo: 'cultural',
    prefeituraId: '1',
    organizador: 'Secretaria de Cultura',
    capacidade: 5000,
    inscricoesAbertas: true,
    gratuito: true,
    imagem: '/eventos/festival-inverno.jpg',
    ativo: true
  },
  {
    id: '2',
    titulo: 'Campeonato Municipal de Futebol',
    descricao: 'Torneio entre equipes dos bairros da cidade. Inscrições abertas até 15/07.',
    data: '2024-07-25',
    dataFim: '2024-08-15',
    local: 'Estádio Municipal',
    endereco: 'Av. dos Esportes, 1000 - Vila Olímpica, São Paulo - SP',
    tipo: 'esportivo',
    prefeituraId: '1',
    organizador: 'Secretaria de Esportes',
    capacidade: 2000,
    inscricoesAbertas: true,
    gratuito: true,
    imagem: '/eventos/campeonato-futebol.jpg',
    ativo: true
  },
  {
    id: '3',
    titulo: 'Sessão Ordinária da Câmara',
    descricao: 'Sessão ordinária para votação de projetos de lei municipais.',
    data: '2024-01-25',
    local: 'Câmara Municipal',
    endereco: 'Rua da Câmara, 100 - Centro, São Paulo - SP',
    tipo: 'oficial',
    prefeituraId: '1',
    organizador: 'Câmara Municipal',
    inscricoesAbertas: false,
    gratuito: true,
    ativo: true
  },
  {
    id: '4',
    titulo: 'Rock in Rio - Cidade do Rock',
    descricao: 'O maior festival de música do mundo acontece no Rio de Janeiro.',
    data: '2024-09-15',
    dataFim: '2024-09-22',
    local: 'Cidade do Rock',
    endereco: 'Av. Salvador Allende, s/n - Barra da Tijuca, Rio de Janeiro - RJ',
    tipo: 'cultural',
    prefeituraId: '2',
    organizador: 'Rock World',
    capacidade: 100000,
    inscricoesAbertas: true,
    gratuito: false,
    valor: 350.00,
    imagem: '/eventos/rock-in-rio.jpg',
    ativo: true
  }
];

// Notificações mock
export const notificacoesMock: Notificacao[] = [
  {
    id: '1',
    titulo: 'Campanha de Vacinação Contra Gripe',
    mensagem: 'Nova campanha de vacinação contra gripe iniciada em todas as UBS da cidade. Compareça com documento e cartão SUS.',
    tipo: TipoNotificacao.COMUNICADO,
    prioridade: 'media',
    data: '2024-01-20',
    dataExpiracao: '2024-03-20',
    prefeituraId: '1',
    lida: false,
    canais: ['app', 'push', 'sms']
  },
  {
    id: '2',
    titulo: 'Alerta de Chuva Forte',
    mensagem: 'Previsão de chuva forte para hoje. Evite áreas de alagamento e mantenha-se em local seguro.',
    tipo: TipoNotificacao.EMERGENCIA,
    prioridade: 'alta',
    data: '2024-01-20',
    dataExpiracao: '2024-01-21',
    prefeituraId: '1',
    lida: false,
    canais: ['app', 'push', 'sms', 'email']
  },
  {
    id: '3',
    titulo: 'Manutenção no Sistema',
    mensagem: 'O sistema passará por manutenção programada no domingo das 2h às 6h. Alguns serviços podem ficar indisponíveis.',
    tipo: TipoNotificacao.SISTEMA,
    prioridade: 'baixa',
    data: '2024-01-19',
    dataExpiracao: '2024-01-22',
    lida: true,
    canais: ['app']
  },
  {
    id: '4',
    titulo: 'Lembrete: Vencimento IPTU',
    mensagem: 'Lembre-se: o vencimento da primeira parcela do IPTU é dia 31/01. Pague em dia e evite juros.',
    tipo: TipoNotificacao.LEMBRETE,
    prioridade: 'media',
    data: '2024-01-18',
    dataExpiracao: '2024-01-31',
    prefeituraId: '1',
    usuarioId: '1',
    lida: false,
    canais: ['app', 'email']
  },
  {
    id: '5',
    titulo: 'Interdição na Orla de Copacabana',
    mensagem: 'A orla de Copacabana estará parcialmente interditada no domingo para o evento esportivo. Planeje rotas alternativas.',
    tipo: TipoNotificacao.COMUNICADO,
    prioridade: 'media',
    data: '2024-01-19',
    dataExpiracao: '2024-01-22',
    prefeituraId: '2',
    lida: false,
    canais: ['app', 'push']
  }
];

// Estatísticas mock
export const estatisticasMock: Estatisticas[] = [
  {
    prefeituraId: '1',
    periodo: {
      inicio: '2024-01-01',
      fim: '2024-01-20'
    },
    usuarios: {
      total: 1250,
      novos: 85,
      ativos: 892
    },
    solicitacoes: {
      total: 156,
      pendentes: 23,
      emAndamento: 45,
      concluidas: 85,
      canceladas: 3,
      tempoMedioResolucao: 3.2
    },
    eventos: {
      total: 8,
      participantes: 2340
    },
    notificacoes: {
      enviadas: 1250,
      lidas: 987,
      taxaLeitura: 78.96
    },
    acessos: {
      total: 5670,
      unicos: 1180,
      picos: [
        { data: '2024-01-15', acessos: 450 },
        { data: '2024-01-18', acessos: 520 },
        { data: '2024-01-20', acessos: 380 }
      ]
    }
  },
  {
    prefeituraId: '2',
    periodo: {
      inicio: '2024-01-01',
      fim: '2024-01-20'
    },
    usuarios: {
      total: 980,
      novos: 62,
      ativos: 720
    },
    solicitacoes: {
      total: 124,
      pendentes: 18,
      emAndamento: 35,
      concluidas: 68,
      canceladas: 3,
      tempoMedioResolucao: 4.1
    },
    eventos: {
      total: 12,
      participantes: 3200
    },
    notificacoes: {
      enviadas: 980,
      lidas: 745,
      taxaLeitura: 76.02
    },
    acessos: {
      total: 4320,
      unicos: 890,
      picos: [
        { data: '2024-01-16', acessos: 320 },
        { data: '2024-01-19', acessos: 410 },
        { data: '2024-01-20', acessos: 290 }
      ]
    }
  },
  {
    // Estatísticas globais (todas as prefeituras)
    periodo: {
      inicio: '2024-01-01',
      fim: '2024-01-20'
    },
    usuarios: {
      total: 2230,
      novos: 147,
      ativos: 1612
    },
    solicitacoes: {
      total: 280,
      pendentes: 41,
      emAndamento: 80,
      concluidas: 153,
      canceladas: 6,
      tempoMedioResolucao: 3.6
    },
    eventos: {
      total: 20,
      participantes: 5540
    },
    notificacoes: {
      enviadas: 2230,
      lidas: 1732,
      taxaLeitura: 77.67
    },
    acessos: {
      total: 9990,
      unicos: 2070,
      picos: [
        { data: '2024-01-15', acessos: 770 },
        { data: '2024-01-18', acessos: 930 },
        { data: '2024-01-20', acessos: 670 }
      ]
    }
  }
];

// Integrações API mock
export const integracoesMock: IntegracaoAPI[] = [
  {
    id: '1',
    nome: 'Sistema IPTU SP',
    tipo: 'iptu',
    url: 'https://api.prefeitura.sp.gov.br/iptu',
    chaveApi: 'sp_iptu_key_123456',
    ativa: true,
    configuracoes: {
      versao: 'v2',
      timeout: 30000,
      endpoints: {
        consulta: '/consulta-iptu',
        pagamento: '/pagamento-iptu',
        segunda_via: '/segunda-via'
      }
    }
  },
  {
    id: '2',
    nome: 'Sistema Carioca Digital',
    tipo: 'protocolo',
    url: 'https://api.rio.rj.gov.br/protocolo',
    chaveApi: 'rj_protocolo_key_789012',
    ativa: true,
    configuracoes: {
      versao: 'v1',
      timeout: 25000,
      endpoints: {
        criar_protocolo: '/protocolo/criar',
        consultar_protocolo: '/protocolo/consultar',
        atualizar_status: '/protocolo/atualizar'
      }
    }
  },
  {
    id: '3',
    nome: 'Sistema de Saúde Municipal',
    tipo: 'saude',
    url: 'https://api.saude.sp.gov.br',
    chaveApi: 'sp_saude_key_345678',
    ativa: false,
    configuracoes: {
      versao: 'v3',
      timeout: 20000,
      endpoints: {
        agendamento: '/agendamento',
        consultas: '/consultas',
        vacinas: '/vacinas',
        medicamentos: '/medicamentos'
      }
    }
  }
];

// Módulos disponíveis
export const modulosDisponiveis = [
  {
    id: 'solicitacoes',
    nome: 'Solicitações de Serviços',
    descricao: 'Registro e acompanhamento de solicitações de serviços públicos',
    icone: 'FileText',
    categoria: 'essencial',
    ativo: true
  },
  {
    id: 'ouvidoria',
    nome: 'Ouvidoria Digital',
    descricao: 'Canal de comunicação para sugestões, denúncias e reclamações',
    icone: 'MessageSquare',
    categoria: 'essencial',
    ativo: true
  },
  {
    id: 'agenda',
    nome: 'Agenda Municipal',
    descricao: 'Calendário de eventos culturais, esportivos e oficiais',
    icone: 'Calendar',
    categoria: 'essencial',
    ativo: true
  },
  {
    id: 'saude',
    nome: 'Saúde',
    descricao: 'Agendamentos, consultas, vacinas e medicamentos',
    icone: 'Heart',
    categoria: 'avancado',
    ativo: false
  },
  {
    id: 'educacao',
    nome: 'Educação',
    descricao: 'Matrículas, comunicação escola-família e agenda escolar',
    icone: 'GraduationCap',
    categoria: 'avancado',
    ativo: false
  },
  {
    id: 'tributos',
    nome: 'Tributos',
    descricao: 'Consulta e pagamento de IPTU, ISS e taxas municipais',
    icone: 'CreditCard',
    categoria: 'avancado',
    ativo: false
  },
  {
    id: 'mobilidade',
    nome: 'Mobilidade Urbana',
    descricao: 'Transporte público, trânsito e rotas em tempo real',
    icone: 'Bus',
    categoria: 'avancado',
    ativo: false
  },
  {
    id: 'turismo',
    nome: 'Turismo e Cultura',
    descricao: 'Pontos turísticos, eventos culturais e roteiros',
    icone: 'MapPin',
    categoria: 'avancado',
    ativo: false
  },
  {
    id: 'transparencia',
    nome: 'Transparência',
    descricao: 'Receitas, despesas, obras e orçamento participativo',
    icone: 'BarChart3',
    categoria: 'avancado',
    ativo: false
  }
];