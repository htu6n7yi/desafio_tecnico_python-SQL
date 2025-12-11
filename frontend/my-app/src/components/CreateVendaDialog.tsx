"use client";

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Loader2, CheckCircle, AlertCircle, Package, DollarSign } from 'lucide-react';
import { z } from 'zod';

// Schema de validação Zod
const vendaSchema = z.object({
  produto_id: z.number({ invalid_type_error: "Produto é obrigatório" }).positive("Selecione um produto"),
  quantidade: z.number({ invalid_type_error: "Quantidade deve ser um número" }).positive("Quantidade deve ser maior que zero")
});

type VendaFormData = z.infer<typeof vendaSchema>;

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
}

interface CreateVendaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Shadcn UI Components
const Dialog = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-50">
        {children}
      </div>
    </div>
  );
};

const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}: { 
  label: string; 
  error?: string; 
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
);

const Select = ({ 
  label, 
  error, 
  children,
  ...props 
}: { 
  label: string; 
  error?: string; 
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      {...props}
    >
      {children}
    </select>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
);

const Button = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}: { 
  variant?: 'default' | 'outline' | 'ghost';
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} px-4 py-2 h-10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Alert = ({ 
  variant = 'success', 
  children 
}: { 
  variant?: 'success' | 'error' | 'warning'; 
  children: React.ReactNode 
}) => {
  const styles = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${styles[variant].container}`}>
      {styles[variant].icon}
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
};

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

export default function CreateVendaDialog({ 
  isOpen, 
  onClose, 
  onSuccess
}: CreateVendaDialogProps) {
  const [formData, setFormData] = useState<Partial<VendaFormData>>({
    produto_id: undefined,
    quantidade: 1
  });

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof VendaFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      carregarProdutos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.produto_id) {
      const produto = produtos.find(p => p.id === formData.produto_id);
      setProdutoSelecionado(produto || null);
    } else {
      setProdutoSelecionado(null);
    }
  }, [formData.produto_id, produtos]);

  const carregarProdutos = async () => {
    setIsLoadingProdutos(true);
    try {
      const response = await fetch('http://localhost:8000/api/produtos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      
      const data = await response.json();
      const produtosDisponiveis = data.filter((p: Produto) => p.estoque > 0);
      setProdutos(produtosDisponiveis);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErrorMessage('Erro ao carregar produtos. Tente novamente.');
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  const handleChange = (field: keyof VendaFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const validateForm = (): boolean => {
    try {
      const dataToValidate = {
        produto_id: formData.produto_id === '' ? undefined : Number(formData.produto_id),
        quantidade: formData.quantidade === '' ? undefined : Number(formData.quantidade)
      };

      vendaSchema.parse(dataToValidate);

      if (produtoSelecionado && dataToValidate.quantidade) {
        if (dataToValidate.quantidade > produtoSelecionado.estoque) {
          setErrors({ quantidade: `Estoque disponível: ${produtoSelecionado.estoque} unidades` });
          return false;
        }
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof VendaFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof VendaFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('http://localhost:8000/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produto_id: Number(formData.produto_id),
          quantidade: Number(formData.quantidade)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao registrar venda');
      }

      setSubmitStatus('success');
      
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao registrar venda');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      produto_id: undefined,
      quantidade: 1
    });
    setProdutoSelecionado(null);
    setErrors({});
    setSubmitStatus('idle');
    setErrorMessage('');
    onClose();
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularValorTotal = () => {
    if (produtoSelecionado && formData.quantidade) {
      return produtoSelecionado.preco * Number(formData.quantidade);
    }
    return 0;
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Registrar Venda</h2>
          <p className="text-sm text-gray-600 mt-1">Selecione o produto e a quantidade</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {submitStatus === 'success' && (
          <Alert variant="success">
            <strong>Venda registrada com sucesso!</strong>
            <br />
            O estoque foi atualizado automaticamente.
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="error">
            <strong>Erro ao registrar venda</strong>
            <br />
            {errorMessage}
          </Alert>
        )}

        {isLoadingProdutos ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando produtos...</span>
          </div>
        ) : produtos.length === 0 ? (
          <Alert variant="warning">
            <strong>Nenhum produto disponível</strong>
            <br />
            Não há produtos com estoque disponível para venda. Adicione produtos primeiro.
          </Alert>
        ) : (
          <>
            <Select
              label="Produto"
              value={formData.produto_id || ''}
              onChange={(e) => handleChange('produto_id', Number(e.target.value))}
              error={errors.produto_id}
              required
              disabled={isSubmitting}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - {formatarMoeda(produto.preco)} (Estoque: {produto.estoque})
                </option>
              ))}
            </Select>

            {produtoSelecionado && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">{produtoSelecionado.nome}</h3>
                    <p className="text-sm text-blue-700">
                      <Badge variant="secondary">{produtoSelecionado.categoria}</Badge>
                    </p>
                  </div>
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200">
                  <div>
                    <p className="text-xs text-blue-600">Preço unitário</p>
                    <p className="text-sm font-semibold text-blue-900">
                      {formatarMoeda(produtoSelecionado.preco)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Estoque disponível</p>
                    <p className="text-sm font-semibold text-blue-900">
                      {produtoSelecionado.estoque} unidades
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Quantidade"
              type="number"
              min="1"
              max={produtoSelecionado?.estoque || 999}
              placeholder="0"
              value={formData.quantidade ?? ''}
              onChange={(e) => handleChange('quantidade', Number(e.target.value))}
              error={errors.quantidade}
              required
              disabled={isSubmitting || !produtoSelecionado}
            />

            {produtoSelecionado && formData.quantidade && Number(formData.quantidade) > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">Valor Total da Venda</p>
                      <p className="text-xs text-green-600">
                        {formData.quantidade}x {formatarMoeda(produtoSelecionado.preco)}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatarMoeda(calcularValorTotal())}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoadingProdutos || produtos.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Registrar Venda
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}