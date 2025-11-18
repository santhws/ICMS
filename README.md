# Integrated Commercial Management System (ICMS)

### Principais Funções:

1. Dashboard Interativo

   > Exibição de gráficos dinâmicos com indicadores de desempenho: total de vendas no mês, total de despesas e saldo resultante.</br>
   > Utilização de cores sinalizadoras para facilitar a análise rápida (positivo, neutro e crítico).

2. Monitoramento de Atividades Operacionais

   > Registro detalhado de movimentações de estoque (entrada e saída), incluindo valor da operação, fornecedor, data e horário.</br>
   > Histórico completo para auditoria e rastreabilidade.

3. Importação Automatizada de Planilhas Excel

   > Leitura e processamento automático de arquivos-padrão do sistema.</br>
   > Atualização de dados e execução de ações específicas conforme as informações importadas.

4. Módulo de Cadastro de Produtos

   > Inserção de novos itens com campos estruturados: tipo, quantidade, unidade de medida, data e horário de registro

5. Funcionalidade de Exclusão de Produtos

   > Remoção segura de itens do catálogo, com validações e registro de log.

6. Exportação de Arquivos Periódicos
   > Geração automática de relatórios mensais ou semanais, com opções de download e envio externo.

### Resumo do Backend

| Funcionalidade                              | Rota                       | Método | Status |
| ------------------------------------------- | -------------------------- | ------ | ------ |
| Listar Produtos (Read)                      | `/api/produtos`            | GET    | Pronto |
| Cadastro de Produtos (Create)               | `/api/produtos`            | POST   | Pronto |
| Exclusão/Atualização (Update/Delete Lógico) | `/api/produtos/:id`        | PUT    | Pronto |
| Leitura de Excel Automática (Importação)    | `/api/importar-estoque`    | POST   | Pronto |
| Exportação de Arquivos Periódicos           | `/api/exportar/financeiro` | GET    | Pronto |

---

### Detalhes dos Arquivos (Front-end)

1. Arquivos de Roteamento (Raiz)

   > `frontend/src/App.tsx`: Define as rotas usando o React Router (ex: Rota /dashboard renderiza o componente DashboardPage).</br>  
   > `frontend/src/main.tsx`: Ponto de inicialização do seu aplicativo React.

2. Módulo Dashboard

   > `frontend/src/pages/DashboardPage.tsx`: Contém a lógica de busca de dados do Dashboard.
   > `frontend/src/components/ui/KpiCard.tsx`: Renderiza um único cartão de indicador (ex: Total de Vendas).
   > `frontend/src/components/charts/SalesChart.tsx`: Componente de visualização de gráficos.

3. Módulo Produtos e Logs

   > `frontend/src/pages/ProductsPage.tsx`: Lógica de listagem, busca e filtragem de produtos.
   > `frontend/src/pages/LogsPage.tsx`: Exibe o histórico de estoque.
   > `frontend/src/components/forms/ProductForm.tsx`: O formulário para criar e editar produtos.
   > `frontend/src/components/tables/ProductTable.tsx`: A tabela que exibe a lista de produtos.

4. Módulo Importação/Exportação
   > `frontend/src/components/sections/ImportSection.tsx`: O formulário de upload de arquivo Excel.
   > `frontend/src/components/sections/ExportSection.tsx`: O formulário de seleção de data para exportação.
