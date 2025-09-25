"use client";

import { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  Bell, 
  MapPin, 
  Camera, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  User,
  Settings,
  Search,
  Plus,
  LogIn,
  UserPlus,
  Building2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatarDataBrasilia, obterDataISOBrasilia } from '@/lib/utils';

interface Solicitacao {
  id: string;
  protocolo: string;
  tipo: string;
  descricao: string;
  status: 'pendente' | 'andamento' | 'concluida';
  data: string;
  localizacao: string;
}

interface Evento {
  id: string;
  titulo: string;
  data: string;
  local: string;
  tipo: 'cultural' | 'esportivo' | 'oficial';
}

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'emergencia' | 'comunicado' | 'lembrete';
  data: string;
  lida: boolean;
}

export default function CidadeConectada() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([
    {
      id: '1',
      protocolo: 'SOL-2024-001',
      tipo: 'Iluminação Pública',
      descricao: 'Poste queimado na Rua das Flores, 123',
      status: 'andamento',
      data: obterDataISOBrasilia(),
      localizacao: 'Centro'
    },
    {
      id: '2',
      protocolo: 'SOL-2024-002',
      tipo: 'Buraco na Via',
      descricao: 'Buraco grande na Av. Principal',
      status: 'concluida',
      data: obterDataISOBrasilia(),
      localizacao: 'Zona Norte'
    }
  ]);

  const [eventos] = useState<Evento[]>([
    {
      id: '1',
      titulo: 'Festival de Inverno',
      data: '2024-07-20',
      local: 'Praça Central',
      tipo: 'cultural'
    },
    {
      id: '2',
      titulo: 'Campeonato Municipal de Futebol',
      data: '2024-07-25',
      local: 'Estádio Municipal',
      tipo: 'esportivo'
    }
  ]);

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      titulo: 'Campanha de Vacinação',
      mensagem: 'Nova campanha de vacinação contra gripe iniciada',
      tipo: 'comunicado',
      data: obterDataISOBrasilia(),
      lida: false
    },
    {
      id: '2',
      titulo: 'Alerta de Chuva',
      mensagem: 'Previsão de chuva forte para hoje',
      tipo: 'emergencia',
      data: obterDataISOBrasilia(),
      lida: false
    }
  ]);

  const [novaSolicitacao, setNovaSolicitacao] = useState({
    tipo: '',
    descricao: '',
    localizacao: ''
  });

  const handleNovaSolicitacao = () => {
    if (novaSolicitacao.tipo && novaSolicitacao.descricao) {
      const protocolo = `SOL-2024-${String(solicitacoes.length + 1).padStart(3, '0')}`;
      const nova: Solicitacao = {
        id: String(solicitacoes.length + 1),
        protocolo,
        tipo: novaSolicitacao.tipo,
        descricao: novaSolicitacao.descricao,
        status: 'pendente',
        data: obterDataISOBrasilia(),
        localizacao: novaSolicitacao.localizacao || 'Não informado'
      };
      setSolicitacoes([nova, ...solicitacoes]);
      setNovaSolicitacao({ tipo: '', descricao: '', localizacao: '' });
    }
  };

  const marcarNotificacaoLida = (id: string) => {
    setNotificacoes(notificacoes.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    switch (tipo) {
      case 'cultural': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'esportivo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'oficial': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoNotificacaoIcon = (tipo: string) => {
    switch (tipo) {
      case 'emergencia': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'comunicado': return <Bell className="w-4 h-4 text-blue-500" />;
      case 'lembrete': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
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
                <p className="text-sm text-blue-600">Prefeitura Municipal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Acesso Rápido aos Dashboards */}
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/admin-prefeitura'}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Prefeitura
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/super-admin'}
                  className="text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Super Admin
                </Button>
              </div>

              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
                {notificacoes.filter(n => !n.lida).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificacoes.filter(n => !n.lida).length}
                  </span>
                )}
              </div>
              
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Acesso ao Sistema</DialogTitle>
                    <DialogDescription>
                      Escolha como deseja acessar o sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => window.location.href = '/auth'}
                      className="w-full bg-blue-500 hover:bg-blue-600 justify-start"
                    >
                      <User className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Acesso do Cidadão</div>
                        <div className="text-xs opacity-80">Solicitar serviços e acompanhar protocolos</div>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = '/auth'}
                      variant="outline"
                      className="w-full justify-start border-green-200 hover:bg-green-50"
                    >
                      <Shield className="w-4 h-4 mr-3 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium text-green-700">Funcionário da Prefeitura</div>
                        <div className="text-xs text-green-600">Atender solicitações e gerenciar serviços</div>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = '/auth'}
                      variant="outline"
                      className="w-full justify-start border-purple-200 hover:bg-purple-50"
                    >
                      <Building2 className="w-4 h-4 mr-3 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium text-purple-700">Administrador da Prefeitura</div>
                        <div className="text-xs text-purple-600">Gerenciar usuários e configurações</div>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = '/auth'}
                      variant="outline"
                      className="w-full justify-start border-slate-200 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4 mr-3 text-slate-600" />
                      <div className="text-left">
                        <div className="font-medium text-slate-700">Super Administrador</div>
                        <div className="text-xs text-slate-600">Gerenciar todas as prefeituras</div>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-white border border-blue-100">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="solicitacoes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Solicitações
            </TabsTrigger>
            <TabsTrigger value="agenda" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Agenda
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Banner de Acesso Rápido */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Sistema Multi-Prefeituras</h3>
                    <p className="text-blue-700 mb-4">
                      Acesse os diferentes níveis administrativos do sistema conforme seu perfil de usuário.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500 text-white">Gestão Isolada por Cidade</Badge>
                      <Badge className="bg-green-500 text-white">Controle de Usuários</Badge>
                      <Badge className="bg-purple-500 text-white">Dashboard Centralizado</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => window.location.href = '/admin-prefeitura'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Prefeitura
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/super-admin'}
                      className="bg-slate-600 hover:bg-slate-700"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Super Admin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Solicitações Abertas
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {solicitacoes.filter(s => s.status !== 'concluida').length}
                  </div>
                  <p className="text-xs text-gray-500">
                    +2 desde ontem
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Eventos Este Mês
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{eventos.length}</div>
                  <p className="text-xs text-gray-500">
                    Próximo em 5 dias
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Notificações
                  </CardTitle>
                  <Bell className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {notificacoes.filter(n => !n.lida).length}
                  </div>
                  <p className="text-xs text-gray-500">
                    Não lidas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tempo Médio
                  </CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">3.2</div>
                  <p className="text-xs text-gray-500">
                    dias para resolução
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Módulos Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-blue-100 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" 
                    onClick={() => setActiveTab('solicitacoes')}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Solicitações de Serviços</CardTitle>
                      <CardDescription>Registre ocorrências e acompanhe protocolos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Ouvidoria Digital</CardTitle>
                      <CardDescription>Sugestões, denúncias e reclamações</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-blue-100 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                    onClick={() => setActiveTab('agenda')}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Agenda Municipal</CardTitle>
                      <CardDescription>Eventos culturais, esportivos e oficiais</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Módulos Futuros */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Módulos Avançados (Em Breve)</CardTitle>
                <CardDescription>Funcionalidades que serão disponibilizadas em futuras atualizações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { nome: 'Saúde', icon: '🏥' },
                    { nome: 'Educação', icon: '📚' },
                    { nome: 'Tributos', icon: '💰' },
                    { nome: 'Mobilidade', icon: '🚌' },
                    { nome: 'Turismo', icon: '🗺️' },
                    { nome: 'Transparência', icon: '📊' }
                  ].map((modulo) => (
                    <div key={modulo.nome} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl mb-2">{modulo.icon}</div>
                      <div className="text-sm font-medium text-gray-600">{modulo.nome}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solicitações */}
          <TabsContent value="solicitacoes" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Solicitações de Serviços</h2>
                <p className="text-gray-600">Registre e acompanhe suas solicitações</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Solicitação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nova Solicitação</DialogTitle>
                    <DialogDescription>
                      Registre uma nova ocorrência ou solicitação de serviço
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tipo">Tipo de Solicitação</Label>
                      <Select value={novaSolicitacao.tipo} onValueChange={(value) => 
                        setNovaSolicitacao({...novaSolicitacao, tipo: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Iluminação Pública">Iluminação Pública</SelectItem>
                          <SelectItem value="Buraco na Via">Buraco na Via</SelectItem>
                          <SelectItem value="Coleta de Lixo">Coleta de Lixo</SelectItem>
                          <SelectItem value="Poda de Árvore">Poda de Árvore</SelectItem>
                          <SelectItem value="Limpeza Urbana">Limpeza Urbana</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva detalhadamente o problema..."
                        value={novaSolicitacao.descricao}
                        onChange={(e) => setNovaSolicitacao({...novaSolicitacao, descricao: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        placeholder="Endereço ou referência"
                        value={novaSolicitacao.localizacao}
                        onChange={(e) => setNovaSolicitacao({...novaSolicitacao, localizacao: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Camera className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700">Adicionar foto (opcional)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700">Usar localização atual</span>
                    </div>
                    
                    <Button onClick={handleNovaSolicitacao} className="w-full bg-blue-500 hover:bg-blue-600">
                      Registrar Solicitação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {solicitacoes.map((solicitacao) => (
                <Card key={solicitacao.id} className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={`${getStatusColor(solicitacao.status)} border`}>
                            {solicitacao.status === 'pendente' && 'Pendente'}
                            {solicitacao.status === 'andamento' && 'Em Andamento'}
                            {solicitacao.status === 'concluida' && 'Concluída'}
                          </Badge>
                          <span className="text-sm font-mono text-gray-500">{solicitacao.protocolo}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{solicitacao.tipo}</h3>
                        <p className="text-gray-600 mb-2">{solicitacao.descricao}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{solicitacao.localizacao}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarDataBrasilia(solicitacao.data)}</span>
                          </div>
                        </div>
                      </div>
                      {solicitacao.status === 'concluida' && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agenda */}
          <TabsContent value="agenda" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agenda Municipal</h2>
              <p className="text-gray-600">Eventos culturais, esportivos e oficiais da cidade</p>
            </div>

            <div className="space-y-4">
              {eventos.map((evento) => (
                <Card key={evento.id} className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={`${getTipoEventoColor(evento.tipo)} border`}>
                            {evento.tipo === 'cultural' && 'Cultural'}
                            {evento.tipo === 'esportivo' && 'Esportivo'}
                            {evento.tipo === 'oficial' && 'Oficial'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{evento.titulo}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarDataBrasilia(evento.data)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{evento.local}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notificações</h2>
              <p className="text-gray-600">Comunicados oficiais e alertas da prefeitura</p>
            </div>

            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <Card 
                  key={notificacao.id} 
                  className={`border-blue-100 hover:shadow-md transition-shadow cursor-pointer ${
                    !notificacao.lida ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => marcarNotificacaoLida(notificacao.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTipoNotificacaoIcon(notificacao.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{notificacao.titulo}</h3>
                          {!notificacao.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notificacao.mensagem}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatarDataBrasilia(notificacao.data)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}