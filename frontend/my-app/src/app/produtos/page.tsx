"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, AlertCircle, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import CreateProductDialog from '@/components/criarProduto';
import EditProductDialog from '@/components/editarProdutoDialog';

// Shadcn UI Components
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-xs",
    icon: "h-8 w-8 p-0"
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

// Delete Confirmation Dialog
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, productName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tem certeza que deseja excluir o produto <strong>{productName}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  
  // Ordenação
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modals
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch produtos
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = produtos;

    if (selectedCategoria !== 'all') {
      result = result.filter(p => p.categoria === selectedCategoria);
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      let compareValue = 0;
      
      switch(sortBy) {
        case 'nome':
          compareValue = a.nome.localeCompare(b.nome);
          break;
        case 'preco':
          compareValue = a.preco - b.preco;
          break;
        case 'estoque':
          compareValue = a.estoque - b.estoque;
          break;
        case 'id':
        default:
          compareValue = a.id - b.id;
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredProdutos(result);
  }, [produtos, searchTerm, selectedCategoria, sortBy, sortOrder]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/produtos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }

      const data = await response.json();
      setProdutos(data);
      
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

  const handleEdit = (productId) => {
    setEditingProductId(productId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:8000/api/produtos/${deleteConfirm.product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir produto');
      }

      // Atualizar lista após exclusão
      await fetchProdutos();
      setDeleteConfirm({ isOpen: false, product: null });
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir produto: ' + err.message);
    } finally {
      setIsDeleting(false);
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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  const handleProductCreated = () => {
    fetchProdutos();
    setIsCreateDialogOpen(false);
  };

  const handleProductUpdated = () => {
    fetchProdutos();
    setIsEditDialogOpen(false);
    setEditingProductId(null);
  };

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seu catálogo de produtos
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <Button
              variant={sortBy === 'nome' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('nome')}
              className="h-8 text-xs"
            >
              Nome {sortBy === 'nome' && getSortIcon('nome')}
            </Button>
            <Button
              variant={sortBy === 'preco' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('preco')}
              className="h-8 text-xs"
            >
              Preço {sortBy === 'preco' && getSortIcon('preco')}
            </Button>
            <Button
              variant={sortBy === 'estoque' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('estoque')}
              className="h-8 text-xs"
            >
              Estoque {sortBy === 'estoque' && getSortIcon('estoque')}
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredProdutos.length} de {produtos.length} produtos
          </div>
        </Card>

        {/* Tabela de Produtos */}
        {filteredProdutos.length === 0 ? (
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
                  <TableHead>
                    <button
                      onClick={() => handleSort('nome')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Nome
                      {getSortIcon('nome')}
                    </button>
                  </TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">
                    <button
                      onClick={() => handleSort('preco')}
                      className="flex items-center gap-2 ml-auto hover:text-blue-600 transition-colors"
                    >
                      Preço
                      {getSortIcon('preco')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('estoque')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Estoque
                      {getSortIcon('estoque')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(produto.id)}
                          title="Editar produto"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(produto)}
                          title="Excluir produto"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

      {/* Dialogs */}
      <CreateProductDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleProductCreated}
        categorias={categorias}
      />

      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingProductId(null);
        }}
        onSuccess={handleProductUpdated}
        productId={editingProductId}
        categorias={categorias}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
        onConfirm={handleDeleteConfirm}
        productName={deleteConfirm.product?.nome}
        isDeleting={isDeleting}
      />
    </div>
  );
}