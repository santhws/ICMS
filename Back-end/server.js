// server.js (na pasta backend)

// 1. Importar dotenv para carregar as variáveis de ambiente
require("dotenv").config();

// server.js (Adicionar no topo do arquivo, junto aos outros 'require')
const multer = require("multer");
const xlsx = require("xlsx");
// Configuração do Multer para salvar arquivos temporariamente na memória
// Isso é mais simples e seguro do que salvar no disco para arquivos pequenos
const upload = multer({ storage: multer.memoryStorage() });
const express = require("express");
// Importar o Client do PostgreSQL
const { Pool } = require("pg");

const app = express();
// Permite que o servidor processe dados JSON nas requisições
app.use(express.json());

const port = process.env.PORT || 3001;

// --- Configuração da Conexão com o Banco de Dados ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Testar a conexão
pool
  .connect()
  .then((client) => {
    console.log("✅ Conexão com o PostgreSQL estabelecida com sucesso!");
    client.release(); // Libera o cliente de volta ao pool
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao PostgreSQL:", err.message);
  });

// ----------------------------------------------------

// [Aqui criaremos a primeira rota da API no Passo 3]

// Iniciar o Servidor
app.listen(port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
});

// server.js (Adicionar esta seção antes do app.listen)

// Rota para buscar todos os produtos ativos
app.get("/api/produtos", async (req, res) => {
  try {
    // SQL para selecionar todos os campos dos produtos ativos
    const query =
      "SELECT produto_id, nome, tipo, unidade_medida, estoque_atual, preco_venda, data_cadastro FROM PRODUTOS WHERE ativo = TRUE ORDER BY nome ASC";

    // Executa a query no banco de dados usando o pool
    const result = await pool.query(query);

    // Retorna a lista de produtos como resposta JSON
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    // Retorna um erro 500 (Internal Server Error)
    res.status(500).json({ error: "Falha ao buscar dados no banco de dados." });
  }
});

// Exemplo de Rota de Teste Simples
app.get("/", (req, res) => {
  res.send("Servidor ICMS API está rodando!");
});

// ... (app.listen)
// server.js (Adicionar esta seção antes do app.listen)

// ... (Sua rota GET /api/produtos existente)

// Rota para cadastrar um novo produto
app.post("/api/produtos", async (req, res) => {
  // 1. Desestruturação dos dados recebidos do Frontend
  const {
    nome,
    tipo,
    unidade_medida,
    estoque_inicial, // Usaremos este campo para o estoque inicial
    preco_venda,
  } = req.body;

  // 2. Validação Básica (Essencial para garantir que dados cruciais não estão faltando)
  if (!nome || !tipo || !unidade_medida || preco_venda === undefined) {
    return res.status(400).json({
      error:
        "Todos os campos obrigatórios (nome, tipo, unidade_medida, preco_venda) devem ser fornecidos.",
    });
  }

  try {
    // 3. Query SQL de Inserção na Tabela PRODUTOS
    const insertProductQuery = `
            INSERT INTO PRODUTOS (
                nome, tipo, unidade_medida, estoque_atual, preco_venda, data_cadastro, ativo
            )
            VALUES ($1, $2, $3, $4, $5, NOW(), TRUE)
            RETURNING produto_id; 
        `;

    // Os valores são passados como array ($1 é nome, $2 é tipo, etc.)
    const productValues = [
      nome,
      tipo,
      unidade_medida,
      estoque_inicial || 0, // Garante que o estoque inicial seja 0 se não for fornecido
      preco_venda,
    ];

    const result = await pool.query(insertProductQuery, productValues);
    const produto_id = result.rows[0].produto_id; // Pega o ID gerado pelo DB

    // 4. Inserir Log de Estoque (Se houver estoque inicial)
    if (estoque_inicial > 0) {
      const insertLogQuery = `
                INSERT INTO LOG_ESTOQUE (
                    produto_id, tipo_movimento, quantidade, custo_unitario, fornecedor, data_hora
                )
                VALUES ($1, $2, $3, $4, $5, NOW());
            `;
      // Assumimos um fornecedor genérico e custo zero para o primeiro registro
      const logValues = [
        produto_id,
        "ENTRADA",
        estoque_inicial,
        0,
        "Estoque Inicial",
      ];
      await pool.query(insertLogQuery, logValues);
    }

    // 5. Resposta de Sucesso
    res.status(201).json({
      message: "Produto cadastrado com sucesso!",
      produto_id: produto_id,
    });
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    res.status(500).json({ error: "Falha interna ao cadastrar o produto." });
  }
});

// ... (Seu código restante, incluindo app.listen)

// server.js (Adicionar esta seção antes do app.listen, após as rotas GET e POST)

