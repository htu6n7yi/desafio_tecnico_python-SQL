// app/layout.tsx (atualize o existente)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar'; // Importe o componente

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Minha Loja Virtual',
  description: 'Uma pequena loja virtual feita com Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar /> {/* Adicione aqui para aparecer em todas as páginas */}
        {children}
      </body>
    </html>
  );
}
