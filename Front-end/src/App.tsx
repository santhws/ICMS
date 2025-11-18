// frontend/src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Importa os componentes de Layout e Página
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import LogsPage from "./pages/LogsPage";

// Você criará este componente
import ReportsPage from "./pages/ReportsPage";

const mockedProductsUtils = {
  addProduct: (product: any) =>
    console.log("Produto adicionado (MOCK):", product),
  fetchProducts: () => Promise.resolve([]), // Adicionando uma função de busca
  deleteProduct: (id: string) => console.log(`Deletando produto ${id} (MOCK)`), // Adicionando uma função de delete
  // ... adicione todas as outras propriedades obrigatórias da ProductableProps
};
// ----------------------------------------------------------------------

const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Rota de Redirecionamento */}
      {/* Se o usuário acessar a URL base (/), redireciona para o Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 2. Rotas Principais (Usando o Componente Layout) */}
      <Route path="/" element={<Layout />}>
        {/* 2.1 Dashboard Interativo */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* 2.2 Cadastro e Gerenciamento de Produtos/Estoque */}
        {/* CORRIGIDO: Passando a prop productsUtils que ProductsPage exige */}
        <Route
          path="produtos"
          // ELEMENTO CORRIGIDO: Passando o mock completo
          element={<ProductsPage productsUtils={mockedProductsUtils} />}
        />

        {/* 2.3 Logs de Movimentação (Informação de Atividade de Ações Feitas) */}
        <Route path="logs" element={<LogsPage />} />

        {/* 2.4 Importação e Exportação (Relatórios) */}
        <Route path="relatorios" element={<ReportsPage />} />

        {/* Você pode adicionar rotas específicas, como edição de um produto */}
        {/* <Route path="produtos/editar/:id" element={<ProductForm />} /> */}
      </Route>

      {/* 3. Rota de Erro 404 (Opcional) */}
      <Route path="*" element={<h1>Página Não Encontrada (404)</h1>} />
    </Routes>
  );
};

export default App;
