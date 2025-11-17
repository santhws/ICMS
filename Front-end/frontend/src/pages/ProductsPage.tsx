// frontend/src/pages/ProductsPage.tsx (Trecho)

// ... imports existentes (getProdutos, Produto, ProductTable)
import ProductForm from "../components/forms/ProductForm"; // NOVO IMPORT

const ProductsPage: React.FC = () => {
  // ... lógica de estados e useEffect existente (fetchProdutos)

  // ... lógica de renderização condicional (loading/error)

  return (
    <div className="products-page">
      <h2>Gerenciamento de Produtos</h2>

      {/* Colocamos o formulário e a tabela lado a lado (ou em seções separadas) */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* AQUI ESTÁ O FORMULÁRIO */}
        <div style={{ flex: 1 }}>
          <ProductForm />
        </div>

        {/* A Tabela com a lista de produtos ativos */}
        <div style={{ flex: 2 }}>
          <p>Total de Produtos Ativos: {produtos.length}</p>
          <ProductTable produtos={produtos} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
