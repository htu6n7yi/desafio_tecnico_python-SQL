const URL_API = 'http://localhost:8000/api/vendas/';

export const buscarTodasVendas = async () => {
    try{
        const response = await fetch(URL_API);
        if (!response.ok) throw new Error('Erro ao buscar dados de vendas');
        return await response.json();
    } catch (error) {
        console.error(error);
        return []; // Retorna lista vazia para não quebrar o map/length
    }

};


//falta olhar no nmo back oq esta acontecenfdo com a api vendas pois nao esta renderizando nada