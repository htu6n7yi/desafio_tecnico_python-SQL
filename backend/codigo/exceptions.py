"""
Exceções personalizadas para o sistema de vendas
"""


class VendaError(Exception):
    """Classe base para exceções relacionadas a vendas"""
    pass


class ProdutoNaoEncontradoError(VendaError):
    """Exceção lançada quando um produto não é encontrado"""
    def __init__(self, message="Produto não encontrado"):
        self.message = message
        super().__init__(self.message)


class EstoqueInsuficienteError(VendaError):
    """Exceção lançada quando o estoque é insuficiente para a venda"""
    def __init__(self, message="Estoque insuficiente"):
        self.message = message
        super().__init__(self.message)


class QuantidadeInvalidaError(VendaError):
    """Exceção lançada quando a quantidade da venda é inválida"""
    def __init__(self, message="Quantidade inválida"):
        self.message = message
        super().__init__(self.message)


class ProdutoError(Exception):
    """Classe base para exceções relacionadas a produtos"""
    pass


class PrecoInvalidoError(ProdutoError):
    """Exceção lançada quando o preço do produto é inválido"""
    def __init__(self, message="Preço inválido"):
        self.message = message
        super().__init__(self.message)


class EstoqueInvalidoError(ProdutoError):
    """Exceção lançada quando o estoque é inválido"""
    def __init__(self, message="Estoque inválido"):
        self.message = message
        super().__init__(self.message)


class DatabaseError(Exception):
    """Classe base para exceções relacionadas ao banco de dados"""
    pass


class ConexaoError(DatabaseError):
    """Exceção lançada quando há erro de conexão com o banco"""
    def __init__(self, message="Erro ao conectar ao banco de dados"):
        self.message = message
        super().__init__(self.message)