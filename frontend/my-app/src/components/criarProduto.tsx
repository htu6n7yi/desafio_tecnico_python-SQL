"use client";

import React, { useState } from 'react';
import { X, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';

// Schema de validação Zod
const productSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  preco: z.number({ invalid_type_error: "Preço deve ser um número" }).positive("Preço deve ser maior que zero"),
  estoque: z.number({ invalid_type_error: "Estoque deve ser um número" }).min(0, "Estoque não pode ser negativo")
});

type ProductFormData = z.infer<typeof productSchema>;

interface CreateProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categorias?: string[];
}

// Shadcn UI Components
const Dialog = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
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
  variant?: 'success' | 'error'; 
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
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${styles[variant].container}`}>
      {styles[variant].icon}
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
};

export default function CreateProductDialog({ 
  isOpen, 
  onClose, 
  onSuccess,
  categorias = []
}: CreateProductDialogProps) {
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    nome: '',
    categoria: '',
    preco: undefined,
    estoque: 0
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Lista de categorias padrão se não for fornecida
  const categoriasDisponiveis = categorias.length > 0 
    ? categorias 
    : ['Eletrônicos', 'Roupas', 'Alimentos', 'Livros', 'Móveis', 'Outros'];

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Limpa mensagem de status
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const validateForm = (): boolean => {
    try {
      // Converte strings vazias para undefined antes de validar
      const dataToValidate = {
        ...formData,
        preco: formData.preco === '' ? undefined : Number(formData.preco),
        estoque: formData.estoque === '' ? undefined : Number(formData.estoque)
      };

      productSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ProductFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('http://localhost:8000/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          categoria: formData.categoria,
          preco: Number(formData.preco),
          estoque: Number(formData.estoque)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar produto');
      }

      // Sucesso
      setSubmitStatus('success');
      
      // Aguarda 1.5s e fecha o modal
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao criar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      nome: '',
      categoria: '',
      preco: undefined,
      estoque: 0
    });
    setErrors({});
    setSubmitStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Produto</h2>
          <p className="text-sm text-gray-600 mt-1">Preencha os dados do novo produto</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Feedback de sucesso/erro */}
        {submitStatus === 'success' && (
          <Alert variant="success">
            <strong>Produto criado com sucesso!</strong>
            <br />
            Fechando em instantes...
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="error">
            <strong>Erro ao criar produto</strong>
            <br />
            {errorMessage}
          </Alert>
        )}

        {/* Nome */}
        <Input
          label="Nome do Produto"
          type="text"
          placeholder="Ex: Notebook Dell Inspiron"
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          error={errors.nome}
          required
          disabled={isSubmitting}
        />

        {/* Categoria */}
        <Select
          label="Categoria"
          value={formData.categoria}
          onChange={(e) => handleChange('categoria', e.target.value)}
          error={errors.categoria}
          required
          disabled={isSubmitting}
        >
          <option value="">Selecione uma categoria</option>
          {categoriasDisponiveis.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        {/* Preço e Estoque em Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Preço */}
          <Input
            label="Preço"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.preco ?? ''}
            onChange={(e) => handleChange('preco', e.target.value)}
            error={errors.preco}
            required
            disabled={isSubmitting}
          />

          {/* Estoque */}
          <Input
            label="Estoque"
            type="number"
            min="0"
            placeholder="0"
            value={formData.estoque ?? ''}
            onChange={(e) => handleChange('estoque', e.target.value)}
            error={errors.estoque}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Footer Buttons */}
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
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}