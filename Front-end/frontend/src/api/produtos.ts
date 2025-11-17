// frontend/src/api/produtos.ts

import api from "./config";

// 1. Defina a Estrutura do Dado (Interface) para tipagem forte com TypeScript
export interface Produto {
  produto_id: number;
  nome: string;
  tipo: string;
  unidade_medida: string;
  estoque_atual: number;
  preco_venda: number;
  data_cadastro: string;
  // 'ativo' não é estritamente necessário se o GET só traz ativos, mas é bom ter
}

// 2. Função para buscar todos os produtos (GET /api/produtos)
export async function getProdutos(): Promise<Produto[]> {
  try {
    const response = await api.get("/produtos");
    return response.data; // Retorna o array de produtos
  } catch (error) {
    console.error("Erro ao buscar a lista de produtos:", error);
    // Em um projeto real, você trataria o erro de forma mais sofisticada
    throw new Error("Não foi possível carregar os dados dos produtos.");
  }
}

// 3. Função para cadastrar um novo produto (POST /api/produtos)
export async function cadastrarProduto(dadosProduto: any) {
  // Usamos 'any' aqui, mas você pode criar uma interface específica para o payload POST
  try {
    const response = await api.post("/produtos", dadosProduto);
    return response.data; // Retorna o objeto com a mensagem de sucesso e o ID
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    throw error;
  }
}

// ... Aqui você adicionaria as funções para PUT (atualização) e outros.
