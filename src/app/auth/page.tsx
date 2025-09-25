"use client";

import { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Mail, 
  ArrowRight,
  Building2,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { prefeiturasMock } from '@/lib/mock-data';
import { validarCPF, formatarCPF, formatarTelefone } from '@/lib/utils';

type TipoLogin = 'cidadao' | 'funcionario' | 'admin_prefeitura' | 'super_admin';

interface LoginForm {
  cpf: string;
  senha: string;
  lembrarMe: boolean;
  prefeituraId?: string;
}

interface CadastroForm {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  bairro: string;
  senha: string;
  confirmarSenha: string;
  aceitouTermos: boolean;
}

interface RecuperacaoForm {
  cpf: string;
  metodo: 'sms' | 'email';
  codigo?: string;
  novaSenha?: string;
  confirmarSenha?: string;
}

export default function AuthSystem() {
  const [activeTab, setActiveTab] = useState('login');
  const [tipoLogin, setTipoLogin] = useState<TipoLogin>('cidadao');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [etapaRecuperacao, setEtapaRecuperacao] = useState<'cpf' | 'codigo' | 'senha'>('cpf');
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
    cpf: '',
    senha: '',
    lembrarMe: false,
    prefeituraId: ''
  });

  const [cadastroForm, setCadastroForm] = useState<CadastroForm>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    cidade: '',
    bairro: '',
    senha: '',
    confirmarSenha: '',
    aceitouTermos: false
  });

  const [recuperacaoForm, setRecuperacaoForm] = useState<RecuperacaoForm>({
    cpf: '',
    metodo: 'sms'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const prefeituras = prefeiturasMock.filter(p => p.ativa);

  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(loginForm.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!loginForm.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }

    if ((tipoLogin === 'funcionario' || tipoLogin === 'admin_prefeitura') && !loginForm.prefeituraId) {
      newErrors.prefeituraId = 'Selecione a prefeitura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCadastro = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cadastroForm.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (cadastroForm.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!cadastroForm.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(cadastroForm.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!cadastroForm.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (cadastroForm.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!cadastroForm.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!cadastroForm.bairro) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!cadastroForm.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (cadastroForm.senha.length < 8) {
      newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (cadastroForm.senha !== cadastroForm.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    if (!cadastroForm.aceitouTermos) {
      newErrors.aceitouTermos = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      setLoading(false);
      
      // Redirecionar baseado no tipo de usuário
      switch (tipoLogin) {
        case 'cidadao':
          window.location.href = '/';
          break;
        case 'funcionario':
        case 'admin_prefeitura':
          window.location.href = '/admin-prefeitura';
          break;
        case 'super_admin':
          window.location.href = '/super-admin';
          break;
      }
    }, 2000);
  };

  const handleCadastro = async () => {
    if (!validateCadastro()) return;

    setLoading(true);
    
    // Simular cadastro
    setTimeout(() => {
      setLoading(false);
      setActiveTab('login');
      // Mostrar mensagem de sucesso
    }, 2000);
  };

  const handleRecuperacao = async () => {
    if (etapaRecuperacao === 'cpf') {
      if (!recuperacaoForm.cpf || !validarCPF(recuperacaoForm.cpf)) {
        setErrors({ cpf: 'CPF inválido' });
        return;
      }
      
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setEtapaRecuperacao('codigo');
      }, 1500);
      
    } else if (etapaRecuperacao === 'codigo') {
      if (!recuperacaoForm.codigo || recuperacaoForm.codigo.length !== 6) {
        setErrors({ codigo: 'Código deve ter 6 dígitos' });
        return;
      }
      
      setEtapaRecuperacao('senha');
      
    } else if (etapaRecuperacao === 'senha') {
      if (!recuperacaoForm.novaSenha || recuperacaoForm.novaSenha.length < 8) {
        setErrors({ novaSenha: 'Senha deve ter pelo menos 8 caracteres' });
        return;
      }
      
      if (recuperacaoForm.novaSenha !== recuperacaoForm.confirmarSenha) {
        setErrors({ confirmarSenha: 'Senhas não coincidem' });
        return;
      }
      
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setActiveTab('login');
        setEtapaRecuperacao('cpf');
        setRecuperacaoForm({ cpf: '', metodo: 'sms' });
      }, 1500);
    }
  };

  const getTipoLoginInfo = (tipo: TipoLogin) => {
    switch (tipo) {
      case 'cidadao':
        return {
          title: 'Acesso do Cidadão',
          description: 'Para solicitar serviços e acompanhar protocolos',
          icon: <User className="w-5 h-5" />,
          color: 'bg-blue-500'
        };
      case 'funcionario':
        return {
          title: 'Funcionário da Prefeitura',
          description: 'Para atender solicitações e gerenciar serviços',
          icon: <Shield className="w-5 h-5" />,
          color: 'bg-green-500'
        };
      case 'admin_prefeitura':
        return {
          title: 'Administrador da Prefeitura',
          description: 'Para gerenciar usuários e configurações',
          icon: <Building2 className="w-5 h-5" />,
          color: 'bg-purple-500'
        };
      case 'super_admin':
        return {
          title: 'Super Administrador',
          description: 'Para gerenciar todas as prefeituras',
          icon: <Shield className="w-5 h-5" />,
          color: 'bg-slate-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">MC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Minha Cidade Conectada</h1>
          <p className="text-gray-600">Sistema Municipal Integrado</p>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-blue-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="cadastro" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Cadastrar
              </TabsTrigger>
              <TabsTrigger value="recuperacao" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Recuperar
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <CardHeader className="pb-4">
                <CardTitle>Fazer Login</CardTitle>
                <CardDescription>Acesse sua conta no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tipo de Login */}
                <div className="space-y-3">
                  <Label>Tipo de Acesso</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['cidadao', 'funcionario', 'admin_prefeitura', 'super_admin'] as TipoLogin[]).map((tipo) => {
                      const info = getTipoLoginInfo(tipo);
                      return (
                        <button
                          key={tipo}
                          onClick={() => setTipoLogin(tipo)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            tipoLogin === tipo
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-6 h-6 rounded ${info.color} flex items-center justify-center text-white`}>
                              {info.icon}
                            </div>
                            <span className="text-sm font-medium">{info.title}</span>
                          </div>
                          <p className="text-xs text-gray-500">{info.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seleção de Prefeitura */}
                {(tipoLogin === 'funcionario' || tipoLogin === 'admin_prefeitura') && (
                  <div className="space-y-2">
                    <Label htmlFor="prefeitura">Prefeitura</Label>
                    <Select value={loginForm.prefeituraId} onValueChange={(value) => 
                      setLoginForm({...loginForm, prefeituraId: value})}>
                      <SelectTrigger className={errors.prefeituraId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione sua prefeitura" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefeituras.map((prefeitura) => (
                          <SelectItem key={prefeitura.id} value={prefeitura.id}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: prefeitura.corPrimaria }}
                              ></div>
                              <span>{prefeitura.nome}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.prefeituraId && (
                      <p className="text-sm text-red-600">{errors.prefeituraId}</p>
                    )}
                  </div>
                )}

                {/* CPF */}
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={loginForm.cpf}
                      onChange={(e) => {
                        const formatted = formatarCPF(e.target.value);
                        setLoginForm({...loginForm, cpf: formatted});
                      }}
                      className={`pl-10 ${errors.cpf ? 'border-red-500' : ''}`}
                      maxLength={14}
                    />
                  </div>
                  {errors.cpf && (
                    <p className="text-sm text-red-600">{errors.cpf}</p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={loginForm.senha}
                      onChange={(e) => setLoginForm({...loginForm, senha: e.target.value})}
                      className={`pl-10 pr-10 ${errors.senha ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="text-sm text-red-600">{errors.senha}</p>
                  )}
                </div>

                {/* Lembrar-me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lembrar"
                    checked={loginForm.lembrarMe}
                    onCheckedChange={(checked) => 
                      setLoginForm({...loginForm, lembrarMe: checked as boolean})}
                  />
                  <Label htmlFor="lembrar" className="text-sm">Lembrar-me</Label>
                </div>

                {/* Botão Login */}
                <Button 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Entrar</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </TabsContent>

            {/* Cadastro */}
            <TabsContent value="cadastro">
              <CardHeader className="pb-4">
                <CardTitle>Cadastro de Cidadão</CardTitle>
                <CardDescription>Crie sua conta para acessar os serviços</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={cadastroForm.nome}
                    onChange={(e) => setCadastroForm({...cadastroForm, nome: e.target.value})}
                    className={errors.nome ? 'border-red-500' : ''}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-600">{errors.nome}</p>
                  )}
                </div>

                {/* CPF e Telefone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-cpf">CPF</Label>
                    <Input
                      id="cadastro-cpf"
                      placeholder="000.000.000-00"
                      value={cadastroForm.cpf}
                      onChange={(e) => {
                        const formatted = formatarCPF(e.target.value);
                        setCadastroForm({...cadastroForm, cpf: formatted});
                      }}
                      className={errors.cpf ? 'border-red-500' : ''}
                      maxLength={14}
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-600">{errors.cpf}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={cadastroForm.telefone}
                      onChange={(e) => {
                        const formatted = formatarTelefone(e.target.value);
                        setCadastroForm({...cadastroForm, telefone: formatted});
                      }}
                      className={errors.telefone ? 'border-red-500' : ''}
                      maxLength={15}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-red-600">{errors.telefone}</p>
                    )}
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={cadastroForm.email}
                    onChange={(e) => setCadastroForm({...cadastroForm, email: e.target.value})}
                  />
                </div>

                {/* Cidade e Bairro */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Select value={cadastroForm.cidade} onValueChange={(value) => 
                      setCadastroForm({...cadastroForm, cidade: value})}>
                      <SelectTrigger className={errors.cidade ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefeituras.map((prefeitura) => (
                          <SelectItem key={prefeitura.id} value={prefeitura.cidade}>
                            {prefeitura.cidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cidade && (
                      <p className="text-sm text-red-600">{errors.cidade}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      placeholder="Seu bairro"
                      value={cadastroForm.bairro}
                      onChange={(e) => setCadastroForm({...cadastroForm, bairro: e.target.value})}
                      className={errors.bairro ? 'border-red-500' : ''}
                    />
                    {errors.bairro && (
                      <p className="text-sm text-red-600">{errors.bairro}</p>
                    )}
                  </div>
                </div>

                {/* Senhas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-senha">Senha</Label>
                    <div className="relative">
                      <Input
                        id="cadastro-senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={cadastroForm.senha}
                        onChange={(e) => setCadastroForm({...cadastroForm, senha: e.target.value})}
                        className={`pr-10 ${errors.senha ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.senha && (
                      <p className="text-sm text-red-600">{errors.senha}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmar-senha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repita a senha"
                        value={cadastroForm.confirmarSenha}
                        onChange={(e) => setCadastroForm({...cadastroForm, confirmarSenha: e.target.value})}
                        className={`pr-10 ${errors.confirmarSenha ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmarSenha && (
                      <p className="text-sm text-red-600">{errors.confirmarSenha}</p>
                    )}
                  </div>
                </div>

                {/* Termos */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="termos"
                    checked={cadastroForm.aceitouTermos}
                    onCheckedChange={(checked) => 
                      setCadastroForm({...cadastroForm, aceitouTermos: checked as boolean})}
                    className={errors.aceitouTermos ? 'border-red-500' : ''}
                  />
                  <Label htmlFor="termos" className="text-sm leading-5">
                    Aceito os <button className="text-blue-600 hover:underline">termos de uso</button> e 
                    a <button className="text-blue-600 hover:underline">política de privacidade</button>
                  </Label>
                </div>
                {errors.aceitouTermos && (
                  <p className="text-sm text-red-600">{errors.aceitouTermos}</p>
                )}

                {/* Botão Cadastrar */}
                <Button 
                  onClick={handleCadastro}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Cadastrando...</span>
                    </div>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </CardContent>
            </TabsContent>

            {/* Recuperação */}
            <TabsContent value="recuperacao">
              <CardHeader className="pb-4">
                <CardTitle>Recuperar Senha</CardTitle>
                <CardDescription>
                  {etapaRecuperacao === 'cpf' && 'Informe seu CPF para recuperar a senha'}
                  {etapaRecuperacao === 'codigo' && 'Digite o código enviado para você'}
                  {etapaRecuperacao === 'senha' && 'Defina sua nova senha'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {etapaRecuperacao === 'cpf' && (
                  <>
                    {/* CPF */}
                    <div className="space-y-2">
                      <Label htmlFor="recuperacao-cpf">CPF</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="recuperacao-cpf"
                          placeholder="000.000.000-00"
                          value={recuperacaoForm.cpf}
                          onChange={(e) => {
                            const formatted = formatarCPF(e.target.value);
                            setRecuperacaoForm({...recuperacaoForm, cpf: formatted});
                          }}
                          className={`pl-10 ${errors.cpf ? 'border-red-500' : ''}`}
                          maxLength={14}
                        />
                      </div>
                      {errors.cpf && (
                        <p className="text-sm text-red-600">{errors.cpf}</p>
                      )}
                    </div>

                    {/* Método de Recuperação */}
                    <div className="space-y-3">
                      <Label>Como deseja receber o código?</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sms"
                            checked={recuperacaoForm.metodo === 'sms'}
                            onCheckedChange={() => setRecuperacaoForm({...recuperacaoForm, metodo: 'sms'})}
                          />
                          <Label htmlFor="sms" className="flex items-center space-x-2">
                            <Smartphone className="w-4 h-4" />
                            <span>SMS no telefone cadastrado</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email-recuperacao"
                            checked={recuperacaoForm.metodo === 'email'}
                            onCheckedChange={() => setRecuperacaoForm({...recuperacaoForm, metodo: 'email'})}
                          />
                          <Label htmlFor="email-recuperacao" className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>E-mail cadastrado</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {etapaRecuperacao === 'codigo' && (
                  <>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-700">
                        Código enviado via {recuperacaoForm.metodo === 'sms' ? 'SMS' : 'e-mail'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código de Verificação</Label>
                      <Input
                        id="codigo"
                        placeholder="000000"
                        value={recuperacaoForm.codigo || ''}
                        onChange={(e) => setRecuperacaoForm({...recuperacaoForm, codigo: e.target.value})}
                        className={`text-center text-lg tracking-widest ${errors.codigo ? 'border-red-500' : ''}`}
                        maxLength={6}
                      />
                      {errors.codigo && (
                        <p className="text-sm text-red-600">{errors.codigo}</p>
                      )}
                    </div>

                    <Button variant="outline" className="w-full">
                      Reenviar Código
                    </Button>
                  </>
                )}

                {etapaRecuperacao === 'senha' && (
                  <>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">
                        Código verificado com sucesso!
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nova-senha">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="nova-senha"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 8 caracteres"
                          value={recuperacaoForm.novaSenha || ''}
                          onChange={(e) => setRecuperacaoForm({...recuperacaoForm, novaSenha: e.target.value})}
                          className={`pr-10 ${errors.novaSenha ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.novaSenha && (
                        <p className="text-sm text-red-600">{errors.novaSenha}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmar-nova-senha">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmar-nova-senha"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repita a nova senha"
                          value={recuperacaoForm.confirmarSenha || ''}
                          onChange={(e) => setRecuperacaoForm({...recuperacaoForm, confirmarSenha: e.target.value})}
                          className={`pr-10 ${errors.confirmarSenha ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmarSenha && (
                        <p className="text-sm text-red-600">{errors.confirmarSenha}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Botão de Ação */}
                <Button 
                  onClick={handleRecuperacao}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <>
                      {etapaRecuperacao === 'cpf' && 'Enviar Código'}
                      {etapaRecuperacao === 'codigo' && 'Verificar Código'}
                      {etapaRecuperacao === 'senha' && 'Redefinir Senha'}
                    </>
                  )}
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Minha Cidade Conectada</p>
          <p>Sistema Municipal Integrado</p>
        </div>
      </div>
    </div>
  );
}