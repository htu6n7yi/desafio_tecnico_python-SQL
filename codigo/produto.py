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