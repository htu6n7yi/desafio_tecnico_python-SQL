"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  categorias: string[];
}

// Shadcn UI Components
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Button = ({ children, variant = 'default', className = '', disabled = false, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} px-4 py-2 ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
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

const Label = ({ children, className = '' }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

const Alert = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
    error: "bg-red-50 text-red-900 border-red-200"
  };
  
  return (
    <div className={`rounded-lg border p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default function EditProductDialog({ 
  isOpen, 
  onClose, 
  onSuccess, 
  productId,
  categorias 
}: EditProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    preco: '',
    estoque: ''
  });

  const [errors, setErrors] = useState({
    nome: '',
    categoria: '',
    preco: '',
    estoque: ''
  });

  // Buscar dados do produto ao abrir o dialog
  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await fetch(`http://localhost:8000/api/produtos/${productId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produto');
      }

      const data = await response.json();
      setFormData({
        nome: data.nome,
        categoria: data.categoria,
        preco: data.preco.toString(),
        estoque: data.estoque.toString()
      });
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      nome: '',
      categoria: '',
      preco: '',
      estoque: ''
    };

    let isValid = true;

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    // Validar categoria
    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
      isValid = false;
    }

    // Validar preço
    const preco = parseFloat(formData.preco);
    if (!formData.preco || isNaN(preco)) {
      newErrors.preco = 'Preço é obrigatório';
      isValid = false;
    } else if (preco <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
      isValid = false;
    }

    // Validar estoque
    const estoque = parseInt(formData.estoque);
    if (formData.estoque === '' || isNaN(estoque)) {
      newErrors.estoque = 'Estoque é obrigatório';
      isValid = false;
    } else if (estoque < 0) {
      newErrors.estoque = 'Estoque não pode ser negativo';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        nome: formData.nome.trim(),
        categoria: formData.categoria,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque)
      };

      const response = await fetch(`http://localhost:8000/api/produtos/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar produto');
      }

      setSuccess(true);
      
      // Aguardar um momento para mostrar mensagem de sucesso
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nome: '',
        categoria: '',
        preco: '',
        estoque: ''
      });
      setErrors({
        nome: '',
        categoria: '',
        preco: '',
        estoque: ''
      });
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar Produto
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          {loadingProduct ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando produto...</span>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {error && (
                <Alert variant="error" className="mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Erro</h4>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert variant="success" className="mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Sucesso!</h4>
                      <p className="text-sm mt-1">Produto atualizado com sucesso.</p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <Label>Nome do Produto *</Label>
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: Notebook Dell"
                    disabled={loading}
                    className={errors.nome ? 'border-red-500' : ''}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-600 mt-1">{errors.nome}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <Label>Categoria *</Label>
                  <Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.categoria ? 'border-red-500' : ''}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                  {errors.categoria && (
                    <p className="text-sm text-red-600 mt-1">{errors.categoria}</p>
                  )}
                </div>

                {/* Preço */}
                <div>
                  <Label>Preço (R$) *</Label>
                  <Input
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={loading}
                    className={errors.preco ? 'border-red-500' : ''}
                  />
                  {errors.preco && (
                    <p className="text-sm text-red-600 mt-1">{errors.preco}</p>
                  )}
                </div>

                {/* Estoque */}
                <div>
                  <Label>Quantidade em Estoque *</Label>
                  <Input
                    type="number"
                    name="estoque"
                    value={formData.estoque}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    disabled={loading}
                    className={errors.estoque ? 'border-red-500' : ''}
                  />
                  {errors.estoque && (
                    <p className="text-sm text-red-600 mt-1">{errors.estoque}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}