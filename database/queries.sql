-- queries.sql

-- 1. Produtos com estoque maior que 5, ordenados por categoria e preço
SELECT * FROM produtos
WHERE estoque > 5
ORDER BY categoria ASC, preco ASC;

-- 2. Relatório de vendas com nome do produto, categoria e data
SELECT v.id, p.nome AS produto, p.categoria, v.quantidade, v.valor_total, v.data_venda
FROM vendas v
LEFT JOIN produtos p ON p.id = v.produto_id
ORDER BY v.data_venda DESC;

-- 3. Total de vendas e receita por categoria nos últimos 30 dias
SELECT p.categoria,
       SUM(v.quantidade) AS total_quantidade,
       SUM(v.valor_total) AS receita_total
FROM vendas v
JOIN produtos p ON p.id = v.produto_id
WHERE v.data_venda >= now() - INTERVAL 30 DAY
GROUP BY p.categoria
ORDER BY receita_total DESC;

-- 4. Top 5 produtos mais vendidos por quantidade
SELECT p.id, p.nome, SUM(v.quantidade) AS total_vendido
FROM vendas v
JOIN produtos p ON p.id = v.produto_id
GROUP BY p.id, p.nome
ORDER BY total_vendido DESC
LIMIT 5;

-- 5. Produtos nunca vendidos ou com estoque crítico (< 3 unidades)
SELECT p.*
FROM produtos p
LEFT JOIN vendas v ON v.produto_id = p.id
GROUP BY p.id
HAVING COALESCE(SUM(v.quantidade), 0) = 0
   OR p.estoque < 3;