// Rota para atualizar (modificar) ou desativar (excluir logicamente) um produto
app.put("/api/produtos/:id", async (req, res) => {
  // 1. Capturar o ID do produto da URL e os dados do corpo da requisição
  const produto_id = req.params.id;
  const {
    nome,
    tipo,
    unidade_medida,
    preco_venda,
    ativo, // Campo opcional para Exclusão Lógica
  } = req.body;

  // 2. Montar a Query SQL dinamicamente
  let queryParts = [];
  let queryValues = [];
  let paramIndex = 1;

  // Adiciona ao array de partes da query apenas os campos que foram fornecidos
  if (nome !== undefined) {
    queryParts.push(`nome = $${paramIndex++}`);
    queryValues.push(nome);
  }
  if (tipo !== undefined) {
    queryParts.push(`tipo = $${paramIndex++}`);
    queryValues.push(tipo);
  }
  if (unidade_medida !== undefined) {
    queryParts.push(`unidade_medida = $${paramIndex++}`);
    queryValues.push(unidade_medida);
  }
  if (preco_venda !== undefined) {
    queryParts.push(`preco_venda = $${paramIndex++}`);
    queryValues.push(preco_venda);
  }
  // Para Exclusão Lógica: se o campo 'ativo' for fornecido (TRUE ou FALSE)
  if (ativo !== undefined) {
    queryParts.push(`ativo = $${paramIndex++}`);
    queryValues.push(ativo);
  }

  // Se não houver campos para atualizar, retorna erro 400
  if (queryParts.length === 0) {
    return res
      .status(400)
      .json({ error: "Nenhum campo de atualização fornecido." });
  }

  // Adiciona o ID do produto como o último valor para a cláusula WHERE
  queryValues.push(produto_id);

  try {
    // 3. Montar e Executar a Query SQL final
    const updateQuery = `
            UPDATE PRODUTOS
            SET ${queryParts.join(", ")} 
            WHERE produto_id = $${paramIndex}
            RETURNING produto_id;
        `;

    const result = await pool.query(updateQuery, queryValues);

    // 4. Verificação de Sucesso
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // 5. Resposta
    res.status(200).json({
      message: "Produto atualizado com sucesso.",
      produto_id: produto_id,
    });
  } catch (error) {
    console.error(`Erro ao atualizar produto ${produto_id}:`, error);
    res.status(500).json({ error: "Falha interna ao atualizar o produto." });
  }
});

// ... (Seu código restante, incluindo app.listen)

// server.js (Adicionar esta rota após as outras rotas POST/PUT)

// Rota para importar dados de estoque/produtos via arquivo Excel
app.post(
  "/api/importar-estoque",
  upload.single("arquivoExcel"),
  async (req, res) => {
    // Verifica se um arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo Excel enviado." });
    }

    try {
      const fileBuffer = req.file.buffer; // O arquivo em formato binário
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });

      // Assumimos que a primeira aba é a que contém os dados
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Converte a planilha para um array de objetos JSON
      const data = xlsx.utils.sheet_to_json(worksheet, {
        header: 1, // Ler como array de arrays
        raw: false, // Manter formatação de datas
      });

      // ----------------------------------------------------
      // 4. Lógica de Processamento e Inserção no PostgreSQL
      // ----------------------------------------------------

      // Assumimos que o arquivo Excel tem 4 colunas essenciais:
      // Coluna A (Índice 0): Nome do Produto (ou ID)
      // Coluna B (Índice 1): Quantidade Movimentada
      // Coluna C (Índice 2): Tipo de Movimento (ENTRADA/SAIDA)
      // Coluna D (Índice 3): Fornecedor (apenas para ENTRADA)

      let produtosAtualizados = 0;

      // Começa a iterar a partir da segunda linha (data[1]) para pular o cabeçalho (data[0])
      for (let i = 1; i < data.length; i++) {
        const row = data[i];

        // Mapeamento das colunas da planilha
        const [nomeOuId, quantidade, tipoMovimento, fornecedor] = row;

        // --- Validação Mínima da Linha ---
        if (
          !nomeOuId ||
          !quantidade ||
          (tipoMovimento !== "ENTRADA" && tipoMovimento !== "SAIDA")
        ) {
          console.warn(
            `Linha ${i + 1} ignorada: Dados incompletos ou inválidos.`
          );
          continue;
        }

        // 1. Buscar o Produto e Obter o ID
        const produtoSearch = isNaN(nomeOuId)
          ? "SELECT produto_id, estoque_atual FROM PRODUTOS WHERE nome = $1 AND ativo = TRUE"
          : "SELECT produto_id, estoque_atual FROM PRODUTOS WHERE produto_id = $1 AND ativo = TRUE";

        const produtoResult = await pool.query(produtoSearch, [nomeOuId]);

        if (produtoResult.rowCount === 0) {
          console.warn(
            `Produto "${nomeOuId}" na linha ${i + 1} não encontrado. Ignorando.`
          );
          continue;
        }

        const { produto_id, estoque_atual } = produtoResult.rows[0];
        const novaQuantidade = parseFloat(quantidade);
        const novoEstoque =
          tipoMovimento === "ENTRADA"
            ? estoque_atual + novaQuantidade
            : estoque_atual - novaQuantidade;

        // 2. Transação: Atualizar o Estoque
        await pool.query(
          "UPDATE PRODUTOS SET estoque_atual = $1 WHERE produto_id = $2",
          [novoEstoque, produto_id]
        );

        // 3. Transação: Inserir o Log de Estoque (Requisito: Atividade de Ações Feitas)
        const insertLogQuery = `
                INSERT INTO LOG_ESTOQUE (produto_id, tipo_movimento, quantidade, fornecedor, data_hora)
                VALUES ($1, $2, $3, $4, NOW());
            `;
        const logFornecedor = tipoMovimento === "ENTRADA" ? fornecedor : null;
        await pool.query(insertLogQuery, [
          produto_id,
          tipoMovimento,
          novaQuantidade,
          logFornecedor,
        ]);

        produtosAtualizados++;
      }

      // 5. Resposta de Sucesso
      res.status(200).json({
        message: `Importação concluída com sucesso. ${produtosAtualizados} produtos e logs atualizados.`,
        totalLinhasProcessadas: data.length - 1,
      });
    } catch (error) {
      console.error("Erro durante a importação do Excel:", error);
      res
        .status(500)
        .json({ error: "Falha interna no processamento do arquivo." });
    }
  }
);

