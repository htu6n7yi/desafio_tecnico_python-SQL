'use client';

import { buscarProdutoPorId, buscarTodosProdutos } from "@/services/apiProdutos";
import { buscarTodasVendas } from "@/services/apiVendas";
import Image from "next/image";
import { useEffect, useState } from "react";
import CardDashboard from "@/components/cardDashBoard";

export default function Home() {
const [produtos, setProdutos] = useState([]);
const [destaque, setDestaque] = useState<any>(null);

  useEffect(() => {
    // Carregar todos os produtos
    const carregarDados = async () => {
      // 1. Busca geral
      const dados = await buscarTodosProdutos();
      setProdutos(dados);
    };

    carregarDados();
  }, []);

  const [vendas, setVendas] = useState([]);
    useEffect(() => {
      const carregarVendas = async () => {
        const dadosVendas = await buscarTodasVendas();
        setVendas(dadosVendas);
      };

      carregarVendas();
    }, []);


  return (
    <div className="container mx-auto p-6">
      
        <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900"> Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardDashboard
    title="Total de Produtos"
    value={produtos.length}
    subtitle="↑ 12% vs. mês passado"
    icon={
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    }
  />

  <CardDashboard
    title="Total de Vendas"
    value={vendas.length}
    subtitle="↑ 12% vs. mês passado"
    icon={
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    }
  />

  {/* Estoque baixo */}
  <CardDashboard
    title="Estoque Baixo"
    value={`${produtos.filter(p => p.estoque < 3).length} produtos`}
    bg="bg-orange-50"
    border="border-orange-200"
    textColor="text-orange-900"
    subtitle="Menos de 3 unidades"
    icon={
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5 19h14l-7-14-7 14z"/>
      </svg>
    }
  />

  {/* Sem estoque */}
  <CardDashboard
    title="Estoque Zerado"
    value={`${produtos.filter(p => p.estoque === 0).length} produtos`}
    bg="bg-red-50"
    border="border-red-200"
    textColor="text-red-900"
    subtitle="Produtos sem estoque"
    icon={
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5 19h14l-7-14-7 14z"/>
      </svg>
    }
  />

  <CardDashboard
    title="Valor total de vendas: "
    value={`R$ ${vendas.reduce((total: number, venda: any) => total + venda.valor_total, 0).toFixed(2)}`}
    subtitle={"Valor acumulado de todas as vendas"}
    icon={
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-6.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414"/>
      </svg>
    }
  />
                
            </div>
        </section>
    </div>
  );
}
