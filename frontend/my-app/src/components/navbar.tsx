"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, User, Menu } from "lucide-react";
import { buscarProdutoPorId } from "@/services/apiProdutos";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [search, setSearch] = useState("");
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ALERTA (fica escondido até aparecer)
  const [alerta, setAlerta] = useState<null | { tipo: string; mensagem: string }>(null);

  // Função para exibir alerta bonito
  const mostrarAlerta = (mensagem: string, tipo: "erro" | "sucesso" = "erro") => {
    setAlerta({ tipo, mensagem });

    setTimeout(() => {
      setAlerta(null);
    }, 3000);
  };

  // Função para buscar produto
  const buscar = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);

      const resultado = await buscarProdutoPorId(search);

      if (!resultado) {
        setProduto(null);
        mostrarAlerta("Produto não encontrado. Verifique o ID informado.");
        return;
      }

      setProduto(resultado);

    } catch (err) {
      mostrarAlerta("Erro ao buscar produto. A API pode estar offline.");
      setProduto(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="bg-slate-400 shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <div className="flex flex-row gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 my-auto">
                  <Menu size={20} />
                </Button>

                <div>
                  <Link href="/">
                    <h1 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                      Minha Loja
                    </h1>
                    <h5 className="text-sm text-gray-500">Virtual</h5>
                  </Link>
                </div>
              </div>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-4">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Link href="/products" className="text-lg text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Produtos
                </Link>
                <Link href="/sales" className="text-lg text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Vendas
                </Link>

                <Separator />
              </div>
            </SheetContent>
          </Sheet>

          {/* Barra de busca desktop */}
          <div className="flex items-center space-x-4">
            <div className="relative sm:block hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={20} />
              <Input
                type="text"
                placeholder="Buscar por ID..."
                className="pl-10 w-64 border-none text-blue-100 bg-white/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 md:hidden"
              onClick={() => setIsOpenSearch(!isOpenSearch)}
            >
              <Search size={20} />
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <User size={20} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Barra de busca mobile */}
      <div className="w-full p-4" style={{ display: isOpenSearch ? "flex" : "none" }}>
        <Input
          type="text"
          placeholder="Buscar por ID..."
          className="flex border-gray-500 mx-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
        />
        <Button onClick={buscar} className="ml-2">
          Buscar
        </Button>
      </div>

      {/* 🔔 ALERTA BONITO */}
      {alerta && (
        <div
          className={`mx-auto mt-4 w-fit px-4 py-2 rounded-lg text-white shadow-md transition-all ${
            alerta.tipo === "erro" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {alerta.mensagem}
        </div>
      )}

      {/* Card somente quando produto existe */}
      {produto && (
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Produto encontrado: {produto.nome}</CardTitle>
              <CardDescription>
                Preço: R$ {produto.preco} — {produto.descricao}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {loading && <p className="text-center mt-4">Buscando...</p>}
    </div>
  );
}
