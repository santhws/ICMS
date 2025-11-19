import {
  Produto,
  LogEstoque,
  ProdutoUpdateData,
  ProdutoCreateData,
  KpiData,
} from "../types";

// --- MOCK DATABASE ---
let mockProdutos: Produto[] = [
  {
    produto_id: 1,
    nome: 'Parafuso Sextavado 1/4"',
    tipo: "Fixadores",
    unidade_medida: "UN",
    estoque_atual: 1500,
    preco_venda: 0.75,
    data_cadastro: "2023-10-01T10:00:00Z",
    ativo: true,
  },
  {
    produto_id: 2,
    nome: "Tinta Acrílica Branca 18L",
    tipo: "Pintura",
    unidade_medida: "L",
    estoque_atual: 50,
    preco_venda: 350.0,
    data_cadastro: "2023-10-02T11:30:00Z",
    ativo: true,
  },
  {
    produto_id: 3,
    nome: "Cimento CP II 50kg",
    tipo: "Construção",
    unidade_medida: "SC",
    estoque_atual: 200,
    preco_venda: 28.5,
    data_cadastro: "2023-09-28T14:00:00Z",
    ativo: true,
  },
  {
    produto_id: 4,
    nome: "Fio Elétrico 2.5mm Rolo 100m",
    tipo: "Elétrica",
    unidade_medida: "RL",
    estoque_atual: 80,
    preco_venda: 120.0,
    data_cadastro: "2023-10-05T09:15:00Z",
    ativo: true,
  },
  {
    produto_id: 5,
    nome: "Produto Desativado Exemplo",
    tipo: "Geral",
    unidade_medida: "UN",
    estoque_atual: 0,
    preco_venda: 10.0,
    data_cadastro: "2023-01-01T00:00:00Z",
    ativo: false,
  },
];

let mockLogs: LogEstoque[] = [
  {
    log_id: 101,
    produto_id: 2,
    nome_produto: "Tinta Acrílica Branca 18L",
    data_movimento: "2023-10-28T10:00:00Z",
    quantidade: 10,
    tipo_movimento: "ENTRADA",
    motivo: "Compra",
    valor_operacao: 2800.0,
    fornecedor: "Tintas ABC",
  },
  {
    log_id: 102,
    produto_id: 3,
    nome_produto: "Cimento CP II 50kg",
    data_movimento: "2023-10-28T14:20:00Z",
    quantidade: 20,
    tipo_movimento: "SAIDA",
    motivo: "Venda",
    valor_operacao: 570.0,
  },
  {
    log_id: 103,
    produto_id: 1,
    nome_produto: 'Parafuso Sextavado 1/4"',
    data_movimento: "2023-10-29T09:05:00Z",
    quantidade: 500,
    tipo_movimento: "ENTRADA",
    motivo: "Importação",
    valor_operacao: 250.0,
    fornecedor: "Fixadores Inter",
  },
  {
    log_id: 104,
    produto_id: 4,
    nome_produto: "Fio Elétrico 2.5mm Rolo 100m",
    data_movimento: "2023-10-30T11:00:00Z",
    quantidade: 5,
    tipo_movimento: "SAIDA",
    motivo: "Venda",
    valor_operacao: 600.0,
  },
  {
    log_id: 105,
    produto_id: 2,
    nome_produto: "Tinta Acrílica Branca 18L",
    data_movimento: "2023-10-30T16:45:00Z",
    quantidade: 2,
    tipo_movimento: "SAIDA",
    motivo: "Ajuste",
    valor_operacao: 700.0,
  },
];

let nextProductId = 6;
let nextLogId = 106;

const simulateNetworkLatency = (delay = 500) =>
  new Promise((res) => setTimeout(res, delay));

// --- API FUNCTIONS ---

// Função para buscar todos os produtos ativos
export async function getProdutos(): Promise<Produto[]> {
  await simulateNetworkLatency();
  return mockProdutos.filter((p) => p.ativo);
}

// Função para cadastrar um novo produto
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

  // --- LOG DE ESTOQUE INICIAL ---
  // Conforme solicitado, um log de 'ENTRADA' é criado se o produto
  // for cadastrado com estoque inicial maior que zero.
  if (novoProduto.estoque_atual > 0) {
    const novoLog: LogEstoque = {
      log_id: nextLogId++,
      produto_id: novoProduto.produto_id,
      nome_produto: novoProduto.nome,
      data_movimento: new Date().toISOString(),
      quantidade: novoProduto.estoque_atual,
      tipo_movimento: "ENTRADA",
      motivo: "Cadastro Inicial",
      valor_operacao: novoProduto.estoque_atual * novoProduto.preco_venda,
    };
    mockLogs.push(novoLog);
  }

  return novoProduto;
}

// Função para atualizar um produto existente
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

// Função para exclusão lógica
export async function desativarProduto(id: number): Promise<Produto> {
  await simulateNetworkLatency();
  const index = mockProdutos.findIndex((p) => p.produto_id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }
  const produto = mockProdutos[index];

  // Se houver estoque, cria um log de saída para zerá-lo
  if (produto.estoque_atual > 0) {
    const logBaixa: LogEstoque = {
      log_id: nextLogId++,
      produto_id: produto.produto_id,
      nome_produto: produto.nome,
      data_movimento: new Date().toISOString(),
      quantidade: produto.estoque_atual,
      tipo_movimento: "SAIDA",
      motivo: "Baixa por Desativação",
      valor_operacao: produto.estoque_atual * produto.preco_venda,
    };
    mockLogs.push(logBaixa);
  }

  // Zera o estoque e desativa o produto
  return atualizarProduto(id, { ativo: false, estoque_atual: 0 });
}

// Nova função para ajustar o estoque
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
      valor_operacao: Math.abs(diferenca) * produto.preco_venda,
    };
    mockLogs.push(logAjuste);
  }

  // Atualiza o estoque do produto
  return atualizarProduto(id, { estoque_atual: novaQuantidade });
}

// Função para buscar os logs de estoque
export async function getLogsEstoque(): Promise<LogEstoque[]> {
  await simulateNetworkLatency();
  return [...mockLogs].sort(
    (a, b) =>
      new Date(b.data_movimento).getTime() -
      new Date(a.data_movimento).getTime()
  );
}

// Função para buscar os dados do dashboard
export async function getKpiData(): Promise<KpiData> {
  await simulateNetworkLatency();
  const totalVendas = mockLogs
    .filter((log) => log.tipo_movimento === "SAIDA" && log.motivo === "Venda")
    .reduce((sum, log) => sum + log.valor_operacao, 0);

  const totalDespesas = mockLogs
    .filter(
      (log) =>
        log.tipo_movimento === "ENTRADA" &&
        (log.motivo === "Compra" || log.motivo === "Importação")
    )
    .reduce((sum, log) => sum + log.valor_operacao, 0);

  return {
    totalVendas,
    totalDespesas,
    saldo: totalVendas - totalDespesas,
  };
}
