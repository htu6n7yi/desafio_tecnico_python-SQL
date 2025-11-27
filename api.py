import sys
from pathlib import Path

# Adiciona a pasta codigo ao path do Python
sys.path.insert(0, str(Path(__file__).parent / "codigo"))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from produto import ProdutoRepo
from venda import VendaRepo
from exceptions import (
    ProdutoNaoEncontradoError, 
    EstoqueInsuficienteError,
    QuantidadeInvalidaError
)

app = FastAPI(
    title="Loja Virtual API",
    description="API REST para gerenciamento de produtos e vendas",
    version="1.0.0"
)

# Configuração CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models Pydantic para validação
class ProdutoCreate(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100)
    categoria: str = Field(..., min_length=1, max_length=50)
    preco: float = Field(..., gt=0)
    estoque: int = Field(..., ge=0)

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=100)
    categoria: Optional[str] = None
    preco: Optional[float] = Field(None, gt=0)
    estoque: Optional[int] = Field(None, ge=0)

class VendaCreate(BaseModel):
    produto_id: int = Field(..., gt=0)
    quantidade: int = Field(..., gt=0)

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    categoria: str
    preco: float
    estoque: int

class VendaResponse(BaseModel):
    venda_id: int
    produto_nome: str
    quantidade: int
    valor_total: float
    data_venda: str

# Inicialização dos repositórios
produto_repo = ProdutoRepo()
venda_repo = VendaRepo()

# ==================== ENDPOINTS DE PRODUTOS ====================

@app.get("/", tags=["Root"])
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "Loja Virtual API - Bem-vindo!",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "produtos": "/api/produtos",
            "vendas": "/api/vendas"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Verifica o status da API"""
    try:
        # Testa conexão com o banco
        produtos = produto_repo.listar_todos()
        return {
            "status": "healthy",
            "database": "connected",
            "produtos_count": len(produtos)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

@app.get("/api/produtos", response_model=List[ProdutoResponse], tags=["Produtos"])
async def listar_produtos(
    categoria: Optional[str] = Query(None, description="Filtrar por categoria")
):
    """Lista todos os produtos ou filtra por categoria"""
    try:
        if categoria:
            produtos = produto_repo.filtrar_por_categoria(categoria)
        else:
            produtos = produto_repo.listar_todos()
        
        return produtos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar produtos: {str(e)}")

@app.get("/api/produtos/{produto_id}", response_model=ProdutoResponse, tags=["Produtos"])
async def buscar_produto(produto_id: int):
    """Busca um produto específico por ID"""
    try:
        produto = produto_repo.buscar_por_id(produto_id)
        if not produto:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        
        return produto
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar produto: {str(e)}")

@app.post("/api/produtos", response_model=ProdutoResponse, status_code=201, tags=["Produtos"])
async def criar_produto(produto: ProdutoCreate):
    """Cria um novo produto"""
    try:
        produto_id = produto_repo.criar_produto(
            nome=produto.nome,
            preco=produto.preco,
            categoria=produto.categoria,
            estoque=produto.estoque
        )
        
        novo_produto = produto_repo.buscar_por_id(produto_id)
        if not novo_produto:
            raise HTTPException(status_code=500, detail="Erro ao buscar produto criado")
        
        return novo_produto
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar produto: {str(e)}")

@app.put("/api/produtos/{produto_id}", response_model=ProdutoResponse, tags=["Produtos"])
async def atualizar_produto(produto_id: int, produto: ProdutoUpdate):
    """Atualiza um produto existente"""
    try:
        # Verifica se o produto existe
        produto_existente = produto_repo.buscar_por_id(produto_id)
        if not produto_existente:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        
        # Atualiza apenas os campos fornecidos
        if produto.estoque is not None:
            produto_repo.atualizar_estoque(produto_id, produto.estoque)
        
        # Busca o produto atualizado
        produto_atualizado = produto_repo.buscar_por_id(produto_id)
        return produto_atualizado
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar produto: {str(e)}")

# ==================== ENDPOINTS DE VENDAS ====================

@app.get("/api/vendas", response_model=List[VendaResponse], tags=["Vendas"])
async def listar_vendas(
    data_inicio: Optional[date] = Query(None, description="Data inicial (YYYY-MM-DD)"),
    data_fim: Optional[date] = Query(None, description="Data final (YYYY-MM-DD)")
):
    """Lista todas as vendas ou filtra por período"""
    try:
        if data_inicio and data_fim:
            vendas = venda_repo.buscar_por_periodo(
                data_inicio.strftime("%Y-%m-%d"),
                data_fim.strftime("%Y-%m-%d")
            )
        else:
            vendas = venda_repo.listar_vendas()
        
        return vendas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar vendas: {str(e)}")

@app.post("/api/vendas", status_code=201, tags=["Vendas"])
async def criar_venda(venda: VendaCreate):
    """Registra uma nova venda e atualiza o estoque automaticamente"""
    try:
        venda_id, valor_total = venda_repo.registrar_venda(
            produto_id=venda.produto_id,
            quantidade=venda.quantidade
        )
        
        # Busca informações completas da venda
        vendas = venda_repo.listar_vendas()
        venda_criada = next((v for v in vendas if v['venda_id'] == venda_id), None)
        
        if not venda_criada:
            return {
                "venda_id": venda_id,
                "produto_id": venda.produto_id,
                "quantidade": venda.quantidade,
                "valor_total": valor_total,
                "message": "Venda registrada com sucesso!"
            }
        
        return venda_criada
        
    except ProdutoNaoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except EstoqueInsuficienteError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except QuantidadeInvalidaError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao registrar venda: {str(e)}")

# ==================== ENDPOINTS DE RELATÓRIOS ====================

@app.get("/api/relatorios/produtos-estoque-baixo", tags=["Relatórios"])
async def produtos_estoque_baixo(limite: int = Query(5, ge=0, description="Quantidade mínima de estoque")):
    """Lista produtos com estoque abaixo do limite especificado"""
    try:
        produtos = produto_repo.listar_todos()
        produtos_baixo = [
            {
                "id": p['id'],
                "nome": p['nome'],
                "categoria": p['categoria'],
                "estoque": p['estoque'],
                "preco": p['preco']
            }
            for p in produtos if p['estoque'] < limite
        ]
        
        return {
            "limite": limite,
            "total_produtos": len(produtos_baixo),
            "produtos": produtos_baixo
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar produtos: {str(e)}")

@app.get("/api/relatorios/categorias", tags=["Relatórios"])
async def listar_categorias():
    """Lista todas as categorias de produtos disponíveis"""
    try:
        produtos = produto_repo.listar_todos()
        categorias = list(set(p['categoria'] for p in produtos))
        
        return {
            "total": len(categorias),
            "categorias": sorted(categorias)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar categorias: {str(e)}")

@app.get("/api/relatorios/resumo", tags=["Relatórios"])
async def resumo_geral():
    """Retorna um resumo geral do sistema"""
    try:
        produtos = produto_repo.listar_todos()
        vendas = venda_repo.listar_vendas()
        
        total_produtos = len(produtos)
        total_vendas = len(vendas)
        valor_total_vendas = sum(v['valor_total'] for v in vendas)
        produtos_sem_estoque = sum(1 for p in produtos if p['estoque'] == 0)
        
        return {
            "produtos": {
                "total": total_produtos,
                "sem_estoque": produtos_sem_estoque,
                "com_estoque": total_produtos - produtos_sem_estoque
            },
            "vendas": {
                "total": total_vendas,
                "valor_total": float(valor_total_vendas)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar resumo: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=False)