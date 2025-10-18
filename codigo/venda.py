# venda.py (Exemplo Básico - você deve implementar a lógica de negócio!)
from database import get_connection
# ... (provavelmente você precisará do ProdutoRepo para atualizar estoque e buscar preço)

class VendaRepo:
  def registrar_venda(self, produto_id, quantidade):
        if quantidade <= 0:
            raise ValueError("A quantidade deve ser maior que zero.")

        conn = None
        valor_total_calculado = 0
        venda_id = None
        
        try:
            conn = get_connection()
            # Desativa o autocommit para gerenciar a transação manualmente
            conn.autocommit = False 
            cursor = conn.cursor(dictionary=True)
            
            # 1. BUSCAR PRODUTO (FOR UPDATE para bloqueio otimista)
            # Tabela: produtos. Colunas: preco, estoque.
            sql_produto = "SELECT id, preco, estoque FROM produtos WHERE id = %s FOR UPDATE"
            cursor.execute(sql_produto, (produto_id,))
            produto = cursor.fetchone()

            if not produto:
                raise ProdutoNaoEncontradoError(f"Produto ID {produto_id} não encontrado.")
            
            # 2. VERIFICAR ESTOQUE
            if produto['estoque'] < quantidade:
                raise EstoqueInsuficienteError(
                    f"Estoque insuficiente. Disponível: {produto['estoque']}, Solicitado: {quantidade}"
                )

            # 3. CALCULAR TOTAIS
            preco_unitario = produto['preco']
            valor_total_calculado = preco_unitario * quantidade
            
            # 4. INSERIR NA TABELA VENDAS (Tabela principal no seu schema)
            # Colunas usadas: produto_id, quantidade, valor_total.
            sql_insert_venda = """
                INSERT INTO vendas (produto_id, quantidade, valor_total) 
                VALUES (%s, %s, %s)
            """
            # data_venda não precisa ser inserida, pois tem DEFAULT CURRENT_TIMESTAMP
            cursor.execute(sql_insert_venda, (produto_id, quantidade, valor_total_calculado))
            venda_id = cursor.lastrowid # Pega o ID da Venda
            
            if not venda_id:
                 raise Error("Falha ao obter o ID da venda inserida.")
            
            # 5. ATUALIZAR ESTOQUE
            sql_update_estoque = "UPDATE produtos SET estoque = estoque - %s WHERE id = %s"
            cursor.execute(sql_update_estoque, (quantidade, produto_id))
            
            # 6. COMMIT: Salva todas as alterações juntas (Transação)
            conn.commit()
            
            return venda_id, valor_total_calculado
        
        except Exception as e:
            # Em caso de erro, desfaz todas as operações no DB
            if conn:
                conn.rollback()
            # Relança a exceção para ser tratada no main.py
            raise e
            
        finally:
            if conn:
                conn.autocommit = True # Restaura o autocommit
                conn.close()

  def listar_vendas(self):
      conn = get_connection()
      cursor = conn.cursor(dictionary=True)

      sql = """SELECT 
                    v.id AS venda_id, 
                    p.nome AS produto_nome, 
                    v.quantidade,
                    v.valor_total, 
                    v.data_venda
                FROM vendas v
                JOIN produtos p ON v.produto_id = p.id
                ORDER BY v.data_venda DESC"""
      cursor.execute(sql)
      vendas = cursor.fetchall()
      
      cursor.close()
      conn.close()
      
      return vendas
  
  def buscar_por_periodo(self, data_inicio, data_fim):
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True) 
            
            # Consulta na tabela vendas (plural)
            sql = """
                SELECT 
                    v.id AS venda_id, 
                    p.nome AS produto_nome, 
                    v.quantidade,
                    v.valor_total, 
                    v.data_venda
                FROM vendas v
                JOIN produtos p ON v.produto_id = p.id
                WHERE v.data_venda BETWEEN %s AND %s 
                ORDER BY v.data_venda DESC
            """
            cursor.execute(sql, (data_inicio, data_fim))
            return cursor.fetchall()
            
        except Exception as e:
            print(f"Erro ao buscar vendas por período: {e}")
            return []
            
        finally:
            if conn:
                conn.close()