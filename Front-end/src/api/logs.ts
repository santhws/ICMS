// frontend/src/api/logs.ts (ou onde preferir)

import api from "./config";
import { LogEstoque } from "./produtos"; // Importa o tipo

// Rota a ser implementada no Backend: GET /api/logs/estoque
export async function getLogsEstoque(): Promise<LogEstoque[]> {
  try {
    const response = await api.get("/logs/estoque");
    return response.data;
  } catch (error) {
    // Lidar com erros de rede ou API
    console.error("Erro ao buscar logs de estoque:", error);
    throw new Error("Não foi possível carregar o histórico de logs.");
  }
}
