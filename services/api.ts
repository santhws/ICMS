import {
  Produto,
  LogEstoque,
  ProdutoUpdateData,
  ProdutoCreateData,
  KpiData,
  Despesa,
  DespesaCreateData,
} from "../types";

// --- MOCK DATABASE ---
// Resetting data to start fresh as requested.
let mockProdutos: Produto[] = [];
let mockLogs: LogEstoque[] = [];
let mockDespesas: Despesa[] = [];

let nextProductId = 1;
let nextLogId = 1;
let nextDespesaId = 1;

const simulateNetworkLatency = (delay = 500) =>
  new Promise((res) => setTimeout(res, delay));

// --- PRODUCTS API FUNCTIONS ---

export async function getProdutos(): Promise<Produto[]> {
  await simulateNetworkLatency();
  return mockProdutos.filter((p) => p.ativo);
}

export async function cadastrarProduto(
  dadosProduto: ProdutoCreateData
): Promise<Produto> {
  await simulateNetworkLatency();
  const novoProduto: Produto = {
    ...dadosProduto,
    produto_id: nextProductId++,
    data_cadastro: new Date().toISOString(),
    ativo: true,
  };
  mockProdutos.push(novoProduto);

  if (novoProduto.estoque_atual > 0) {
    const novoLog: LogEstoque = {
      log_id: nextLogId++,
      produto_id: novoProduto.produto_id,
      nome_produto: novoProduto.nome,
      data_movimento: new Date().toISOString(),
      quantidade: novoProduto.estoque_atual,
      tipo_movimento: "ENTRADA",
      motivo: "Cadastro Inicial",
      valor_operacao: 0, // Initial stock value is cost, not revenue. Assuming 0 cost for initial entry for simplicity.
    };
    mockLogs.push(novoLog);
  }

  return novoProduto;
}

export async function atualizarProduto(
  id: number,
  dadosAtualizacao: ProdutoUpdateData
): Promise<Produto> {
  await simulateNetworkLatency();
  const index = mockProdutos.findIndex((p) => p.produto_id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }
  mockProdutos[index] = { ...mockProdutos[index], ...dadosAtualizacao };
  return mockProdutos[index];
}

export async function desativarProduto(id: number): Promise<Produto> {
  await simulateNetworkLatency();
  const index = mockProdutos.findIndex((p) => p.produto_id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }
  const produto = mockProdutos[index];

  if (produto.estoque_atual > 0) {
    const logBaixa: LogEstoque = {
      log_id: nextLogId++,
      produto_id: produto.produto_id,
      nome_produto: produto.nome,
      data_movimento: new Date().toISOString(),
      quantidade: produto.estoque_atual,
      tipo_movimento: "SAIDA",
      motivo: "Baixa por Desativação",
      valor_operacao: 0, // Writing off stock is a loss, not a sale.
    };
    mockLogs.push(logBaixa);
  }

  return atualizarProduto(id, { ativo: false, estoque_atual: 0 });
}

export async function ajustarEstoque(
  id: number,
  novaQuantidade: number,
  motivo: string
): Promise<Produto> {
  await simulateNetworkLatency();
  const index = mockProdutos.findIndex((p) => p.produto_id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }

  const produto = mockProdutos[index];
  const estoqueAntigo = produto.estoque_atual;
  const diferenca = novaQuantidade - estoqueAntigo;

  if (diferenca !== 0) {
    const logAjuste: LogEstoque = {
      log_id: nextLogId++,
      produto_id: produto.produto_id,
      nome_produto: produto.nome,
      data_movimento: new Date().toISOString(),
      quantidade: Math.abs(diferenca),
      tipo_movimento: diferenca > 0 ? "ENTRADA" : "SAIDA",
      motivo: motivo.trim(),
      // Assuming adjustments have no financial value unless specified
      valor_operacao:
        motivo.toLowerCase() === "venda"
          ? Math.abs(diferenca) * produto.preco_venda
          : 0,
    };
    mockLogs.push(logAjuste);
  }

  return atualizarProduto(id, { estoque_atual: novaQuantidade });
}

// --- STOCK LOG API FUNCTIONS ---
export async function getLogsEstoque(): Promise<LogEstoque[]> {
  await simulateNetworkLatency();
  return [...mockLogs].sort(
    (a, b) =>
      new Date(b.data_movimento).getTime() -
      new Date(a.data_movimento).getTime()
  );
}

// --- EXPENSES API FUNCTIONS ---
export async function getDespesas(): Promise<Despesa[]> {
  await simulateNetworkLatency();
  return [...mockDespesas].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
}

export async function cadastrarDespesa(
  dadosDespesa: DespesaCreateData
): Promise<Despesa> {
  await simulateNetworkLatency();
  const novaDespesa: Despesa = {
    ...dadosDespesa,
    despesa_id: nextDespesaId++,
    data: new Date().toISOString(),
  };
  mockDespesas.push(novaDespesa);
  return novaDespesa;
}

// --- DASHBOARD API FUNCTIONS ---
export async function getKpiData(): Promise<KpiData> {
  await simulateNetworkLatency();

  const totalVendas = mockLogs
    .filter(
      (log) =>
        log.tipo_movimento === "SAIDA" && log.motivo.toLowerCase() === "venda"
    )
    .reduce((sum, log) => sum + log.valor_operacao, 0);

  const despesasDeEstoque = mockLogs
    .filter(
      (log) =>
        log.tipo_movimento === "ENTRADA" &&
        (log.motivo.toLowerCase() === "compra" ||
          log.motivo.toLowerCase() === "importação")
    )
    .reduce((sum, log) => sum + log.valor_operacao, 0);

  const outrasDespesas = mockDespesas.reduce(
    (sum, despesa) => sum + despesa.valor,
    0
  );

  const totalDespesas = despesasDeEstoque + outrasDespesas;

  return {
    totalVendas,
    totalDespesas,
    saldo: totalVendas - totalDespesas,
  };
}