// server.js (Adicionar esta seção após as outras rotas)

// Rota para exportar relatório financeiro (Vendas e Despesas)
app.get("/api/exportar/financeiro", async (req, res) => {
  // 1. Capturar e validar os parâmetros de data
  const { mes, ano } = req.query; // Ex: /api/exportar/financeiro?mes=11&ano=2025

  if (!mes || !ano) {
    return res
      .status(400)
      .json({ error: 'Os parâmetros "mes" e "ano" são obrigatórios.' });
  }

  try {
    // 2. Consultas Consolidadas no PostgreSQL

    // Consulta para Vendas Totais no Período
    const vendasQuery = `
            SELECT SUM(valor_total) AS total_vendas
            FROM VENDAS
            WHERE EXTRACT(MONTH FROM data_venda) = $1 AND EXTRACT(YEAR FROM data_venda) = $2;
        `;
    const vendasResult = await pool.query(vendasQuery, [mes, ano]);
    const totalVendas = parseFloat(vendasResult.rows[0].total_vendas) || 0;

    // Consulta para Despesas Totais no Período
    const despesasQuery = `
            SELECT categoria, SUM(valor) AS total_despesa
            FROM DESPESAS
            WHERE EXTRACT(MONTH FROM data_despesa) = $1 AND EXTRACT(YEAR FROM data_despesa) = $2
            GROUP BY categoria;
        `;
    const despesasResult = await pool.query(despesasQuery, [mes, ano]);

    // 3. Organizar os Dados para o Excel

    // Calcular o Lucro Bruto
    const lucroBruto =
      totalVendas -
      despesasResult.rows.reduce(
        (sum, item) => sum + parseFloat(item.total_despesa),
        0
      );

    // Estruturar o objeto final do relatório
    const relatorioDados = [
      // Resumo
      ["Relatório Financeiro Periódico", `Mês ${mes}/${ano}`],
      ["", ""],
      ["INDICADOR", "VALOR"],
      ["Vendas Totais", totalVendas.toFixed(2)],
      ["Despesas Totais", (totalVendas - lucroBruto).toFixed(2)],
      ["LUCRO BRUTO", lucroBruto.toFixed(2)],
      ["", ""],
      // Detalhe das Despesas
      ["DETALHAMENTO DAS DESPESAS", ""],
      ["CATEGORIA", "VALOR"],
      ...despesasResult.rows.map((row) => [
        row.categoria,
        parseFloat(row.total_despesa).toFixed(2),
      ]),
    ];

    // 4. Gerar o Arquivo Excel
    const ws = xlsx.utils.aoa_to_sheet(relatorioDados);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, `Relatorio_${mes}_${ano}`);

    // 5. Enviar o Arquivo como Resposta
    const file = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Relatorio_ICMS_${ano}_${mes}.xlsx"`,
    });

    res.status(200).send(file);
  } catch (error) {
    console.error("Erro na exportação do relatório:", error);
    res.status(500).json({ error: "Falha interna ao gerar o relatório." });
  }
});
