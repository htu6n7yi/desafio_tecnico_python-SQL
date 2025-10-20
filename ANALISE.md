# 🧠 Análise Técnica — Sistema de Vendas (Python + MySQL)

## 🎯 Objetivo

O projeto tem como objetivo demonstrar o domínio em **Python**, **SQL** e boas práticas de **arquitetura de software**, através da construção de um sistema de vendas com separação clara de camadas, uso de testes e manipulação de banco relacional.

---

## 🧱 Arquitetura e Organização

O sistema foi dividido em **camadas lógicas**, cada uma com responsabilidades bem definidas:

| Camada | Arquivo(s) | Responsabilidade |
|---------|-------------|------------------|
| **Banco de Dados** | `database.py`, `database/schema.sql`, `database/seeds.sql` | Conexão, criação de tabelas e carga inicial de dados |
| **Domínio de Produtos** | `produto.py` | CRUD de produtos (listar, buscar, criar, atualizar estoque) |
| **Domínio de Vendas** | `venda.py` | Regras de venda, cálculo de total, controle de estoque |
| **Exceções** | `exceptions.py` | Centralização de erros personalizados para melhor controle |
| **Aplicação Principal** | `main.py` | Execução geral, inicialização e demonstração |
| **Testes** | `tests.py` | Testes unitários e integração (mock + unittest) |

Essa separação facilita **manutenção, legibilidade e escalabilidade** do sistema.

---

## 🧩 Decisões de Design

### 1. **MySQL Connector**
Foi utilizado o `mysql.connector` nativo do MySQL para manter o código simples e sem dependências externas (como ORM).  
Isso permite controle direto das queries e facilita depuração durante o teste.

### 2. **Transações e Rollback**
A função `registrar_venda` em `venda.py` trabalha com **transações manuais**:
- Bloqueia o produto (`FOR UPDATE`)
- Verifica estoque
- Registra a venda
- Atualiza o estoque
- Faz `COMMIT` ou `ROLLBACK` em caso de erro  
Essa abordagem garante **consistência e integridade dos dados**.

### 3. **Exceções Personalizadas**
Foram criadas classes específicas (`ProdutoNaoEncontradoError`, `EstoqueInsuficienteError`, etc.) para deixar os erros mais claros e tratar falhas de forma controlada no código.

### 4. **Testes com Mock**
Os testes simulam conexões MySQL, permitindo rodar o sistema sem um banco real.  
A suíte cobre os métodos principais e inclui **validações de negócio** e **testes de integração** opcionais.

---

## 🔍 Possíveis Melhorias e Escalabilidade

### 🏬 Múltiplas Lojas
Para permitir múltiplas lojas:
- Adicionar tabela `lojas (id, nome, endereco)`
- Adicionar `loja_id` nas tabelas `produtos` e `vendas`
- Ajustar as queries para filtrar por loja
- Criar camada de autenticação por loja

### 💸 Promoções e Descontos
- Adicionar tabela `promocoes (produto_id, desconto_percentual, data_inicio, data_fim)`
- Alterar `registrar_venda` para aplicar desconto automaticamente se houver promoção ativa

### 📈 Relatórios e Dashboards
- Criar consultas SQL agregadas (receita por categoria, produto mais vendido)
- Expor os dados via API REST (Flask ou FastAPI)
- Adicionar exportação CSV ou dashboard visual

### 🧰 Outras melhorias técnicas
- Adotar **logging estruturado** ao invés de `print`
- Utilizar **Pydantic** para validação de dados
- Migrar para **SQLAlchemy** ou **Prisma ORM** se o escopo crescer
- Criar **API HTTP** para integração com front-end Angular

---

## 💬 Conclusão

O sistema cumpre os requisitos funcionais do teste técnico, demonstrando:
- Boas práticas de separação de camadas
- Uso correto de transações SQL
- Implementação clara de CRUDs
- Testes automatizados com `unittest` e mocks

A arquitetura atual é **simples, extensível e fácil de manter**, permitindo evolução futura para múltiplas lojas, promoções e dashboards de vendas.
