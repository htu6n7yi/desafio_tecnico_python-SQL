// Aqui fica toda a sujeira de conexão com a API
const API_URL = 'http://localhost:8000/api/produtos/';

export const buscarTodosProdutos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar dados');
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // Retorna lista vazia para não quebrar o map/length
  }
};

export const buscarProdutoPorId = async (id: any) => {
  const todos = await buscarTodosProdutos();
  return todos.find((item: any) => item.id === Number(id));
};
