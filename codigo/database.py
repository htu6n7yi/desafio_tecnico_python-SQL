import mysql.connector
from mysql.connector import Error

class Database:
    def __init__(self, host, database, user, password):
        # Configurações de conexão para o seu MySQL local
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.conn = None

    def connect(self):
        """Estabelece a conexão com o banco de dados MySQL."""
        try:
            self.conn = mysql.connector.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password
            )
            if self.conn.is_connected():
                print(f"Conexão bem-sucedida ao banco de dados '{self.database}'.")
        except Error as e:
            print(f"Erro ao conectar ao MySQL: {e}")
            self.conn = None

    def disconnect(self):
        """Fecha a conexão com o banco de dados."""
        if self.conn and self.conn.is_connected():
            self.conn.close()
            print("Conexão com o MySQL fechada.")

    def execute_query(self, query, params=None, fetch=False):
        """Executa uma consulta (INSERT, UPDATE, DELETE ou SELECT)."""
        if not self.conn or not self.conn.is_connected():
            print("Erro: Não há conexão com o banco de dados.")
            return []

        cursor = self.conn.cursor(dictionary=True) # dictionary=True retorna resultados como dicionários (mais fácil de usar)
        try:
            cursor.execute(query, params or ())
            
            if query.strip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')):
                self.conn.commit()
                if query.strip().upper().startswith('INSERT'):
                    # Retorna o ID da última linha inserida
                    return cursor.lastrowid 
                return True
            
            if fetch:
                # Para consultas SELECT
                return cursor.fetchall()
            
            return True

        except Error as e:
            print(f"Erro ao executar a consulta: {e}")
            self.conn.rollback() # Desfaz alterações em caso de erro
            return [] if fetch else False
        finally:
            cursor.close()
