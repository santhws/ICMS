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

# Estrutura de Pastas e Arquivos no Frontend

frontend/src/
├── api/ # 1. _Arquivos de Comunicação com o Backend (Axios)_
│ └── produtos.ts _# Funções para chamar POST/GET/PUT de produtos_
├── components/ _# 2. Componentes Reutilizáveis (Cards, Botões, Tabelas)_
│ ├── layout/
│ │ ├── Layout.tsx
│ │ └── Sidebar.tsx
│ ├── ui/ _# Componentes menores (cards, inputs)_
│ │ └── KpiCard.tsx
│ └── tables/
│ └── ProductTable.tsx
├── pages/ _# 3. Páginas Principais (Componentes que correspondem a uma rota)_
│ ├── DashboardPage.tsx
│ ├── ProductsPage.tsx
│ ├── LogsPage.tsx
│ └── ReportsPage.tsx _# Onde ficarão as seções de Importação/Exportação_
├── App.tsx _# Componente Raiz e Roteamento_
├── index.css _# Estilos globais_
└── main.tsx _# Ponto de entrada do React_

### Detalhe dos Arquivos

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
