# 🛒 Sistema de Gerenciamento de Vendas — Teste Técnico (Python + MySQL)

Este projeto foi desenvolvido como parte de um **teste técnico** com o objetivo de criar um pequeno **sistema de gerenciamento de vendas para uma loja online**, utilizando **Python** e **MySQL**.

O sistema permite o **cadastro e listagem de produtos**, o **registro de vendas** com atualização automática de estoque, e inclui consultas SQL e testes automatizados.

---

## 🚀 Funcionalidades

### 🧩 **Gestão de Produtos**
- Listar todos os produtos
- Buscar produto por ID
- Filtrar produtos por categoria
- Criar novos produtos
- Atualizar estoque

### 💰 **Gestão de Vendas**
- Listar todas as vendas
- Buscar vendas por período
- Registrar nova venda (com cálculo automático de valor total)
- Atualizar estoque automaticamente após a venda

---

## 🧠 Estrutura do Projeto

```
projeto/
├── database/
│   ├── queries.sql        # consulta nas tabelas
│   ├── schema.sql         # Criação das tabelas
│   └── seeds.sql          # Dados iniciais de exemplo
├── codigo/
│   ├── database.py        # Conexão e inicialização do banco
│   ├── produto.py         # CRUD de produtos
│   ├── venda.py           # Controle de vendas e estoque
│   ├── exceptions.py      # Exceções personalizadas
│   ├── main.py            # Execução principal e demonstração
│   └── tests.py           # Testes automatizados (unittest + mocks)
├── requirements.txt       # Dependências do projeto
├── README.md              # Instruções e resumo
└── ANALISE.md             # Explicação técnica e decisões de arquitetura
```

---

## ⚙️ Requisitos

- Python 3.10+
- MySQL Server 8+
- Biblioteca `mysql-connector-python`

---

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/htu6n7yi/desafio_tecnico_python-SQL.git
   cd desafio_tecnico_python-SQL
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure seu banco MySQL no arquivo `database.py`:
   ```python
   config_db = {
       'host': "localhost",
       'user': "root",
       'password': "(sua senha)",
       'database': "loja_virtual"
   }
   ```

4. Execute o script de inicialização:
   ```bash
   python main.py
   ```

   Isso criará as tabelas e populá-las-á com dados do `seeds.sql`.

---

## 🧪 Testes

Os testes foram criados com `unittest` e fazem uso de `mock` para simular a camada de banco.

Para executar todos os testes:
```bash
python tests.py
```
---

## 📊 Consultas SQL Incluídas

O sistema foi projetado para responder consultas como:
- Produtos com estoque > 5 (ordenados por categoria e preço)
- Relatório de vendas com nome, categoria e data
- Total de vendas e receita por categoria nos últimos 30 dias
- Top 5 produtos mais vendidos
- Produtos nunca vendidos ou com estoque crítico (<3 unidades)

---

## 👤 Autor

**José Carlos Cavalcanti**  
💻 Estudante de Sistemas de Informação — Desenvolvedor Full Stack em formação  
📧 [jcavalcanti008@gmail.com]  
🌐 GitHub: [@htu6n7yi](https://github.com/htu6n7yi)

---

## 📜 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.
