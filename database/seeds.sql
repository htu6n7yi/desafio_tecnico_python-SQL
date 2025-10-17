
INSERT INTO produtos (nome, preco, categoria, estoque) VALUES
('Camiseta Básica', 39.90, 'Roupas', 20),
('Calça Jeans', 129.90, 'Roupas', 8),
('Tênis Esportivo', 249.90, 'Calçados', 5),
('Smartphone X', 1999.00, 'Eletrônicos', 3),
('Fone Bluetooth', 199.90, 'Eletrônicos', 15),
('Mochila Escolar', 89.90, 'Acessórios', 12),
('Caneca Cerâmica', 29.90, 'Casa', 50),
('Cabo USB-C', 24.90, 'Eletrônicos', 2),
('Agasalho', 159.90, 'Roupas', 1),
('Relógio Digital', 349.90, 'Acessórios', 6);

INSERT INTO vendas (produto_id, quantidade, valor_total, data_venda) VALUES
(21, 2, 79.80, '2024-03-01'),
(22, 1, 129.90, '2024-03-02'),
(21, 1, 249.90, '2024-03-03'),
(21, 1, 39.90, '2024-03-04'),
(25, 3, 599.70, '2024-03-05'),
(21, 2, 179.80, '2024-03-06'),
(26, 5, 149.50, '2024-03-07'),
(26, 1, 1999.00, '2024-03-08'),
(21, 1, 24.90, '2024-03-09'),
(21, 1, 159.90, '2024-03-10'),
(30, 2, 699.80, '2024-03-11'),
(30, 1, 249.90, '2024-03-12'),
(26, 2, 259.80, '2024-03-13'),
(22, 1, 199.90, '2024-03-14'),
(21, 1, 89.90, '2024-03-15');
