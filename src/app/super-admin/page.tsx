"use client";

import { useState } from 'react';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Power,
  PowerOff,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity
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
import { prefeiturasMock, estatisticasMock, usuariosMock, solicitacoesMock } from '@/lib/mock-data';
import { Prefeitura, Estatisticas } from '@/lib/types';
import { formatarData, formatarMoeda } from '@/lib/utils';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [prefeituras, setPrefeituras] = useState<Prefeitura[]>(prefeiturasMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [novaPrefeitura, setNovaPrefeitura] = useState({
    nome: '',
    cidade: '',
    estado: '',
    cnpj: '',
    prefeito: '',
    telefone: '',
    email: '',
    endereco: '',
    corPrimaria: '#0066CC',
    corSecundaria: '#004499'
  });

  // Estatísticas globais
  const estatisticasGlobais = estatisticasMock.find(e => !e.prefeituraId);
  
  const prefeiturasFiltradas = prefeituras.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = selectedEstado === 'todos' || p.estado === selectedEstado;
    return matchSearch && matchEstado;
  });

  const togglePrefeituraStatus = (id: string) => {
    setPrefeituras(prefeituras.map(p => 
      p.id === id ? { ...p, ativa: !p.ativa } : p
    ));
  };

  const handleCreatePrefeitura = () => {
    if (novaPrefeitura.nome && novaPrefeitura.cidade && novaPrefeitura.estado) {
      const nova: Prefeitura = {
        id: String(prefeituras.length + 1),
        nome: novaPrefeitura.nome,
        cidade: novaPrefeitura.cidade,
        estado: novaPrefeitura.estado,
        cnpj: novaPrefeitura.cnpj,
        prefeito: novaPrefeitura.prefeito,
        corPrimaria: novaPrefeitura.corPrimaria,
        corSecundaria: novaPrefeitura.corSecundaria,
        ativa: true,
        dataCriacao: new Date().toISOString().split('T')[0],
        configuracoes: {
          modulosAtivos: ['solicitacoes', 'ouvidoria', 'agenda'],
          integracoes: [],
          limiteUsuarios: 1000
        },
        contato: {
          telefone: novaPrefeitura.telefone,
          email: novaPrefeitura.email,
          endereco: novaPrefeitura.endereco
        }
      };
      
      setPrefeituras([...prefeituras, nova]);
      setNovaPrefeitura({
        nome: '', cidade: '', estado: '', cnpj: '', prefeito: '',
        telefone: '', email: '', endereco: '', corPrimaria: '#0066CC', corSecundaria: '#004499'
      });
      setShowCreateDialog(false);
    }
  };

  const getStatusColor = (ativa: boolean) => {
    return ativa 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
                <p className="text-sm text-slate-600">Cidade Conectada</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Relatório Geral
              </Button>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-slate-700">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-slate-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="prefeituras" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white">
              Prefeituras
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white">
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Geral</h2>
                <p className="text-gray-600">Visão consolidada de todas as prefeituras</p>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Prefeituras
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{prefeituras.length}</div>
                  <p className="text-xs text-gray-500">
                    {prefeituras.filter(p => p.ativa).length} ativas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {estatisticasGlobais?.usuarios.total.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{estatisticasGlobais?.usuarios.novos || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Solicitações Ativas
                  </CardTitle>
                  <Activity className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {(estatisticasGlobais?.solicitacoes.pendentes || 0) + 
                     (estatisticasGlobais?.solicitacoes.emAndamento || 0)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {estatisticasGlobais?.solicitacoes.tempoMedioResolucao || 0} dias médio
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Taxa de Engajamento
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(estatisticasGlobais?.notificacoes.taxaLeitura || 0)}%
                  </div>
                  <p className="text-xs text-gray-500">
                    notificações lidas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Prefeituras Recentes */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Prefeituras Recentes</CardTitle>
                <CardDescription>Últimas prefeituras cadastradas no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prefeituras.slice(0, 5).map((prefeitura) => (
                    <div key={prefeitura.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: prefeitura.corPrimaria }}>
                          <span className="text-white font-bold text-sm">
                            {prefeitura.cidade.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{prefeitura.nome}</h4>
                          <p className="text-sm text-gray-500">
                            {prefeitura.cidade}, {prefeitura.estado}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(prefeitura.ativa)}>
                          {prefeitura.ativa ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatarData(prefeitura.dataCriacao)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prefeituras */}
          <TabsContent value="prefeituras" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Prefeituras</h2>
                <p className="text-gray-600">Gerencie todas as prefeituras do sistema</p>
              </div>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Prefeitura
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Nova Prefeitura</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova prefeitura ao sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome da Prefeitura</Label>
                        <Input
                          id="nome"
                          placeholder="Prefeitura Municipal de..."
                          value={novaPrefeitura.nome}
                          onChange={(e) => setNovaPrefeitura({...novaPrefeitura, nome: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          placeholder="Nome da cidade"
                          value={novaPrefeitura.cidade}
                          onChange={(e) => setNovaPrefeitura({...novaPrefeitura, cidade: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={novaPrefeitura.estado} onValueChange={(value) => 
                          setNovaPrefeitura({...novaPrefeitura, estado: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {estados.map(estado => (
                              <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          placeholder="00.000.000/0001-00"
                          value={novaPrefeitura.cnpj}
                          onChange={(e) => setNovaPrefeitura({...novaPrefeitura, cnpj: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="prefeito">Prefeito(a)</Label>
                      <Input
                        id="prefeito"
                        placeholder="Nome do prefeito"
                        value={novaPrefeitura.prefeito}
                        onChange={(e) => setNovaPrefeitura({...novaPrefeitura, prefeito: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 0000-0000"
                          value={novaPrefeitura.telefone}
                          onChange={(e) => setNovaPrefeitura({...novaPrefeitura, telefone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="contato@prefeitura.gov.br"
                          value={novaPrefeitura.email}
                          onChange={(e) => setNovaPrefeitura({...novaPrefeitura, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Textarea
                        id="endereco"
                        placeholder="Endereço completo da prefeitura"
                        value={novaPrefeitura.endereco}
                        onChange={(e) => setNovaPrefeitura({...novaPrefeitura, endereco: e.target.value})}
                      />
                    </div>
                    
                    <Button onClick={handleCreatePrefeitura} className="w-full bg-slate-600 hover:bg-slate-700">
                      Cadastrar Prefeitura
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
                    placeholder="Buscar prefeituras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Estados</SelectItem>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Prefeituras */}
            <div className="space-y-4">
              {prefeiturasFiltradas.map((prefeitura) => (
                <Card key={prefeitura.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: prefeitura.corPrimaria }}>
                          <span className="text-white font-bold">
                            {prefeitura.cidade.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{prefeitura.nome}</h3>
                            <Badge className={getStatusColor(prefeitura.ativa)}>
                              {prefeitura.ativa ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{prefeitura.cidade}, {prefeitura.estado}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Desde {formatarData(prefeitura.dataCriacao)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{prefeitura.configuracoes.limiteUsuarios} usuários</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePrefeituraStatus(prefeitura.id)}
                          className={prefeitura.ativa ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {prefeitura.ativa ? (
                            <>
                              <PowerOff className="w-4 h-4 mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Consolidado</h2>
              <p className="text-gray-600">Métricas detalhadas de todas as prefeituras</p>
            </div>

            {/* Gráficos e métricas detalhadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Usuários por Prefeitura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prefeituras.filter(p => p.ativa).map((prefeitura) => {
                      const stats = estatisticasMock.find(e => e.prefeituraId === prefeitura.id);
                      return (
                        <div key={prefeitura.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded flex items-center justify-center"
                                 style={{ backgroundColor: prefeitura.corPrimaria }}>
                              <span className="text-white text-xs font-bold">
                                {prefeitura.cidade.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium">{prefeitura.cidade}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">{stats?.usuarios.total || 0}</div>
                            <div className="text-xs text-green-600">+{stats?.usuarios.novos || 0}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Solicitações por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pendentes</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-yellow-200 rounded-full">
                          <div className="w-1/3 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">{estatisticasGlobais?.solicitacoes.pendentes || 0}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Em Andamento</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-blue-200 rounded-full">
                          <div className="w-2/3 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">{estatisticasGlobais?.solicitacoes.emAndamento || 0}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Concluídas</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-green-200 rounded-full">
                          <div className="w-full h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">{estatisticasGlobais?.solicitacoes.concluidas || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="configuracoes" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
              <p className="text-gray-600">Configurações globais e integrações</p>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configurações que afetam todo o sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Modo de Manutenção</Label>
                    <p className="text-sm text-gray-500">Ativar modo de manutenção para todas as prefeituras</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notificações Push</Label>
                    <p className="text-sm text-gray-500">Permitir envio de notificações push</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Logs de Auditoria</Label>
                    <p className="text-sm text-gray-500">Registrar todas as ações dos usuários</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Backup Automático</Label>
                    <p className="text-sm text-gray-500">Realizar backup diário dos dados</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Integrações Globais</CardTitle>
                <CardDescription>APIs e serviços integrados ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Serviço de SMS</h4>
                      <p className="text-sm text-gray-500">Para recuperação de senha e notificações</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Serviço de E-mail</h4>
                      <p className="text-sm text-gray-500">Para comunicações e relatórios</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Geolocalização</h4>
                      <p className="text-sm text-gray-500">Para localização de solicitações</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Analytics</h4>
                      <p className="text-sm text-gray-500">Coleta de métricas e estatísticas</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Configurando</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}