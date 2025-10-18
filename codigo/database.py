import mysql.connector
from mysql.connector import Error 
from pathlib import Path 

# Configuração do banco
config_db = {
    'host':"localhost",
    'user':"root",           
    'password':"12345678",  
    'database':"loja_virtual"  
}

def get_connection():
    try:
        conexao = mysql.connector.connect(**config_db)
        if conexao.is_connected():
            print("Conexao bem-sucedida ao banco de dados MySQL")
            return conexao
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        raise

def init_db(schema_sql_path, seeds_sql_path=None):
    conexao = get_connection()
    cursor = conexao.cursor()

    # Execução do Schema (Criação de Tabelas)
    schema_path = Path(schema_sql_path)
    # se for relativo, transformar em absoluto relativo a este arquivo
    if not schema_path.is_absolute():
        schema_path = (Path(__file__).resolve().parent / schema_path).resolve()

    print(f"Lendo e executando schema: {schema_path}")
    if not schema_path.exists():
        raise FileNotFoundError(f"Arquivo de schema não encontrado: {schema_path}")

    with schema_path.open('r', encoding='utf-8') as f:
        schema = f.read()
    for stmt in schema.split(';'):
        if stmt.strip():
            cursor.execute(stmt)

    # Execução dos Seeds (Inserção de Dados Iniciais)
    if seeds_sql_path:
        seeds_path = Path(seeds_sql_path)
        if not seeds_path.is_absolute():
            seeds_path = (Path(__file__).resolve().parent / seeds_path).resolve()

        print(f"Lendo e executando seeds: {seeds_path}")
        if not seeds_path.exists():
            raise FileNotFoundError(f"Arquivo de seeds não encontrado: {seeds_path}")

        with seeds_path.open('r', encoding='utf-8') as f:
            seeds = f.read()
        for stmt in seeds.split(';'):
            if stmt.strip():
                cursor.execute(stmt)

    conexao.commit()
    print("Inicialização do DB concluída e alterações salvas.")

    cursor.close()
    conexao.close()


# =========================================================
# PONTO DE EXECUÇÃO PRINCIPAL
# =========================================================

if __name__ == '__main__':
    # Caminhos relativos ao diretório deste arquivo
    SCHEMA_FILE = Path(__file__).resolve().parent.joinpath('..', 'database', 'schema.sql')
    SEEDS_FILE = Path(__file__).resolve().parent.joinpath('..', 'database', 'seeds.sql')

    # Resolver para caminhos absolutos
    SCHEMA_FILE = SCHEMA_FILE.resolve()
    SEEDS_FILE = SEEDS_FILE.resolve()

    try:
        print("Iniciando processo de inicialização do banco de dados...")
        
        # A chamada à função init_db ocorre aqui
        init_db(SCHEMA_FILE, SEEDS_FILE)
        
        print("---")
        print("SUCESSO: O script de inicialização do banco de dados foi concluído.")
        
    except FileNotFoundError as e:
        print(f"\nERRO: O arquivo SQL não foi encontrado. Caminho inválido ou arquivo ausente: {e}")
        print("Verifique se o caminho acima está correto em relação ao seu script database.py.")
    except Error as e:
        # Captura erros do MySQL (conexão, sintaxe SQL, etc.)
        print(f"\nERRO DE BANCO DE DADOS: Falha ao executar o SQL. Mensagem: {e}")
    except Exception as e:
        # Captura qualquer outro erro inesperado
        print(f"\nERRO INESPERADO: {e}")