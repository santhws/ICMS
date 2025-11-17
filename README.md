# Integrated Commercial Management System (ICMS)

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

   > `frontend/src/App.tsx`: Define as rotas usando o React Router (ex: Rota /dashboard renderiza o componente DashboardPage).
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
