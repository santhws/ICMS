export interface Produto {
  produto_id: number;
  nome: string;
  tipo: string;
  unidade_medida: string;
  estoque_atual: number;
  preco_venda: number;
  data_cadastro: string;
  ativo: boolean;
}

export type ProdutoCreateData = Omit<
  Produto,
  "produto_id" | "data_cadastro" | "ativo"
>;

export interface ProdutoUpdateData {
  nome?: string;
  tipo?: string;
  unidade_medida?: string;
  preco_venda?: number;
  ativo?: boolean;
  // FIX: Add 'estoque_atual' to allow it to be updated.
  estoque_atual?: number;
}

export interface LogEstoque {
  log_id: number;
  produto_id: number;
  nome_produto: string;
  data_movimento: string;
  quantidade: number;
  tipo_movimento: "ENTRADA" | "SAIDA";
  motivo: string;
  valor_operacao: number;
  fornecedor?: string;
}

export interface KpiData {
  totalVendas: number;
  totalDespesas: number;
  saldo: number;
}
