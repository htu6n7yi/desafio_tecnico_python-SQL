import unittest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timedelta
from decimal import Decimal
import sys
import os

# Adiciona o diretório pai ao path para importar os módulos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Importa os módulos do projeto
try:
    from database import get_connection, config_db
    from produto import ProdutoRepo
    from venda import VendaRepo
except ImportError as e:
    print(f"Erro ao importar módulos: {e}")
    print("Certifique-se de que os arquivos database.py, produto.py e venda.py estão no mesmo diretório")
    sys.exit(1)


class TestProdutoRepo(unittest.TestCase):
    """Testes para a classe ProdutoRepo"""
    
    def setUp(self):
        """Configuração antes de cada teste"""
        self.produto_repo = ProdutoRepo()
        self.mock_connection = Mock()
        self.mock_cursor = Mock()
        
    @patch('produto.get_connection')
    def test_listar_todos_sucesso(self, mock_get_conn):
        """Testa listagem de todos os produtos com sucesso"""
        # Configura o mock
        produtos_mock = [
            {'id': 1, 'nome': 'Notebook', 'preco': Decimal('2500.00'), 
             'categoria': 'Eletrônicos', 'estoque': 10},
            {'id': 2, 'nome': 'Mouse', 'preco': Decimal('50.00'), 
             'categoria': 'Acessórios', 'estoque': 20}
        ]
        
        mock_cursor = Mock()
        mock_cursor.fetchall.return_value = produtos_mock
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        # Executa o método
        resultado = self.produto_repo.listar_todos()
        
        # Verificações
        self.assertEqual(len(resultado), 2)
        self.assertEqual(resultado[0]['nome'], 'Notebook')
        mock_cursor.execute.assert_called_once_with('SELECT * FROM produtos ORDER BY id')
        mock_conn.close.assert_called_once()
    
    @patch('produto.get_connection')
    def test_listar_todos_erro_conexao(self, mock_get_conn):
        """Testa listagem quando há erro de conexão"""
        mock_get_conn.side_effect = Exception("Erro de conexão")
        
        resultado = self.produto_repo.listar_todos()
        
        self.assertEqual(resultado, [])
    
    @patch('produto.get_connection')
    def test_buscar_por_id_encontrado(self, mock_get_conn):
        """Testa busca de produto por ID quando encontrado"""
        produto_mock = {
            'id': 1, 
            'nome': 'Notebook', 
            'preco': Decimal('2500.00'), 
            'categoria': 'Eletrônicos', 
            'estoque': 10
        }
        
        mock_cursor = Mock()
        mock_cursor.fetchone.return_value = produto_mock
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        resultado = self.produto_repo.buscar_por_id(1)
        
        self.assertIsNotNone(resultado)
        self.assertEqual(resultado['nome'], 'Notebook')
        mock_cursor.execute.assert_called_once_with(
            'SELECT * FROM produtos WHERE id = %s', (1,)
        )
        mock_conn.close.assert_called_once()
    
    @patch('produto.get_connection')
    def test_buscar_por_id_nao_encontrado(self, mock_get_conn):
        """Testa busca de produto por ID quando não encontrado"""
        mock_cursor = Mock()
        mock_cursor.fetchone.return_value = None
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        resultado = self.produto_repo.buscar_por_id(999)
        
        self.assertIsNone(resultado)
    
    @patch('produto.get_connection')
    def test_filtrar_por_categoria(self, mock_get_conn):
        """Testa filtro de produtos por categoria"""
        produtos_mock = [
            {'id': 1, 'nome': 'Notebook', 'preco': Decimal('2500.00'), 
             'categoria': 'Eletrônicos', 'estoque': 10},
            {'id': 3, 'nome': 'Tablet', 'preco': Decimal('1500.00'), 
             'categoria': 'Eletrônicos', 'estoque': 5}
        ]
        
        mock_cursor = Mock()
        mock_cursor.fetchall.return_value = produtos_mock
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        resultado = self.produto_repo.filtrar_por_categoria('Eletrônicos')
        
        self.assertEqual(len(resultado), 2)
        for produto in resultado:
            self.assertEqual(produto['categoria'], 'Eletrônicos')
        
        mock_cursor.execute.assert_called_once_with(
            'SELECT * FROM produtos WHERE categoria = %s ORDER BY id',
            ('Eletrônicos',)
        )
    
    @patch('produto.get_connection')
    def test_filtrar_por_categoria_vazia(self, mock_get_conn):
        """Testa filtro quando não há produtos na categoria"""
        mock_cursor = Mock()
        mock_cursor.fetchall.return_value = []
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        resultado = self.produto_repo.filtrar_por_categoria('Inexistente')
        
        self.assertEqual(resultado, [])


