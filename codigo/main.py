from pathlib import Path
from database import init_db, config_db, get_connection 
from produto import ProdutoRepo
from venda import VendaRepo
import datetime

BASE = Path(__file__).resolve().parent # Agora o BASE é a pasta onde está este script
SCHEMA = BASE / '../database' / 'schema.sql'
SEEDS = BASE / '../database' / 'seeds.sql'

# A função bootstrap usa o init_db do MySQL e os caminhos de arquivos SQL
def bootstrap():
    schema_path = BASE.parent / 'database' / 'schema.sql'
    seeds_path = BASE.parent / 'database' / 'seeds.sql'
    
    
    print(f"Inicializando banco de dados (MySQL) com schema: {SCHEMA}")
    try:
        # init_db() se conecta, executa os scripts e fecha a conexão
        init_db(str(SCHEMA), str(SEEDS)) 
        print('Banco inicializado (schema + seeds) com sucesso.')
    except Exception as e:
        print(f"Erro ao inicializar o banco de dados: {e}")
        # Re-raise o erro para interromper a execução se necessário

def demo():
    p = ProdutoRepo() 
    v = VendaRepo()
    
    try:
        # Tenta conectar uma vez para garantir que as credenciais estão ok antes dos repositórios
        conn = get_connection()
        conn.close() # Fecha após testar a conexão
        
        print('\n--- Produtos (listar) ---')

        # Estas operações agora falarão com o MySQL
        for prod in p.listar_todos():
            print(prod)
    
        print('\n--- Filtrar por categoria: Eletrônicos ---')
        for prod in p.filtrar_por_categoria('Eletrônicos'):
            print(prod)
    
        print('\n--- Buscar produto id=21 ---')
        print(p.buscar_por_id(21))

        print('\n--- Registrar venda: produto_id=21, quantidade=2 ---')
        try:
            venda_id, total = v.registrar_venda(21, 2)
            print('Venda registrada id=', venda_id, 'total=', total)

        except Exception as e:
            print(f"Erro ao registrar venda: {e}")

    except Exception as e:
        print(f"\nErro na demonstração. Verifique a conexão e o schema do banco de dados: {e}")


if __name__ == '__main__': 
    bootstrap()
    demo()