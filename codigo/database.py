import mysql.connector

# 🔗 Faz a conexão com o MySQL
conexao = mysql.connector.connect(
    host="localhost",
    user="root",           # seu usuário MySQL
    password="12345678",  # sua senha
    database="loja_virtual"  # nome do banco de dados (crie antes)
)

cursor = conexao.cursor()

# 🧱 Criação da tabela compatível com MySQL
cursor.execute("""
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    estoque INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS vendas (
id SERIAL PRIMARY KEY,
produto_id INT,
quantidade INT NOT NULL,
data_venda TIMESTAMP DEFAULT NOW(),
valor_total DECIMAL(10,2) NOT NULL,
FOREIGN KEY (produto_id) REFERENCES produtos(id)
);""")

conexao.commit()
cursor.close()
conexao.close()

print(" Tabela 'produtos' criada com sucesso!")
