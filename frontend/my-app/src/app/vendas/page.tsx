"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X, Package, DollarSign, Calendar, Loader2 } from 'lucide-react';

// Types
interface Venda {
  venda_id: number;
  produto_nome: string;
  quantidade: number;
  valor_total: number;
  data_venda: string;
}

// Shadcn UI Components
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '', 
  ...props 
}: { 
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  className = '', 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}: { 
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'secondary';
  className?: string;
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    secondary: "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="border-b bg-gray-50">
    {children}
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y">
    {children}
  </tbody>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-700 ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-4 align-middle ${className}`}>
    {children}
  </td>
);

// Componente de Estatísticas
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'default' 
}: { 
  title: string; 
  value: string | number; 
  icon: any;
  variant?: 'default' | 'success' | 'warning';
}) => {
  const variants = {
    default: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600"
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${variants[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

// Componente Principal
export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    produto: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Carregar vendas
  useEffect(() => {
    carregarVendas();
  }, []);

  // Aplicar filtros quando vendas ou filtros mudarem
  useEffect(() => {
    aplicarFiltros();
  }, [vendas, filtros]);

  const carregarVendas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/vendas');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar vendas');
      }
      
      const data = await response.json();
      setVendas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar vendas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...vendas];

    // Filtro por período
    if (filtros.dataInicio) {
      resultado = resultado.filter(venda => {
        const dataVenda = new Date(venda.data_venda).toISOString().split('T')[0];
        return dataVenda >= filtros.dataInicio;
      });
    }

    if (filtros.dataFim) {
      resultado = resultado.filter(venda => {
        const dataVenda = new Date(venda.data_venda).toISOString().split('T')[0];
        return dataVenda <= filtros.dataFim;
      });
    }

    // Filtro por produto
    if (filtros.produto) {
      resultado = resultado.filter(venda =>
        venda.produto_nome.toLowerCase().includes(filtros.produto.toLowerCase())
      );
    }

    setVendasFiltradas(resultado);
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      produto: ''
    });
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
    } catch {
      return dataString;
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Estatísticas
  const totalVendas = vendasFiltradas.length;
  const valorTotalVendas = vendasFiltradas.reduce((acc, venda) => acc + venda.valor_total, 0);
  const quantidadeTotalProdutos = vendasFiltradas.reduce((acc, venda) => acc + venda.quantidade, 0);

  const filtrosAtivos = Object.values(filtros).some(v => v !== '');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as vendas realizadas</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Vendas"
            value={totalVendas}
            icon={Package}
            variant="default"
          />
          <StatsCard
            title="Valor Total"
            value={formatarMoeda(valorTotalVendas)}
            icon={DollarSign}
            variant="success"
          />
          <StatsCard
            title="Produtos Vendidos"
            value={quantidadeTotalProdutos}
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              {filtrosAtivos && (
                <Badge variant="default">{Object.values(filtros).filter(v => v !== '').length}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>

          {mostrarFiltros && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Data Início */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data Início
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={filtros.dataInicio}
                      onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Data Fim */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data Fim
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={filtros.dataFim}
                      onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Produto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Produto
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar por produto..."
                      value={filtros.produto}
                      onChange={(e) => setFiltros({ ...filtros, produto: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Botão Limpar Filtros */}
              {filtrosAtivos && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={limparFiltros}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Tabela de Vendas */}
        <Card>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Lista de Vendas
                {filtrosAtivos && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({vendasFiltradas.length} resultado{vendasFiltradas.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              <Button variant="ghost" size="sm" onClick={carregarVendas}>
                Atualizar
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={carregarVendas} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          ) : vendasFiltradas.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                {filtrosAtivos ? 'Nenhuma venda encontrada com os filtros aplicados' : 'Nenhuma venda registrada'}
              </p>
              {filtrosAtivos && (
                <Button variant="outline" onClick={limparFiltros} className="mt-4">
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Data da Venda</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendasFiltradas.map((venda) => (
                  <TableRow key={venda.venda_id}>
                    <TableCell className="font-medium">
                      #{venda.venda_id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {venda.produto_nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {venda.quantidade} {venda.quantidade === 1 ? 'unidade' : 'unidades'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatarMoeda(venda.valor_total)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatarData(venda.data_venda)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success">
                        Concluída
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}