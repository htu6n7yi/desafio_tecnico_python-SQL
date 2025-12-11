# produto.py

from database import get_connection


class ProdutoRepo:
    def __init__(self):
        pass

    def listar_todos(self):
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True) 
            
            sql = 'SELECT * FROM produtos ORDER BY id'
            cursor.execute(sql)
            
            rows = cursor.fetchall()
            return rows
        
        except Exception as e:
            print(f"Erro ao listar produtos: {e}")
            return [] # Retorna lista vazia em caso de erro
            
        finally:
            if conn:
                conn.close()


    def buscar_por_id(self, produto_id):
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            
            sql = 'SELECT * FROM produtos WHERE id = %s' 
            cursor.execute(sql, (produto_id,))

            row = cursor.fetchone()
            return row
            
        except Exception as e:
            print(f"Erro ao buscar produto por ID: {e}")
            return None
            
        finally:
            if conn:
                conn.close()


    def filtrar_por_categoria(self, categoria):
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            
            sql = 'SELECT * FROM produtos WHERE categoria = %s ORDER BY id' 
            cursor.execute(sql, (categoria,))
            
            rows = cursor.fetchall()
            return rows
            
        except Exception as e:
            print(f"Erro ao filtrar produtos por categoria: {e}")
            return []
            
        finally:
            if conn:
                conn.close()

    def criar_produto(self, nome, preco, categoria, estoque):
        conn = get_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO produtos (nome, preco, categoria, estoque) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (nome, preco, categoria, estoque))
        conn.commit()
        produto_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return produto_id


    def atualizar_estoque(self, produto_id, novo_estoque):
        conn = get_connection()
        cursor = conn.cursor()
        sql = "UPDATE produtos SET estoque = %s WHERE id = %s"
        cursor.execute(sql, (novo_estoque, produto_id))
        conn.commit()
        cursor.close()
        conn.close()

    
    def atualizar_produto(self, produto_id, nome=None, categoria=None, preco=None, estoque=None):
        """Atualiza os campos fornecidos de um produto"""
        conn = None
        cursor = None
        try:
            conn = get_connection()
            cursor = conn.cursor()
            
            # Prepara os campos para atualização
            campos = []
            valores = []
            
            if nome is not None:
                campos.append("nome = %s")
                valores.append(nome)
            
            if categoria is not None:
                campos.append("categoria = %s")
                valores.append(categoria)
            
            if preco is not None:
                campos.append("preco = %s")
                valores.append(preco)
            
            if estoque is not None:
                campos.append("estoque = %s")
                valores.append(estoque)
            
            # Se não houver campos para atualizar, retorna
            if not campos:
                return
            
            # Adiciona o ID no final dos valores
            valores.append(produto_id)
            
            # Monta e executa o SQL
            sql = f"UPDATE produtos SET {', '.join(campos)} WHERE id = %s"
            cursor.execute(sql, tuple(valores))
            conn.commit()
            
        except Exception as e:
            print(f"Erro ao atualizar produto: {e}")
            if conn:
                conn.rollback()
            raise
            
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()