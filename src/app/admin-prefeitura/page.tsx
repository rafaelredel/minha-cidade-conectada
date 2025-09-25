"use client";

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  UserPlus,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Calendar,
  MapPin,
  TrendingUp,
  Bell,
  X,
  Save,
  User,
  ChevronDown,
  ChevronUp,
  Building,
  AlertCircle,
  Target,
  Timer,
  BarChart,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { usuariosMock, solicitacoesMock, eventosMock, estatisticasMock, modulosDisponiveis } from '@/lib/mock-data';
import { Usuario, Solicitacao, TipoUsuario } from '@/lib/types';
import { formatarDataBrasilia, formatarDataHoraBrasilia, formatarCPF, formatarTelefone, obterDataISOBrasilia } from '@/lib/utils';

interface PrefeituraDashboardProps {
  prefeituraId: string;
  prefeituraNome: string;
}

export default function PrefeituraDashboard({ 
  prefeituraId = '1', 
  prefeituraNome = 'Prefeitura Municipal de São Paulo' 
}: PrefeituraDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usuarios, setUsuarios] = useState<Usuario[]>(() =>
    usuariosMock.filter(u => u.prefeituraId === prefeituraId)
  );
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(() =>
    solicitacoesMock.filter(s => s.prefeituraId === prefeituraId)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipoUsuario, setSelectedTipoUsuario] = useState('todos');
  const [selectedStatusSolicitacao, setSelectedStatusSolicitacao] = useState('todos');
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showConfigModulosDialog, setShowConfigModulosDialog] = useState(false);
  
  // Estados para modais de solicitações
  const [showDetalhesDialog, setShowDetalhesDialog] = useState(false);
  const [showAtualizarDialog, setShowAtualizarDialog] = useState(false);
  const [showAtenderDialog, setShowAtenderDialog] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);
  
  // Estados para modal de usuário
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  
  // Estados para solicitações expandidas
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  
  // Estados para relatórios
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    tipo: 'funcionario' as TipoUsuario,
    bairro: '',
    senha: ''
  });

  const [modulosAtivos, setModulosAtivos] = useState<string[]>([
    'solicitacoes', 'ouvidoria', 'agenda', 'saude', 'educacao', 'tributos'
  ]);

  // Estados para atualização de solicitação
  const [dadosAtualizacao, setDadosAtualizacao] = useState({
    status: '',
    observacoes: '',
    responsavelId: ''
  });

  const [observacoesAtendimento, setObservacoesAtendimento] = useState('');

  // Estados para edição de usuário
  const [dadosEdicaoUsuario, setDadosEdicaoUsuario] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    bairro: '',
    cidade: ''
  });

  // Estatísticas da prefeitura
  const estatisticas = estatisticasMock.find(e => e.prefeituraId === prefeituraId);
  
  const usuariosFiltrados = usuarios.filter(u => {
    const matchSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.cpf.includes(searchTerm) ||
                       u.telefone.includes(searchTerm);
    const matchTipo = selectedTipoUsuario === 'todos' || u.tipo === selectedTipoUsuario;
    return matchSearch && matchTipo;
  });

  const solicitacoesFiltradas = solicitacoes.filter(s => {
    const matchStatus = selectedStatusSolicitacao === 'todos' || s.status === selectedStatusSolicitacao;
    return matchStatus;
  });

  // Funções para categorizar solicitações
  const getSolicitacoesPorStatus = (status: string) => {
    return solicitacoes.filter(s => s.status === status);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCreateUser = () => {
    if (novoUsuario.nome && novoUsuario.cpf && novoUsuario.telefone) {
      const novo: Usuario = {
        id: String(usuarios.length + 1),
        nome: novoUsuario.nome,
        cpf: novoUsuario.cpf,
        telefone: novoUsuario.telefone,
        email: novoUsuario.email,
        cidade: 'São Paulo', // Baseado na prefeitura
        bairro: novoUsuario.bairro,
        tipo: novoUsuario.tipo,
        prefeituraId,
        ativo: true,
        dataCriacao: obterDataISOBrasilia().split('T')[0]
      };
      
      setUsuarios([...usuarios, novo]);
      setNovoUsuario({
        nome: '', cpf: '', telefone: '', email: '', tipo: 'funcionario', bairro: '', senha: ''
      });
      setShowCreateUserDialog(false);
    }
  };

  const toggleModulo = (moduloId: string) => {
    setModulosAtivos(prev => 
      prev.includes(moduloId) 
        ? prev.filter(id => id !== moduloId)
        : [...prev, moduloId]
    );
  };

  // Funções para gerenciar usuários
  const abrirDetalhesUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setShowUserDetailsDialog(true);
  };

  const abrirEdicaoUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setDadosEdicaoUsuario({
      nome: usuario.nome,
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      email: usuario.email || '',
      bairro: usuario.bairro,
      cidade: usuario.cidade
    });
    setShowEditUserDialog(true);
  };

  const salvarEdicaoUsuario = () => {
    if (!usuarioSelecionado) return;

    const usuariosAtualizados = usuarios.map(u => {
      if (u.id === usuarioSelecionado.id) {
        return {
          ...u,
          nome: dadosEdicaoUsuario.nome,
          cpf: dadosEdicaoUsuario.cpf,
          telefone: dadosEdicaoUsuario.telefone,
          email: dadosEdicaoUsuario.email,
          bairro: dadosEdicaoUsuario.bairro,
          cidade: dadosEdicaoUsuario.cidade
        };
      }
      return u;
    });

    setUsuarios(usuariosAtualizados);
    setShowEditUserDialog(false);
    
    // Atualizar dados do usuário selecionado se o modal de detalhes estiver aberto
    if (showUserDetailsDialog) {
      const usuarioAtualizado = usuariosAtualizados.find(u => u.id === usuarioSelecionado.id);
      if (usuarioAtualizado) {
        setUsuarioSelecionado(usuarioAtualizado);
      }
    } else {
      setUsuarioSelecionado(null);
    }
  };

  // Funções para gerenciar solicitações
  const abrirDetalhes = (solicitacao: Solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setShowDetalhesDialog(true);
  };

  const abrirAtualizar = (solicitacao: Solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setDadosAtualizacao({
      status: solicitacao.status,
      observacoes: solicitacao.observacoes || '',
      responsavelId: solicitacao.responsavelId || ''
    });
    setShowAtualizarDialog(true);
  };

  const abrirAtender = (solicitacao: Solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setObservacoesAtendimento('');
    setShowAtenderDialog(true);
  };

  const salvarAtualizacao = () => {
    if (!solicitacaoSelecionada) return;

    const solicitacoesAtualizadas = solicitacoes.map(s => {
      if (s.id === solicitacaoSelecionada.id) {
        return {
          ...s,
          status: dadosAtualizacao.status as any,
          observacoes: dadosAtualizacao.observacoes,
          responsavelId: dadosAtualizacao.responsavelId || undefined,
          dataAtualizacao: obterDataISOBrasilia()
        };
      }
      return s;
    });

    setSolicitacoes(solicitacoesAtualizadas);
    setShowAtualizarDialog(false);
    setSolicitacaoSelecionada(null);

    // Simular notificação para o usuário
    console.log('Notificação enviada para o usuário sobre atualização da solicitação');
  };

  const iniciarAtendimento = () => {
    if (!solicitacaoSelecionada) return;

    const solicitacoesAtualizadas = solicitacoes.map(s => {
      if (s.id === solicitacaoSelecionada.id) {
        return {
          ...s,
          status: 'andamento' as any,
          responsavelId: 'admin-atual', // ID do usuário logado
          observacoes: observacoesAtendimento,
          dataAtualizacao: obterDataISOBrasilia()
        };
      }
      return s;
    });

    setSolicitacoes(solicitacoesAtualizadas);
    setShowAtenderDialog(false);
    setSolicitacaoSelecionada(null);

    // Simular notificação para o usuário
    console.log('Notificação enviada para o usuário sobre início do atendimento');
  };

  const finalizarAtendimento = () => {
    if (!solicitacaoSelecionada) return;

    const solicitacoesAtualizadas = solicitacoes.map(s => {
      if (s.id === solicitacaoSelecionada.id) {
        return {
          ...s,
          status: 'concluida' as any,
          observacoes: observacoesAtendimento,
          dataAtualizacao: obterDataISOBrasilia()
        };
      }
      return s;
    });

    setSolicitacoes(solicitacoesAtualizadas);
    setShowAtenderDialog(false);
    setSolicitacaoSelecionada(null);

    // Simular notificação para o usuário
    console.log('Notificação enviada para o usuário sobre conclusão do atendimento');
  };

  // Função para exportar relatório
  const exportarRelatorio = () => {
    const dados = {
      periodo: selectedPeriod,
      formato: selectedFormat,
      solicitacoes: solicitacoesFiltradas.length,
      usuarios: usuarios.length,
      dataGeracao: formatarDataHoraBrasilia(obterDataISOBrasilia())
    };
    
    console.log('Exportando relatório:', dados);
    alert(`Relatório ${selectedFormat.toUpperCase()} dos últimos ${selectedPeriod} dias será baixado em breve!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoUsuarioColor = (tipo: TipoUsuario) => {
    switch (tipo) {
      case TipoUsuario.CIDADAO: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TipoUsuario.FUNCIONARIO: return 'bg-green-100 text-green-800 border-green-200';
      case TipoUsuario.ADMIN_PREFEITURA: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cidade Conectada</h1>
                <p className="text-sm text-blue-600">{prefeituraNome}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Relatório
              </Button>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 bg-white border border-blue-100">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="solicitacoes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Solicitações
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h2>
                <p className="text-gray-600">Visão geral das atividades da prefeitura</p>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {estatisticas?.usuarios.total || usuarios.length}
                  </div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{estatisticas?.usuarios.novos || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Solicitações Ativas
                  </CardTitle>
                  <FileText className="h-4 w-4 text-black" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">
                    {(estatisticas?.solicitacoes.pendentes || 0) + 
                     (estatisticas?.solicitacoes.emAndamento || 0)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {estatisticas?.solicitacoes.tempoMedioResolucao || 0} dias médio
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Solicitações Resolvidas
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {estatisticas?.solicitacoes.concluidas || 0}
                  </div>
                  <p className="text-xs text-green-600">
                    Concluídas com sucesso
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">
                    Em Andamento
                  </CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {estatisticas?.solicitacoes.emAndamento || 0}
                  </div>
                  <p className="text-xs text-orange-600">
                    Sendo atendidas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Segunda linha de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">
                    Não Atendidas
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">
                    {estatisticas?.solicitacoes.pendentes || 0}
                  </div>
                  <p className="text-xs text-red-600">
                    Aguardando atendimento
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Taxa de Resolução
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {estatisticas ? 
                      Math.round((estatisticas.solicitacoes.concluidas / estatisticas.solicitacoes.total) * 100) 
                      : 0}%
                  </div>
                  <p className="text-xs text-gray-500">
                    Tempo médio: 1h 35min
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">
                    Solicitações Atrasadas
                  </CardTitle>
                  <Timer className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {Math.floor(Math.random() * 15) + 5}
                  </div>
                  <p className="text-xs text-purple-600">
                    Ultrapassaram prazo
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 bg-indigo-50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-indigo-800">
                    Atendimentos por Usuário
                  </CardTitle>
                  <User className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-900">
                    {Math.floor(Math.random() * 50) + 20}
                  </div>
                  <p className="text-xs text-indigo-600">
                    Média por funcionário
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos e Métricas Avançadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-500" />
                    Solicitações por Setor
                  </CardTitle>
                  <CardDescription>Distribuição por departamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { setor: 'Obras Públicas', quantidade: 45, cor: 'bg-blue-500' },
                      { setor: 'Limpeza Urbana', quantidade: 32, cor: 'bg-green-500' },
                      { setor: 'Iluminação', quantidade: 28, cor: 'bg-yellow-500' },
                      { setor: 'Saúde', quantidade: 19, cor: 'bg-red-500' },
                      { setor: 'Educação', quantidade: 15, cor: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.setor} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.cor}`}></div>
                          <span className="text-sm font-medium">{item.setor}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${item.cor}`}
                              style={{ width: `${(item.quantidade / 50) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{item.quantidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-500" />
                    Solicitações por Prioridade
                  </CardTitle>
                  <CardDescription>Classificação por urgência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { prioridade: 'Alta', quantidade: 23, cor: 'bg-red-500', icon: '🔴' },
                      { prioridade: 'Média', quantidade: 67, cor: 'bg-yellow-500', icon: '🟡' },
                      { prioridade: 'Baixa', quantidade: 49, cor: 'bg-green-500', icon: '🟢' }
                    ].map((item) => (
                      <div key={item.prioridade} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm font-medium">{item.prioridade}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${item.cor}`}
                              style={{ width: `${(item.quantidade / 70) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{item.quantidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Últimas Solicitações Recebidas */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Últimas Solicitações Recebidas</CardTitle>
                <CardDescription>Acompanhamento rápido das 10 últimas solicitações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solicitacoes.slice(0, 10).map((solicitacao) => (
                    <div key={solicitacao.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getStatusColor(solicitacao.status)}>
                            {getStatusText(solicitacao.status)}
                          </Badge>
                          <span className="text-sm font-mono text-gray-500">{solicitacao.protocolo}</span>
                          <span className="text-sm text-gray-500">{formatarDataHoraBrasilia(solicitacao.data)}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{solicitacao.tipo}</h4>
                        <p className="text-sm text-gray-600 truncate">{solicitacao.descricao}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => abrirDetalhes(solicitacao)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tendência de Solicitações */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Tendência de Solicitações
                </CardTitle>
                <CardDescription>Evolução semanal das solicitações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2 h-32">
                  {[12, 19, 15, 27, 22, 18, 25].map((valor, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(valor / 30) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuários */}
          <TabsContent value="usuarios" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
                <p className="text-gray-600">Gerencie cidadãos e funcionários da prefeitura</p>
              </div>
              
              <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Adicione um novo funcionário ou administrador
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        placeholder="Nome completo do usuário"
                        value={novoUsuario.nome}
                        onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={novoUsuario.cpf}
                          onChange={(e) => setNovoUsuario({...novoUsuario, cpf: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 00000-0000"
                          value={novoUsuario.telefone}
                          onChange={(e) => setNovoUsuario({...novoUsuario, telefone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@prefeitura.gov.br"
                        value={novoUsuario.email}
                        onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipo">Tipo de Usuário</Label>
                        <Select value={novoUsuario.tipo} onValueChange={(value: TipoUsuario) => 
                          setNovoUsuario({...novoUsuario, tipo: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="funcionario">Funcionário</SelectItem>
                            <SelectItem value="admin_prefeitura">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input
                          id="bairro"
                          placeholder="Bairro"
                          value={novoUsuario.bairro}
                          onChange={(e) => setNovoUsuario({...novoUsuario, bairro: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="senha">Senha Temporária</Label>
                      <Input
                        id="senha"
                        type="password"
                        placeholder="Senha temporária"
                        value={novoUsuario.senha}
                        onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                      />
                    </div>
                    
                    <Button onClick={handleCreateUser} className="w-full bg-blue-500 hover:bg-blue-600">
                      Cadastrar Usuário
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedTipoUsuario} onValueChange={setSelectedTipoUsuario}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="cidadao">Cidadãos</SelectItem>
                  <SelectItem value="funcionario">Funcionários</SelectItem>
                  <SelectItem value="admin_prefeitura">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Usuários */}
            <div className="space-y-4">
              {usuariosFiltrados.map((usuario) => (
                <Card key={usuario.id} className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                            <Badge className={getTipoUsuarioColor(usuario.tipo)}>
                              {usuario.tipo === 'cidadao' && 'Cidadão'}
                              {usuario.tipo === 'funcionario' && 'Funcionário'}
                              {usuario.tipo === 'admin_prefeitura' && 'Administrador'}
                            </Badge>
                            {!usuario.ativo && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>{formatarCPF(usuario.cpf)}</span>
                            <span>{formatarTelefone(usuario.telefone)}</span>
                            {usuario.email && <span>{usuario.email}</span>}
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Desde {formatarDataBrasilia(usuario.dataCriacao)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => abrirDetalhesUsuario(usuario)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => abrirEdicaoUsuario(usuario)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Solicitações */}
          <TabsContent value="solicitacoes" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Solicitações</h2>
                <p className="text-gray-600">Acompanhe e gerencie todas as solicitações</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  const csvContent = solicitacoesFiltradas.map(s => 
                    `${s.protocolo},${s.tipo},${s.status},${formatarDataBrasilia(s.data)},${s.localizacao}`
                  ).join('\n');
                  console.log('Exportando CSV:', csvContent);
                  alert('Arquivo CSV será baixado em breve!');
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Select value={selectedStatusSolicitacao} onValueChange={setSelectedStatusSolicitacao}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluídas</SelectItem>
                    <SelectItem value="cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categorias de Solicitações */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { status: 'pendente', label: 'Pendentes', icon: Clock, color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
                { status: 'andamento', label: 'Em Andamento', icon: Activity, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
                { status: 'concluida', label: 'Concluídas', icon: CheckCircle, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                { status: 'cancelada', label: 'Canceladas', icon: AlertTriangle, color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
              ].map((categoria) => {
                const Icon = categoria.icon;
                const solicitacoesCategoria = getSolicitacoesPorStatus(categoria.status);
                const isExpanded = expandedCategories[categoria.status];
                
                return (
                  <div key={categoria.status}>
                    <Card className={`${categoria.borderColor} ${categoria.bgColor} cursor-pointer hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-5 h-5 text-${categoria.color}-600`} />
                            <span className={`text-sm font-medium text-${categoria.color}-800`}>
                              {categoria.label}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategory(categoria.status)}
                            className="p-1 h-auto"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className={`text-2xl font-bold text-${categoria.color}-900`}>
                          {solicitacoesCategoria.length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Lista expandida da categoria */}
                    {isExpanded && (
                      <Card className="mt-2 border-gray-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {solicitacoesCategoria.slice(0, 5).map((solicitacao) => (
                              <div key={solicitacao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-mono text-gray-500">{solicitacao.protocolo}</span>
                                    <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                                      {solicitacao.prioridade}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium text-gray-900 text-sm">{solicitacao.tipo}</h4>
                                  <p className="text-xs text-gray-600 truncate">{solicitacao.descricao}</p>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button variant="outline" size="sm" onClick={() => abrirDetalhes(solicitacao)}>
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => abrirAtualizar(solicitacao)}>
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  {solicitacao.status === 'pendente' && (
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-xs px-2" onClick={() => abrirAtender(solicitacao)}>
                                      Atender
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                            {solicitacoesCategoria.length > 5 && (
                              <p className="text-xs text-gray-500 text-center">
                                +{solicitacoesCategoria.length - 5} solicitações adicionais
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Relatórios e Estatísticas</h2>
              <p className="text-gray-600">Análises detalhadas das atividades da prefeitura</p>
            </div>

            {/* Seção de Download de Relatórios */}
            <Card className="border-blue-100 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2 text-blue-600" />
                  Download de Relatórios
                </CardTitle>
                <CardDescription>
                  Gere relatórios personalizados para análise e auditoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="periodo">Período do Relatório</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Últimas 24 horas</SelectItem>
                        <SelectItem value="3">Últimos 3 dias</SelectItem>
                        <SelectItem value="7">Últimos 7 dias</SelectItem>
                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                        <SelectItem value="60">Últimos 2 meses</SelectItem>
                        <SelectItem value="90">Últimos 3 meses</SelectItem>
                        <SelectItem value="120">Últimos 4 meses</SelectItem>
                        <SelectItem value="180">Últimos 6 meses</SelectItem>
                        <SelectItem value="365">Últimos 12 meses</SelectItem>
                        <SelectItem value="730">Últimos 2 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="formato">Formato do Arquivo</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF (Análise)</SelectItem>
                        <SelectItem value="excel">Excel (Planilha)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={exportarRelatorio} className="w-full bg-blue-500 hover:bg-blue-600">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Relatório
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Solicitações por Tipo</CardTitle>
                  <CardDescription>Distribuição dos tipos de solicitações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Iluminação Pública', 'Buraco na Via', 'Coleta de Lixo', 'Poda de Árvore', 'Limpeza Urbana'].map((tipo, index) => (
                      <div key={tipo} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{tipo}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-blue-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full" 
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{Math.floor(Math.random() * 50) + 10}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Tempo Médio de Resolução</CardTitle>
                  <CardDescription>Por tipo de solicitação (em dias)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { tipo: 'Iluminação Pública', tempo: 2.5 },
                      { tipo: 'Buraco na Via', tempo: 4.2 },
                      { tipo: 'Coleta de Lixo', tempo: 1.8 },
                      { tipo: 'Poda de Árvore', tempo: 7.3 },
                      { tipo: 'Limpeza Urbana', tempo: 3.1 }
                    ].map((item) => (
                      <div key={item.tipo} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.tipo}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-blue-600">{item.tempo} dias</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Download className="w-4 h-4 mr-2" />
                Relatório Mensal
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Relatório de Usuários
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Relatório de Solicitações
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Relatório de Performance
              </Button>
            </div>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="configuracoes" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configurações da Prefeitura</h2>
              <p className="text-gray-600">Gerencie módulos e configurações específicas</p>
            </div>

            <Card className="border-blue-100">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Módulos Ativos</CardTitle>
                    <CardDescription>Ative ou desative módulos conforme necessário</CardDescription>
                  </div>
                  <Dialog open={showConfigModulosDialog} onOpenChange={setShowConfigModulosDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Configurar Módulos</DialogTitle>
                        <DialogDescription>
                          Selecione quais módulos estarão disponíveis para os cidadãos
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {modulosDisponiveis.map((modulo) => (
                          <div key={modulo.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{modulo.nome}</h4>
                              <p className="text-sm text-gray-500">{modulo.descricao}</p>
                            </div>
                            <Switch 
                              checked={modulosAtivos.includes(modulo.id)}
                              onCheckedChange={() => toggleModulo(modulo.id)}
                            />
                          </div>
                        ))}
                        <Button 
                          onClick={() => setShowConfigModulosDialog(false)} 
                          className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                          Salvar Configurações
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {modulosDisponiveis.map((modulo) => (
                    <div 
                      key={modulo.id} 
                      className={`p-4 border rounded-lg text-center ${
                        modulosAtivos.includes(modulo.id) 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{modulo.icone === 'FileText' ? '📄' : '📅'}</div>
                      <div className="text-sm font-medium">{modulo.nome}</div>
                      <div className={`text-xs mt-1 ${
                        modulosAtivos.includes(modulo.id) ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {modulosAtivos.includes(modulo.id) ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configurações específicas da prefeitura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notificações por SMS</Label>
                    <p className="text-sm text-gray-500">Enviar notificações importantes por SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Geolocalização Obrigatória</Label>
                    <p className="text-sm text-gray-500">Exigir localização em solicitações</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Avaliação de Serviços</Label>
                    <p className="text-sm text-gray-500">Permitir avaliação após conclusão</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Modo Manutenção</Label>
                    <p className="text-sm text-gray-500">Ativar modo de manutenção temporário</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={showUserDetailsDialog} onOpenChange={setShowUserDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Informações do Usuário</DialogTitle>
            <DialogDescription>
              Detalhes completos do usuário selecionado
            </DialogDescription>
          </DialogHeader>
          {usuarioSelecionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome Completo</Label>
                  <p className="text-sm">{usuarioSelecionado.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">CPF</Label>
                  <p className="text-sm">{formatarCPF(usuarioSelecionado.cpf)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  <p className="text-sm">{formatarTelefone(usuarioSelecionado.telefone)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">E-mail</Label>
                  <p className="text-sm">{usuarioSelecionado.email || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data de Cadastro</Label>
                  <p className="text-sm">{formatarDataBrasilia(usuarioSelecionado.dataCriacao)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Último Login</Label>
                  <p className="text-sm">Hoje às 14:30</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Bairro</Label>
                  <p className="text-sm">{usuarioSelecionado.bairro}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Cidade</Label>
                  <p className="text-sm">{usuarioSelecionado.cidade}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowUserDetailsDialog(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Usuário */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere as informações do usuário selecionado
            </DialogDescription>
          </DialogHeader>
          {usuarioSelecionado && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nome">Nome Completo</Label>
                <Input
                  id="edit-nome"
                  value={dadosEdicaoUsuario.nome}
                  onChange={(e) => setDadosEdicaoUsuario({...dadosEdicaoUsuario, nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cpf">CPF</Label>
                  <Input
                    id="edit-cpf"
                    value={dadosEdicaoUsuario.cpf}
                    onChange={(e) => setDadosEdicaoUsuario({...dadosEdicaoUsuario, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-telefone">Telefone</Label>
                  <Input
                    id="edit-telefone"
                    value={dadosEdicaoUsuario.telefone}
                    onChange={(e) => setDadosEdicaoUsuario({...dadosEdicaoUsuario, telefone: e.target.value})}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-email">E-mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={dadosEdicaoUsuario.email}
                  onChange={(e) => setDadosEdicaoUsuario({...dadosEdicaoUsuario, email: e.target.value})}
                  placeholder="usuario@email.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-bairro">Bairro</Label>
                  <Input
                    id="edit-bairro"
                    value={dadosEdicaoUsuario.bairro}
                    onChange={(e) => setDadosEdicaoUsuario({...dadosEdicaoUsuario, bairro: e.target.value})}
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cidade">Cidade</Label>
                  <Input
                    id="edit-cidade"
                    value={dadosEdicaoUsuario.cidade}
                    onChange={(e) => setDadosEdicaoUsuario({...dadosEdicaoUsuario, cidade: e.target.value})}
                    placeholder="Cidade"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarEdicaoUsuario} className="bg-blue-500 hover:bg-blue-600">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={showDetalhesDialog} onOpenChange={setShowDetalhesDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas da solicitação #{solicitacaoSelecionada?.protocolo}
            </DialogDescription>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Número da Solicitação</Label>
                  <p className="text-sm font-mono">{solicitacaoSelecionada.protocolo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data e Hora de Criação</Label>
                  <p className="text-sm">{formatarDataHoraBrasilia(solicitacaoSelecionada.data)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Setor/Departamento</Label>
                  <p className="text-sm">{solicitacaoSelecionada.tipo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status Atual</Label>
                  <Badge className={getStatusColor(solicitacaoSelecionada.status)}>
                    {getStatusText(solicitacaoSelecionada.status)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Descrição Completa</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{solicitacaoSelecionada.descricao}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Localização</Label>
                <p className="text-sm">{solicitacaoSelecionada.localizacao}</p>
              </div>
              
              {solicitacaoSelecionada.responsavelId && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Responsável Designado</Label>
                  <p className="text-sm">Funcionário ID: {solicitacaoSelecionada.responsavelId}</p>
                </div>
              )}
              
              {solicitacaoSelecionada.observacoes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{solicitacaoSelecionada.observacoes}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowDetalhesDialog(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Atualizar */}
      <Dialog open={showAtualizarDialog} onOpenChange={setShowAtualizarDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Atualizar Solicitação</DialogTitle>
            <DialogDescription>
              Altere as informações da solicitação #{solicitacaoSelecionada?.protocolo}
            </DialogDescription>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status da Solicitação</Label>
                <Select value={dadosAtualizacao.status} onValueChange={(value) => 
                  setDadosAtualizacao({...dadosAtualizacao, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="andamento">Em Atendimento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="responsavel">Responsável Designado</Label>
                <Input
                  id="responsavel"
                  placeholder="ID ou nome do responsável"
                  value={dadosAtualizacao.responsavelId}
                  onChange={(e) => setDadosAtualizacao({...dadosAtualizacao, responsavelId: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="observacoes">Observações ou Comentários</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Adicione observações sobre a solicitação..."
                  value={dadosAtualizacao.observacoes}
                  onChange={(e) => setDadosAtualizacao({...dadosAtualizacao, observacoes: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAtualizarDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarAtualizacao} className="bg-blue-500 hover:bg-blue-600">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Atender */}
      <Dialog open={showAtenderDialog} onOpenChange={setShowAtenderDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Atender Solicitação</DialogTitle>
            <DialogDescription>
              Iniciar atendimento da solicitação #{solicitacaoSelecionada?.protocolo}
            </DialogDescription>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Resumo da Solicitação</h4>
                <p className="text-sm text-blue-800 mb-1"><strong>Tipo:</strong> {solicitacaoSelecionada.tipo}</p>
                <p className="text-sm text-blue-800 mb-1"><strong>Local:</strong> {solicitacaoSelecionada.localizacao}</p>
                <p className="text-sm text-blue-800"><strong>Descrição:</strong> {solicitacaoSelecionada.descricao}</p>
              </div>
              
              <div>
                <Label htmlFor="observacoes-atendimento">Observações Iniciais do Atendimento</Label>
                <Textarea
                  id="observacoes-atendimento"
                  placeholder="Adicione observações sobre o início do atendimento..."
                  value={observacoesAtendimento}
                  onChange={(e) => setObservacoesAtendimento(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAtenderDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={iniciarAtendimento} className="bg-blue-500 hover:bg-blue-600">
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Atendimento
                </Button>
                {solicitacaoSelecionada.status === 'andamento' && (
                  <Button onClick={finalizarAtendimento} className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar Atendimento
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}