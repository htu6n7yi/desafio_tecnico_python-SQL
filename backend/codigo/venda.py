# venda.py (Versão corrigida para compatibilidade com API)
from database import get_connection
from exceptions import ProdutoNaoEncontradoError, EstoqueInsuficienteError

class VendaRepo:

    def listar_vendas(self):
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
                SELECT 
                    v.id AS venda_id,
                    v.produto_id,
                    v.quantidade,
                    v.valor_total,
                    v.data_venda,
                    p.nome AS produto_nome,
                    p.preco AS produto_preco
                FROM vendas v
                JOIN produtos p ON p.id = v.produto_id
                ORDER BY v.id DESC
            """

            cursor.execute(sql)
            vendas = cursor.fetchall()
            
            # Converter datetime para string
            for venda in vendas:
                if venda.get('data_venda'):
                    venda['data_venda'] = venda['data_venda'].strftime('%Y-%m-%d %H:%M:%S')
            
            return vendas

        except Exception as e:
            print("Erro ao listar vendas:", e)
            raise e

        finally:
            if conn:
                conn.close()

    def buscar_por_periodo(self, data_inicio, data_fim):
        """Busca vendas em um período específico"""
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
                SELECT 
                    v.id AS venda_id,
                    v.produto_id,
                    v.quantidade,
                    v.valor_total,
                    v.data_venda,
                    p.nome AS produto_nome,
                    p.preco AS produto_preco
                FROM vendas v
                JOIN produtos p ON p.id = v.produto_id
                WHERE DATE(v.data_venda) BETWEEN %s AND %s
                ORDER BY v.data_venda DESC
            """

            cursor.execute(sql, (data_inicio, data_fim))
            vendas = cursor.fetchall()
            
            # Converter datetime para string
            for venda in vendas:
                if venda.get('data_venda'):
                    venda['data_venda'] = venda['data_venda'].strftime('%Y-%m-%d %H:%M:%S')
            
            return vendas

        except Exception as e:
            print("Erro ao buscar vendas por período:", e)
            raise e

        finally:
            if conn:
                conn.close()

    def registrar_venda(self, produto_id, quantidade):
        """
        Registra uma venda e retorna (venda_id, valor_total)
        IMPORTANTE: Retorna tupla para compatibilidade com api.py
        """
        if quantidade <= 0:
            raise ValueError("A quantidade deve ser maior que zero.")

        conn = None
        valor_total_calculado = 0
        venda_id = None
        
        try:
            conn = get_connection()
            conn.autocommit = False 
            cursor = conn.cursor(dictionary=True)
            
            # 1. Buscar produto com lock
            sql_produto = "SELECT id, preco, estoque FROM produtos WHERE id = %s FOR UPDATE"
            cursor.execute(sql_produto, (produto_id,))
            produto = cursor.fetchone()

            if not produto:
                raise ProdutoNaoEncontradoError(
                    f"Produto ID {produto_id} não encontrado."
                )
            
            # 2. Verificar estoque
            if produto['estoque'] < quantidade:
                raise EstoqueInsuficienteError(
                    f"Estoque insuficiente. Disponível: {produto['estoque']}, Solicitado: {quantidade}"
                )

            # 3. Calcular valores
            preco_unitario = produto['preco']
            valor_total_calculado = preco_unitario * quantidade
            
            # 4. Inserir venda
            sql_insert_venda = """
                INSERT INTO vendas (produto_id, quantidade, valor_total) 
                VALUES (%s, %s, %s)
            """
            cursor.execute(
                sql_insert_venda, 
                (produto_id, quantidade, valor_total_calculado)
            )
            venda_id = cursor.lastrowid 
            
            if not venda_id:
                raise Exception("Falha ao obter o ID da venda inserida.")
            
            # 5. Atualizar estoque
            sql_update_estoque = """
                UPDATE produtos SET estoque = estoque - %s WHERE id = %s
            """
            cursor.execute(sql_update_estoque, (quantidade, produto_id))

            # 6. Commit final
            conn.commit()

            # CORRIGIDO: Retorna tupla (venda_id, valor_total)
            return (venda_id, valor_total_calculado)

        except Exception as e:
            if conn:
                conn.rollback()
            print("Erro ao registrar venda:", e)
            raise e

        finally:
            if conn:
                conn.close()