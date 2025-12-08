# 🛍️ Sistema de Loja Virtual - API REST

> API de gerenciamento de vendas, desenvolvida em Python com FastAPI e MySQL. Projeto surgiu como desafio técnico e foi aprimorado para ser utilizado com frontend próprio.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando a API](#-executando-a-api)
- [Documentação da API](#-documentação-da-api)
- [Testes](#-testes)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Este projeto surgiu como **desafio técnico** para uma vaga de estágio. Decidi aprimorá-lo, criando uma **API completa** para gerenciamento de produtos e vendas e um **frontend próprio** para manipulação dos dados.  

O objetivo é **demonstrar boas práticas de desenvolvimento**, controle de estoque, vendas e relatórios gerenciais, servindo tanto para aprendizado quanto para portfólio.  

O frontend está sendo desenvolvido com **Next.js, React, Tailwind e Shadcn UI**. Para referência rápida, você pode acessar a interface pelo link [Frontend](#) (README separado será criado para ele).

---

## 🛠️ Tecnologias

### Backend
- **Python 3.11+**  
- **FastAPI** - Framework web moderno e rápido  
- **Pydantic** - Validação de dados  
- **Uvicorn** - Servidor ASGI de alta performance  

### Banco de Dados
- **MySQL 8.0+**  
- **mysql-connector-python** - Conector oficial  

### Desenvolvimento Frontend (referência)
- **Next.js + React**  
- **Tailwind CSS**  
- **Shadcn UI**  

### Desenvolvimento & Testes
- **python-dotenv** - Variáveis de ambiente  
- **pytest** - Testes automatizados  

---

## 🚀 Funcionalidades

### Produtos
- Listar, buscar por ID, criar e atualizar produtos  
- Filtrar produtos por categoria  
- Verificar produtos com estoque baixo  

### Vendas
- Registrar vendas com atualização automática de estoque  
- Filtrar vendas por período (data início/fim)  
- Transações seguras com rollback em caso de erro  

### Relatórios
- Produtos com estoque abaixo do limite  
- Resumo geral: total de produtos, vendas e faturamento  
- Lista de categorias disponíveis  

### Segurança & Validação
- Validação de dados com Pydantic  
- Tratamento de exceções personalizado  
- Prevenção de vendas sem estoque  
- Logs detalhados de erros  

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Python 3.11+  
- MySQL 8.0+  
- Git  
- pip  

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/htu6n7yi/desafio_tecnico_python-SQL.git
cd desafio_tecnico_python-SQL

# Crie e ative o ambiente virtual
python -m venv .venv
# Windows
.\.venv\Scripts\Activate.ps1
# Linux/Mac
source .venv/bin/activate

# Instale dependências
pip install --upgrade pip
pip install -r requirements.txt

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais MySQL

# Inicialize o banco de dados
python codigo/database.py

# Executar todos os testes
pytest -v

# Com cobertura
pytest --cov=codigo

###🤝 Passo a passo

Contribuições são bem-vindas! Para colaborar com o projeto:

1. **Fork** o repositório  
2. Crie uma branch para sua feature:  
   ```bash
   git checkout -b feature/MinhaFeature


### 👨‍💻 Autor

José Carlos Cavalcanti

Estudante de Sistemas de Informação

Desenvolvedor Full Stack em formação

📧 jcavalcanti008@gmail.com

🌐 GitHub: @htu6n7yi

