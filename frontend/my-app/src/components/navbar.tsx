"use client"; // Necessário para interatividade (ex.: estado do menu mobile)

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, ShoppingCart, User, Menu } from "lucide-react"; // Ícones

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para menu
  const [isOpenSearch, setIsOpenSearch] = useState(false); // Estado para busca

  return (
    <div>
      <nav className=" bg-slate-400 shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <div className="flex flex-row gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className=" hover:bg-gray-100 my-auto"
                >
                  <Menu size={20} />
                </Button>

                {/* Logo */}
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
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-gray-700 hover:text-blue-600"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-gray-700 hover:text-blue-600"
                >
                  Produtos
                </Link>
                <Link
                  href="/sales"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-gray-700 hover:text-blue-600"
                >
                  Vendas
                </Link>
               
                <Separator />
              </div>
            </SheetContent>
          </Sheet>

          {/* Barra de Busca e Ícones */}
          <div className="flex items-center space-x-4">
            {/* Barra de Busca */}
            <div className="relative sm:block hidden ">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white border-none"
                size={20}
              />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10 w-64 border-none text-blue-100 bg-white/10"
              />
            </div>

            {/* Ícones */}
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
           

            {/* Menu (Hambúrguer) */}
          </div>
        </div>
      </nav>

      <div
        className="w-full p-4"
        style={{ display: isOpenSearch ? "flex" : "none" }}
      >
        <Input
          type="text"
          placeholder="Buscar..."
          className=" flex border-gray-500 mx-1"
        />
      </div>
    </div>
  );
}
