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

// frontend/src/api/produtos.ts (ou outro arquivo de tipos/API)

// ... (Importações e exportações de Produto existentes) ...

// NOVO TIPO: Interface para o Log de Estoque
export interface LogEstoque {
  log_id: number;
  produto_id: number;
  nome_produto: string; // Para facilitar a exibição no Frontend (pode ser retornado pelo Backend no JOIN)
  data_movimento: string; // Ou Date, dependendo de como você parseia
  quantidade: number;
  tipo_movimento: "ENTRADA" | "SAIDA";
  motivo: string; // Venda, Compra, Ajuste, Importação, etc.
}

// Interface para os dados que podem ser atualizados
export interface ProdutoUpdate {
  nome?: string;
  tipo?: string;
  unidade_medida?: string;
  preco_venda?: number;
  // status_ativo não é passado aqui, pois é tratado separadamente na exclusão lógica
}

// 1. Função para Atualizar o Produto (PUT)
export async function atualizarProduto(id: number, dados: ProdutoUpdate) {
  try {
    const response = await api.put(`/produtos/${id}`, dados);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 2. Função para Exclusão Lógica (PUT com status_ativo=false)
export async function desativarProduto(id: number) {
  try {
    // Envia o payload com o campo que indica exclusão lógica
    const response = await api.put(`/produtos/${id}`, { status_ativo: false });
    return response.data; // Deve retornar o produto desativado
  } catch (error) {
    throw error;
  }
}
