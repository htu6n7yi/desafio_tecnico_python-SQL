# 🛍️ Sistema de Loja Virtual - API REST

> Sistema completo de gerenciamento de vendas desenvolvido em Python com FastAPI, MySQL e deploy no Railway.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [✨ Início Rápido](#-início-rápido)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#️-banco-de-dados)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Documentação da API](#-documentação-da-api)
- [Endpoints](#-endpoints)
- [Deploy](#-deploy)
- [Testes](#-testes)
- [Contribuindo](#-contribuindo)
- [Autor](#-autor)

---

## ✨ Início Rápido

**Quer começar agora? Siga estes passos:**

```bash
# 1. Clone o repositório
git clone https://github.com/htu6n7yi/desafio_tecnico_python-SQL.git
cd desafio_tecnico_python-SQL

# 2. Crie o ambiente virtual e instale dependências
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt

# 3. Configure o banco de dados
# Edite o arquivo codigo/database.py com suas credenciais MySQL
# Ou crie um arquivo .env (veja .env.example)

# 4. Inicialize o banco
python codigo/database.py

# 5. Execute a API
python -m uvicorn api:app --reload

# 6. Acesse a documentação
# http://localhost:8000/docs
```

✅ **Pronto!** Sua API está rodando em http://localhost:8000

---

## 🎯 Sobre o Projeto

Sistema de gerenciamento de vendas desenvolvido como desafio técnico, permitindo o controle completo de produtos, vendas e estoque através de uma API REST moderna e eficiente.

### Características Principais

- ✅ **API REST completa** com FastAPI
- ✅ **CRUD de produtos** (Create, Read, Update, Delete)
- ✅ **Sistema de vendas** com controle automático de estoque
- ✅ **Transações seguras** com rollback em caso de erro
- ✅ **Relatórios gerenciais** (estoque baixo, categorias, resumo geral)
- ✅ **Documentação automática** com Swagger UI
- ✅ **Validação de dados** com Pydantic
- ✅ **CORS configurado** para integração com frontend
- ✅ **Pronto para deploy** no Railway, Render ou AWS

---

## 🚀 Funcionalidades

### 📦 Gerenciamento de Produtos

- **Listar todos os produtos** com ordenação por ID
- **Buscar produto por ID** com validação
- **Filtrar produtos por categoria**
- **Criar novos produtos** com validação de dados
- **Atualizar estoque** de produtos existentes
- **Verificar produtos com estoque baixo**

### 🛒 Sistema de Vendas

- **Registrar vendas** com cálculo automático do valor total
- **Atualização automática de estoque** após venda (transações ACID)
- **Listar todas as vendas** com informações do produto
- **Filtrar vendas por período** (data início e fim)
- **Validação de estoque** antes de confirmar venda
- **Rollback automático** em caso de erro

### 📊 Relatórios Gerenciais

- **Produtos com estoque crítico** (abaixo de X unidades)
- **Resumo geral do sistema** (total de produtos, vendas, faturamento)
- **Listar todas as categorias** disponíveis
- **Estatísticas de vendas** por período

### 🔒 Segurança e Validação

- **Validação de dados** com Pydantic
- **Tratamento de exceções** personalizado
- **Transações de banco** com commit/rollback
- **Prevenção de vendas sem estoque**
- **Logs detalhados** de erros

---

## 🛠️ Tecnologias

### Backend
- **[Python 3.11+](https://www.python.org/)** - Linguagem de programação
- **[FastAPI](https://fastapi.tiangolo.com/)** - Framework web moderno e rápido
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Validação de dados
- **[Uvicorn](https://www.uvicorn.org/)** - Servidor ASGI de alta performance

### Banco de Dados
- **[MySQL 8.0+](https://www.mysql.com/)** - Banco de dados relacional
- **[mysql-connector-python](https://dev.mysql.com/doc/connector-python/en/)** - Conector MySQL oficial

### Deploy e DevOps
- **[Docker](https://www.docker.com/)** - Containerização
- **[Railway](https://railway.app/)** - Platform as a Service
- **[Git](https://git-scm.com/)** - Controle de versão

### Desenvolvimento
- **[python-dotenv](https://pypi.org/project/python-dotenv/)** - Gerenciamento de variáveis de ambiente
- **[pytest](https://pytest.org/)** - Framework de testes

---

## 📁 Estrutura do Projeto

```
desafio_tecnico_python-SQL/
├── codigo/                      # Código fonte principal
│   ├── database.py             # Conexão e configuração do banco
│   ├── produto.py              # Repositório de produtos
│   ├── venda.py                # Repositório de vendas
│   ├── exceptions.py           # Exceções personalizadas
│   └── __init__.py
│
├── database/                    # Scripts SQL
│   ├── schema.sql              # Criação das tabelas
│   ├── seeds.sql               # Dados iniciais
│   └── queries.sql             # Consultas úteis
│
├── api.py                       # Aplicação FastAPI (API REST)
├── requirements.txt             # Dependências Python
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── Dockerfile                   # Configuração Docker
├── docker-compose.yml           # Orquestração de containers
├── Procfile                     # Configuração Heroku/Railway
├── railway.toml                 # Configuração Railway
├── nixpacks.toml               # Configuração Nixpacks
├── README.md                    # Este arquivo
└── ANALISE.md                   # Análise técnica do projeto

```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- Python 3.11 ou superior
- MySQL 8.0 ou superior
- Git
- pip (gerenciador de pacotes Python)

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/htu6n7yi/desafio_tecnico_python-SQL.git
cd desafio_tecnico_python-SQL
```

### 2️⃣ Crie e Ative o Ambiente Virtual

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3️⃣ Instale as Dependências

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4️⃣ Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e edite com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=loja_virtual

# Configuração da API
PORT=8000
```

### 5️⃣ Inicialize o Banco de Dados

Execute o script de inicialização para criar as tabelas e inserir dados de exemplo:

```bash
python codigo/database.py
```

Ou manualmente no MySQL:

```sql
CREATE DATABASE loja_virtual;
USE loja_virtual;
SOURCE database/schema.sql;
SOURCE database/seeds.sql;
```

---

## 🚀 Executando o Projeto

### Método 1: Uvicorn (Desenvolvimento)

```bash
# Com reload automático
python -m uvicorn api:app --reload

# Ou especificando host e porta
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### Método 2: Python direto

```bash
python api.py
```

### Método 3: Docker Compose (Recomendado)

```bash
# Inicia todos os serviços (API + MySQL)
docker-compose up -d

# Para visualizar logs
docker-compose logs -f

# Para parar
docker-compose down
```

### ✅ API Rodando!

Acesse:
- **API:** http://localhost:8000
- **Documentação Swagger:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

---

## 📚 Documentação da API

A API conta com documentação interativa automática gerada pelo FastAPI.

### Swagger UI (Recomendado)
**URL:** http://localhost:8000/docs

Permite:
- Visualizar todos os endpoints
- Testar requisições diretamente no navegador
- Ver modelos de dados e validações
- Fazer download do schema OpenAPI

### ReDoc
**URL:** http://localhost:8000/redoc

Documentação alternativa com interface diferente.

---

## 🗄️ Banco de Dados

### Estrutura das Tabelas

#### Tabela: `produtos`
```sql
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    estoque INT NOT NULL DEFAULT 0
);
```

**Descrição:** Armazena informações dos produtos disponíveis na loja.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Identificador único (chave primária) |
| nome | VARCHAR(100) | Nome do produto |
| preco | DECIMAL(10,2) | Preço unitário |
| categoria | VARCHAR(50) | Categoria do produto |
| estoque | INT | Quantidade em estoque |

#### Tabela: `vendas`
```sql
CREATE TABLE vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    quantidade INT NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);
```

**Descrição:** Registra todas as vendas realizadas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Identificador único (chave primária) |
| produto_id | INT | ID do produto vendido (chave estrangeira) |
| quantidade | INT | Quantidade vendida |
| data_venda | TIMESTAMP | Data e hora da venda |
| valor_total | DECIMAL(10,2) | Valor total da venda |

### Dados de Exemplo

O banco vem pré-populado com 10 produtos e 15 vendas de exemplo:

**Produtos:**
- Camiseta Básica (Roupas) - R$ 39,90
- Calça Jeans (Roupas) - R$ 129,90
- Tênis Esportivo (Calçados) - R$ 249,90
- Smartphone X (Eletrônicos) - R$ 1.999,00
- Fone Bluetooth (Eletrônicos) - R$ 199,90
- E mais...

---

## 🔌 Endpoints

### 🏠 Root

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Informações da API |
| GET | `/health` | Status de saúde da API |

### 📦 Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Lista todos os produtos |
| GET | `/api/produtos?categoria={nome}` | Filtra produtos por categoria |
| GET | `/api/produtos/{id}` | Busca produto por ID |
| POST | `/api/produtos` | Cria novo produto |
| PUT | `/api/produtos/{id}` | Atualiza produto |

#### Exemplo - Criar Produto

**POST** `/api/produtos`

```json
{
  "nome": "Notebook Dell Inspiron",
  "categoria": "Eletrônicos",
  "preco": 3500.00,
  "estoque": 10
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "nome": "Notebook Dell Inspiron",
  "categoria": "Eletrônicos",
  "preco": 3500.0,
  "estoque": 10
}
```

### 🛒 Vendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/vendas` | Lista todas as vendas |
| GET | `/api/vendas?data_inicio={data}&data_fim={data}` | Filtra vendas por período |
| POST | `/api/vendas` | Registra nova venda |

#### Exemplo - Registrar Venda

**POST** `/api/vendas`

```json
{
  "produto_id": 1,
  "quantidade": 2
}
```

**Resposta (201 Created):**
```json
{
  "venda_id": 1,
  "produto_nome": "Notebook Dell Inspiron",
  "quantidade": 2,
  "valor_total": 7000.0,
  "data_venda": "2024-01-15"
}
```

### 📊 Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/relatorios/produtos-estoque-baixo?limite={n}` | Produtos com estoque < n |
| GET | `/api/relatorios/categorias` | Lista todas as categorias |
| GET | `/api/relatorios/resumo` | Resumo geral do sistema |

#### Exemplo - Estoque Baixo

**GET** `/api/relatorios/produtos-estoque-baixo?limite=5`

**Resposta:**
```json
{
  "limite": 5,
  "total_produtos": 3,
  "produtos": [
    {
      "id": 2,
      "nome": "Mouse Logitech",
      "categoria": "Periféricos",
      "estoque": 2,
      "preco": 85.0
    }
  ]
}
```

---

## 💡 Exemplos de Uso

### Usando cURL

```bash
# Listar todos os produtos
curl http://localhost:8000/api/produtos

# Buscar produto específico
curl http://localhost:8000/api/produtos/1

# Filtrar por categoria
curl "http://localhost:8000/api/produtos?categoria=Eletrônicos"

# Criar novo produto
curl -X POST http://localhost:8000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Gamer",
    "categoria": "Eletrônicos",
    "preco": 4500.00,
    "estoque": 5
  }'

# Registrar venda
curl -X POST http://localhost:8000/api/vendas \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 1,
    "quantidade": 2
  }'

# Ver relatório de estoque baixo
curl "http://localhost:8000/api/relatorios/produtos-estoque-baixo?limite=5"

# Resumo geral do sistema
curl http://localhost:8000/api/relatorios/resumo
```

### Usando Python (requests)

```python
import requests

# Configuração
BASE_URL = "http://localhost:8000"

# Listar produtos
response = requests.get(f"{BASE_URL}/api/produtos")
produtos = response.json()
print(produtos)

# Criar produto
novo_produto = {
    "nome": "Mouse Gamer RGB",
    "categoria": "Periféricos",
    "preco": 150.00,
    "estoque": 20
}
response = requests.post(f"{BASE_URL}/api/produtos", json=novo_produto)
print(response.json())

# Registrar venda
venda = {
    "produto_id": 1,
    "quantidade": 3
}
response = requests.post(f"{BASE_URL}/api/vendas", json=venda)
print(response.json())

# Verificar estoque baixo
response = requests.get(f"{BASE_URL}/api/relatorios/produtos-estoque-baixo?limite=5")
print(response.json())
```

### Usando JavaScript (fetch)

```javascript
// Listar produtos
fetch('http://localhost:8000/api/produtos')
  .then(response => response.json())
  .then(data => console.log(data));

// Criar produto
fetch('http://localhost:8000/api/produtos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Teclado Mecânico',
    categoria: 'Periféricos',
    preco: 350.00,
    estoque: 15
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Registrar venda
fetch('http://localhost:8000/api/vendas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    produto_id: 1,
    quantidade: 2
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 🌐 Deploy

### Railway (Recomendado)

1. **Prepare o projeto:**
   - Certifique-se de que `railway.toml` e `Procfile` estão na raiz
   - Faça commit de todas as alterações

2. **Crie conta e projeto:**
   - Acesse https://railway.app
   - Conecte seu GitHub
   - Selecione o repositório

3. **Adicione MySQL:**
   - No projeto Railway, clique em "+ New"
   - Adicione "MySQL" do marketplace

4. **Configure variáveis:**
   ```
   DB_HOST=${{MYSQLHOST}}
   DB_USER=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   DB_NAME=${{MYSQLDATABASE}}
   PORT=8000
   ```

5. **Deploy automático!** 🚀

### Render

1. Crie novo Web Service
2. Conecte seu repositório
3. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn api:app --host 0.0.0.0 --port $PORT`
4. Adicione PostgreSQL ou MySQL externo

### Docker

```bash
# Build
docker build -t loja-virtual-api .

# Run
docker run -p 8000:8000 loja-virtual-api
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ Erro: "ModuleNotFoundError: No module named 'fastapi'"

**Solução:**
```bash
# Certifique-se de que o ambiente virtual está ativado
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate      # Linux/Mac

# Reinstale as dependências
pip install -r requirements.txt
```

#### ❌ Erro: "Access denied for user 'root'@'localhost'"

**Solução:**
```bash
# Verifique suas credenciais do MySQL no arquivo codigo/database.py
# Ou configure o arquivo .env:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_correta
DB_NAME=loja_virtual
```

#### ❌ Erro: "Unknown database 'loja_virtual'"

**Solução:**
```bash
# O banco não foi criado. Execute:
python codigo/database.py

# Ou crie manualmente no MySQL:
mysql -u root -p
CREATE DATABASE loja_virtual;
```

#### ❌ API não responde ou erro 500

**Solução:**
1. Verifique se o MySQL está rodando
2. Teste a conexão com o banco
3. Verifique os logs do uvicorn
4. Garanta que as tabelas foram criadas

#### ❌ Erro no Railway: "Error creating build plan"

**Solução:**
1. Adicione os arquivos `railway.toml` e `Procfile` na raiz
2. Certifique-se que `requirements.txt` está correto
3. Configure as variáveis de ambiente no Railway
4. Use Python 3.11 (adicione `runtime.txt`)

### Comandos Úteis

```bash
# Verificar versão do Python
python --version

# Listar pacotes instalados
pip list

# Verificar se MySQL está rodando (Windows)
Get-Service MySQL*

# Testar conexão MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Ver logs da API em tempo real
python -m uvicorn api:app --reload --log-level debug

# Limpar cache Python
find . -type d -name "__pycache__" -exec rm -r {} +  # Linux/Mac
Get-ChildItem -Path . -Include __pycache__ -Recurse | Remove-Item -Recurse  # Windows
```

---

## 🧪 Testes

```bash
# Executar todos os testes
pytest

# Com cobertura
pytest --cov=codigo

# Verboso
pytest -v
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga o PEP 8 (estilo de código Python)
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha commits pequenos e descritivos

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.

---

## 👨‍💻 Autor

**José Carlos Cavalcanti**

- 💼 Estudante de Sistemas de Informação
- 🎯 Desenvolvedor Full Stack em formação
- 📧 Email: jcavalcanti008@gmail.com
- 🌐 GitHub: [@htu6n7yi](https://github.com/htu6n7yi)
- 💼 LinkedIn: [seu-linkedin](https://linkedin.com/in/seu-perfil)

---

## 🙏 Agradecimentos

- FastAPI pela excelente documentação
- Comunidade Python pelo suporte
- Railway pelo serviço de deploy gratuito

---

## 📌 Roadmap

- [ ] Autenticação JWT
- [ ] Paginação nos endpoints
- [ ] Cache com Redis
- [ ] Websockets para notificações em tempo real
- [ ] Frontend React/Vue
- [ ] Testes de integração
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Sentry