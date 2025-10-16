import mysql.connector
from mysql.connector import Error 
from pathlib import Path 

# Configuração do banco
config_db = {
    'host':"localhost",
    'user':"root",           
    'password':"12345678",  ''
    'database':"loja_virtual"  
}

def get_connection():
    try:
        conexao = mysql.connector.connect(**config_db)
        if conexao.is_connected():
            print("Conexão bem-sucedida ao banco de dados MySQL")
            return conexao
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        raise


print(" Tabela 'produtos' criada com sucesso!")
get_connection()
