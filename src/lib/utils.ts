// Utilitários para validação, formatação e helpers gerais

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utilitários de data com fuso horário de Brasília
export const obterDataBrasilia = (): Date => {
  const agora = new Date();
  // Ajusta para GMT-3 (Brasília)
  const offsetBrasilia = -3 * 60; // -3 horas em minutos
  const offsetLocal = agora.getTimezoneOffset();
  const diferenca = offsetBrasilia - offsetLocal;
  
  return new Date(agora.getTime() + (diferenca * 60 * 1000));
};

export const formatarDataBrasilia = (data?: string | Date): string => {
  let dataObj: Date;
  
  if (!data) {
    dataObj = obterDataBrasilia();
  } else {
    dataObj = typeof data === 'string' ? new Date(data) : data;
    // Se a data não tem informação de timezone, assume que é de Brasília
    if (typeof data === 'string' && !data.includes('T') && !data.includes('Z')) {
      dataObj = new Date(data + 'T00:00:00-03:00');
    }
  }
  
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const formatarDataHoraBrasilia = (data?: string | Date): string => {
  let dataObj: Date;
  
  if (!data) {
    dataObj = obterDataBrasilia();
  } else {
    dataObj = typeof data === 'string' ? new Date(data) : data;
    // Se a data não tem informação de timezone, assume que é de Brasília
    if (typeof data === 'string' && !data.includes('T') && !data.includes('Z')) {
      dataObj = new Date(data + 'T00:00:00-03:00');
    }
  }
  
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  const horas = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

export const obterDataISOBrasilia = (): string => {
  const dataBrasilia = obterDataBrasilia();
  return dataBrasilia.toISOString();
};

// Validações
export const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
  
  return true;
};

export const validarCNPJ = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
  
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

export const validarTelefone = (telefone: string): boolean => {
  const telefoneLimpo = telefone.replace(/[^\d]/g, '');
  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha: string): { valida: boolean; erros: string[] } => {
  const erros: string[] = [];
  
  if (senha.length < 8) {
    erros.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(senha)) {
    erros.push('A senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um caractere especial');
  }
  
  return {
    valida: erros.length === 0,
    erros
  };
};

// Formatações
export const formatarCPF = (cpf: string): string => {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatarCNPJ = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatarTelefone = (telefone: string): string => {
  const telefoneLimpo = telefone.replace(/[^\d]/g, '');
  
  if (telefoneLimpo.length === 10) {
    return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};

// Manter compatibilidade com código existente
export const formatarData = formatarDataBrasilia;
export const formatarDataHora = formatarDataHoraBrasilia;

export const formatarMoeda = (valor: number): string => {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
};

// Geradores
export const gerarProtocolo = (prefixo: string = 'SOL'): string => {
  const ano = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefixo}-${ano}-${timestamp}`;
};

export const gerarCodigoRecuperacao = (): string => {
  return Math.random().toString().slice(2, 8);
};

export const gerarSenhaTemporaria = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let senha = '';
  for (let i = 0; i < 8; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
};

export const gerarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Utilitários de data
export const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

export const calcularDiasEntre = (dataInicio: string | Date, dataFim: string | Date): number => {
  const inicio = typeof dataInicio === 'string' ? new Date(dataInicio) : dataInicio;
  const fim = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;
  const diffTime = Math.abs(fim.getTime() - inicio.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const obterInicioFimMes = (data?: Date) => {
  const agora = data || new Date();
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
  
  return {
    inicio: inicio.toISOString().split('T')[0],
    fim: fim.toISOString().split('T')[0]
  };
};

// Utilitários de string
export const capitalizar = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizarNome = (nome: string): string => {
  const preposicoes = ['de', 'da', 'do', 'das', 'dos', 'e'];
  
  return nome
    .toLowerCase()
    .split(' ')
    .map(palavra => {
      if (preposicoes.includes(palavra)) {
        return palavra;
      }
      return capitalizar(palavra);
    })
    .join(' ');
};

export const removerAcentos = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const slugify = (str: string): string => {
  return removerAcentos(str)
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Utilitários de array
export const agruparPor = <T>(array: T[], chave: keyof T): Record<string, T[]> => {
  return array.reduce((grupos, item) => {
    const grupo = String(item[chave]);
    if (!grupos[grupo]) {
      grupos[grupo] = [];
    }
    grupos[grupo].push(item);
    return grupos;
  }, {} as Record<string, T[]>);
};

export const ordenarPor = <T>(array: T[], chave: keyof T, ordem: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const valorA = a[chave];
    const valorB = b[chave];
    
    if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
    return 0;
  });
};

// Utilitários de arquivo
export const obterExtensaoArquivo = (nomeArquivo: string): string => {
  return nomeArquivo.split('.').pop()?.toLowerCase() || '';
};

export const validarTipoArquivo = (arquivo: File, tiposPermitidos: string[]): boolean => {
  const extensao = obterExtensaoArquivo(arquivo.name);
  return tiposPermitidos.includes(extensao);
};

export const formatarTamanhoArquivo = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const tamanhos = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamanhos[i];
};

// Utilitários de cor
export const hexParaRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const resultado = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return resultado ? {
    r: parseInt(resultado[1], 16),
    g: parseInt(resultado[2], 16),
    b: parseInt(resultado[3], 16)
  } : null;
};

export const rgbParaHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const obterContrasteCor = (hex: string): 'light' | 'dark' => {
  const rgb = hexParaRgb(hex);
  if (!rgb) return 'dark';
  
  const luminancia = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminancia > 0.5 ? 'dark' : 'light';
};

// Utilitários de localStorage
export const salvarLocalStorage = (chave: string, valor: any): void => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

export const obterLocalStorage = <T>(chave: string, valorPadrao?: T): T | null => {
  try {
    const item = localStorage.getItem(chave);
    return item ? JSON.parse(item) : valorPadrao || null;
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error);
    return valorPadrao || null;
  }
};

export const removerLocalStorage = (chave: string): void => {
  try {
    localStorage.removeItem(chave);
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
  }
};

// Utilitários de debounce e throttle
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Utilitários de URL
export const construirUrl = (base: string, params: Record<string, any>): string => {
  const url = new URL(base);
  Object.entries(params).forEach(([chave, valor]) => {
    if (valor !== null && valor !== undefined) {
      url.searchParams.append(chave, String(valor));
    }
  });
  return url.toString();
};

export const obterParametrosUrl = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const resultado: Record<string, string> = {};
  
  params.forEach((valor, chave) => {
    resultado[chave] = valor;
  });
  
  return resultado;
};