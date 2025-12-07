"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, AlertCircle, Loader2 } from 'lucide-react';

// Shadcn UI Components
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Select = ({ children, value, onChange, className = '', ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Table = ({ children }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="border-b bg-gray-50">
    {children}
  </thead>
);

const TableBody = ({ children }) => (
  <tbody className="divide-y">
    {children}
  </tbody>
);

const TableRow = ({ children }) => (
  <tr className="border-b transition-colors hover:bg-gray-50">
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-700 ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }) => (
  <td className={`p-4 align-middle ${className}`}>
    {children}
  </td>
);

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

// Main Component
export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('all');

  // Fetch produtos
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = produtos;

    // Filtro por categoria
    if (selectedCategoria !== 'all') {
      result = result.filter(p => p.categoria === selectedCategoria);
    }

    // Filtro por busca
    if (searchTerm) {
      result = result.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProdutos(result);
  }, [produtos, searchTerm, selectedCategoria]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/produtos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }

      const data = await response.json();
      setProdutos(data);
      
      // Extrair categorias únicas
      const uniqueCategorias = [...new Set(data.map(p => p.categoria))];
      setCategorias(uniqueCategorias);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEstoqueBadge = (estoque) => {
    if (estoque === 0) {
      return <Badge variant="danger">Sem estoque</Badge>;
    } else if (estoque < 5) {
      return <Badge variant="warning">Estoque baixo ({estoque})</Badge>;
    } else {
      return <Badge variant="success">{estoque} unidades</Badge>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando produtos...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Erro ao carregar produtos</h3>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <Button onClick={fetchProdutos} className="mt-4">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seu catálogo de produtos
            </p>
          </div>
          <Button onClick={() => alert('Funcionalidade em desenvolvimento')}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por categoria */}
            <Select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredProdutos.length} de {produtos.length} produtos
          </div>
        </Card>

        {/* Tabela de Produtos */}
        {filteredProdutos.length === 0 ? (
          // Empty State
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategoria !== 'all' 
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Comece adicionando seu primeiro produto'}
              </p>
              {(searchTerm || selectedCategoria !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategoria('all');
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium text-gray-600">
                      #{produto.id}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {produto.nome}
                    </TableCell>
                    <TableCell>
                      <Badge>{produto.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      {formatPrice(produto.preco)}
                    </TableCell>
                    <TableCell>
                      {getEstoqueBadge(produto.estoque)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total de Produtos</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {produtos.length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Estoque Baixo</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">
              {produtos.filter(p => p.estoque < 5 && p.estoque > 0).length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Sem Estoque</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {produtos.filter(p => p.estoque === 0).length}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}