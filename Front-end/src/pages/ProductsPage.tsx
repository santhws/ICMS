// frontend/src/pages/ProductsPage.tsx

import React, { useEffect, useState } from "react";
// Importe as novas funções e o novo componente de edição
import { getProdutos, Produto, desativarProduto } from "../api/produtos";
import ProductTable from "../components/tables/ProductTable";
import ProductForm from "../components/forms/ProductForm";
import ProductEditForm from "../components/forms/ProductEditForm"; // NOVO IMPORT

const ProductsPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO ESTADO: Armazena o produto a ser editado
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  // Função existente para buscar/recarregar os dados
  const fetchProdutos = async () => {
    // ... (código existente da fetchProdutos) ...
    // ...
    setLoading(true);
    try {
      const data = await getProdutos();
      setProdutos(data);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // 1. Ação para Abrir o Modal de Edição
  const handleEdit = (produto: Produto) => {
    setProdutoEmEdicao(produto);
  };

  // 2. Ação para Excluir (Desativar) o Produto
  const handleDelete = async (produto: Produto) => {
    if (
      !window.confirm(
        `Tem certeza que deseja desativar o produto: ${produto.nome}?`
      )
    ) {
      return;
    }

    setLoading(true); // Bloqueia a UI durante a operação
    try {
      await desativarProduto(produto.produto_id);
      alert(`Produto '${produto.nome}' desativado com sucesso.`);
      fetchProdutos(); // Recarrega a lista para mostrar a alteração
    } catch (error) {
      alert("Erro ao desativar o produto.");
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <h2>Gerenciamento de Produtos</h2>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Formulário de Cadastro */}
        <div style={{ flex: 1 }}>
          {/* Passa fetchProdutos para recarregar a lista após o sucesso */}
          <ProductForm onCreate={fetchProdutos} />
        </div>

        {/* Tabela de Produtos */}
        <div style={{ flex: 2 }}>
          <p>Total de Produtos Ativos: **{produtos.length}**</p>
          {/* NOVO: Passa as funções de ação para o componente filho */}
          <ProductTable
            produtos={produtos}
            onEdit={handleEdit} // Passa a função de edição
            onDelete={handleDelete} // Passa a função de exclusão
          />
        </div>
      </div>

      {/* Modal de Edição (Mostra se produtoEmEdicao não for null) */}
      {produtoEmEdicao && (
        <ProductEditForm
          produto={produtoEmEdicao}
          onClose={() => setProdutoEmEdicao(null)} // Fecha o modal
          onUpdate={fetchProdutos} // Recarrega a lista após a edição
        />
      )}
    </div>
  );
};

export default ProductsPage;