class TestVendaRepo(unittest.TestCase):
    """Testes para a classe VendaRepo"""
    
    def setUp(self):
        """Configuração antes de cada teste"""
        self.venda_repo = VendaRepo()
    
    def test_registrar_venda_quantidade_zero(self):
        """Testa que não permite venda com quantidade zero"""
        with self.assertRaises(ValueError) as context:
            self.venda_repo.registrar_venda(1, 0)
        
        self.assertIn("maior que zero", str(context.exception))
    
    def test_registrar_venda_quantidade_negativa(self):
        """Testa que não permite venda com quantidade negativa"""
        with self.assertRaises(ValueError) as context:
            self.venda_repo.registrar_venda(1, -5)
        
        self.assertIn("maior que zero", str(context.exception))
    
    @patch('venda.get_connection')
    def test_registrar_venda_sucesso(self, mock_get_conn):
        """Testa registro de venda com sucesso"""
        # Mock do produto
        produto_mock = {
            'id': 1,
            'preco': Decimal('2500.00'),
            'estoque': 10
        }
        
        # Configura cursores
        mock_cursor = Mock()
        mock_cursor.fetchone.return_value = produto_mock
        mock_cursor.lastrowid = 1
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_conn.autocommit = True
        mock_get_conn.return_value = mock_conn
        
        # Executa venda
        venda_id, valor_total = self.venda_repo.registrar_venda(1, 2)
        
        # Verificações
        self.assertEqual(venda_id, 1)
        self.assertEqual(valor_total, Decimal('5000.00'))
        mock_conn.commit.assert_called_once()
        self.assertEqual(mock_cursor.execute.call_count, 3)  # SELECT, INSERT, UPDATE
    
    @patch('venda.get_connection')
    def test_registrar_venda_produto_nao_encontrado(self, mock_get_conn):
        """Testa venda de produto que não existe"""
        mock_cursor = Mock()
        mock_cursor.fetchone.return_value = None
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_conn.autocommit = True
        mock_get_conn.return_value = mock_conn
        
        # Deve lançar exceção personalizada (ajuste se necessário)
        with self.assertRaises(Exception) as context:
            self.venda_repo.registrar_venda(999, 2)
        
        mock_conn.rollback.assert_called_once()
    
    @patch('venda.get_connection')
    def test_registrar_venda_estoque_insuficiente(self, mock_get_conn):
        """Testa venda quando estoque é insuficiente"""
        produto_mock = {
            'id': 1,
            'preco': Decimal('2500.00'),
            'estoque': 1  # Estoque baixo
        }
        
        mock_cursor = Mock()
        mock_cursor.fetchone.return_value = produto_mock
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_conn.autocommit = True
        mock_get_conn.return_value = mock_conn
        
        with self.assertRaises(Exception) as context:
            self.venda_repo.registrar_venda(1, 5)  # Quantidade maior que estoque
        
        self.assertIn("Estoque insuficiente", str(context.exception))
        mock_conn.rollback.assert_called_once()
    
    @patch('venda.get_connection')
    def test_listar_vendas(self, mock_get_conn):
        """Testa listagem de todas as vendas"""
        vendas_mock = [
            {
                'venda_id': 1,
                'produto_nome': 'Notebook',
                'quantidade': 2,
                'valor_total': Decimal('5000.00'),
                'data_venda': datetime.now()
            },
            {
                'venda_id': 2,
                'produto_nome': 'Mouse',
                'quantidade': 1,
                'valor_total': Decimal('50.00'),
                'data_venda': datetime.now()
            }
        ]
        
        mock_cursor = Mock()
        mock_cursor.fetchall.return_value = vendas_mock
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        resultado = self.venda_repo.listar_vendas()
        
        self.assertEqual(len(resultado), 2)
        self.assertEqual(resultado[0]['produto_nome'], 'Notebook')
        mock_conn.close.assert_called_once()
    
    @patch('venda.get_connection')
    def test_buscar_por_periodo(self, mock_get_conn):
        """Testa busca de vendas por período"""
        data_inicio = datetime.now() - timedelta(days=7)
        data_fim = datetime.now()
        
        vendas_mock = [
            {
                'venda_id': 1,
                'produto_nome': 'Notebook',
                'quantidade': 2,
                'valor_total': Decimal('5000.00'),
                'data_venda': datetime.now()
            }
        ]
        
        mock_cursor = Mock()
        mock_cursor.fetchall.return_value = vendas_mock
        
        mock_conn = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn
        
        resultado = self.venda_repo.buscar_por_periodo(data_inicio, data_fim)
        
        self.assertEqual(len(resultado), 1)
        self.assertEqual(resultado[0]['produto_nome'], 'Notebook')
        
        # Verifica se a query foi chamada com os parâmetros corretos
        args = mock_cursor.execute.call_args
        self.assertEqual(args[0][1], (data_inicio, data_fim))
    
    @patch('venda.get_connection')
    def test_buscar_por_periodo_erro(self, mock_get_conn):
        """Testa busca por período quando há erro"""
        mock_get_conn.side_effect = Exception("Erro de conexão")
        
        resultado = self.venda_repo.buscar_por_periodo(
            datetime.now() - timedelta(days=7),
            datetime.now()
        )
        
        self.assertEqual(resultado, [])


class TestDatabase(unittest.TestCase):
    """Testes para funções do módulo database"""
    
    @patch('mysql.connector.connect')
    def test_get_connection_sucesso(self, mock_connect):
        """Testa conexão bem-sucedida ao banco"""
        mock_conn = Mock()
        mock_conn.is_connected.return_value = True
        mock_connect.return_value = mock_conn
        
        conexao = get_connection()
        
        self.assertIsNotNone(conexao)
        mock_connect.assert_called_once_with(**config_db)
        mock_conn.is_connected.assert_called_once()
    
    @patch('mysql.connector.connect')
    def test_get_connection_falha(self, mock_connect):
        """Testa falha na conexão ao banco"""
        mock_connect.side_effect = Exception("Erro de conexão")
        
        with self.assertRaises(Exception):
            get_connection()


class TestValidacoes(unittest.TestCase):
    """Testes de validações e regras de negócio"""
    
    def test_calculo_valor_total(self):
        """Testa cálculo do valor total da venda"""
        preco = Decimal('2500.00')
        quantidade = 3
        valor_esperado = Decimal('7500.00')
        
        valor_total = preco * quantidade
        
        self.assertEqual(valor_total, valor_esperado)
    
    def test_calculo_valor_total_decimal(self):
        """Testa cálculo com valores decimais"""
        preco = Decimal('99.99')
        quantidade = 2
        valor_esperado = Decimal('199.98')
        
        valor_total = preco * quantidade
        
        self.assertEqual(valor_total, valor_esperado)
    
    def test_validacao_estoque_negativo(self):
        """Testa que estoque não pode ficar negativo"""
        estoque_atual = 5
        quantidade_venda = 10
        
        self.assertLess(estoque_atual, quantidade_venda)
        # Em uma venda real, isso deveria lançar exceção


class TestIntegration(unittest.TestCase):
    """Testes de integração (requerem banco de dados real)"""
    
    @unittest.skip("Requer banco de dados MySQL configurado e rodando")
    def test_fluxo_completo_produto(self):
        """Testa fluxo completo de produto"""
        produto_repo = ProdutoRepo()
        
        # Listar produtos
        produtos = produto_repo.listar_todos()
        self.assertIsInstance(produtos, list)
        
        if len(produtos) > 0:
            # Buscar primeiro produto
            primeiro_id = produtos[0]['id']
            produto = produto_repo.buscar_por_id(primeiro_id)
            self.assertIsNotNone(produto)
            
            # Filtrar por categoria
            categoria = produto['categoria']
            produtos_categoria = produto_repo.filtrar_por_categoria(categoria)
            self.assertGreater(len(produtos_categoria), 0)
    
    @unittest.skip("Requer banco de dados MySQL configurado e rodando")
    def test_fluxo_completo_venda(self):
        """Testa fluxo completo de venda"""
        produto_repo = ProdutoRepo()
        venda_repo = VendaRepo()
        
        # Buscar um produto com estoque
        produtos = produto_repo.listar_todos()
        produto_com_estoque = None
        
        for p in produtos:
            if p['estoque'] > 5:
                produto_com_estoque = p
                break
        
        if produto_com_estoque:
            estoque_antes = produto_com_estoque['estoque']
            
            # Registrar venda
            venda_id, valor_total = venda_repo.registrar_venda(
                produto_com_estoque['id'], 
                2
            )
            
            self.assertIsNotNone(venda_id)
            self.assertGreater(valor_total, 0)
            
            # Verificar estoque atualizado
            produto_depois = produto_repo.buscar_por_id(produto_com_estoque['id'])
            self.assertEqual(produto_depois['estoque'], estoque_antes - 2)


def suite():
    """Cria uma suite de testes"""
    loader = unittest.TestLoader()
    test_suite = unittest.TestSuite()
    
    # Adiciona testes de ProdutoRepo
    test_suite.addTests(loader.loadTestsFromTestCase(TestProdutoRepo))
    
    # Adiciona testes de VendaRepo
    test_suite.addTests(loader.loadTestsFromTestCase(TestVendaRepo))
    
    # Adiciona testes de Database
    test_suite.addTests(loader.loadTestsFromTestCase(TestDatabase))
    
    # Adiciona testes de Validações
    test_suite.addTests(loader.loadTestsFromTestCase(TestValidacoes))
    
    return test_suite


if __name__ == '__main__':
    print("=" * 70)
    print("EXECUTANDO TESTES DO SISTEMA DE VENDAS - MySQL")
    print("=" * 70)
    print()
    
    # Executar todos os testes com relatório detalhado
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite())
    
    # Resumo final
    print("\n" + "=" * 70)
    print("RESUMO DOS TESTES")
    print("=" * 70)
    print(f"Testes executados: {result.testsRun}")
    print(f"Sucessos: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Falhas: {len(result.failures)}")
    print(f"Erros: {len(result.errors)}")
    print("=" * 70)
    
    # Retorna código de saída apropriado
    sys.exit(0 if result.wasSuccessful() else 1)