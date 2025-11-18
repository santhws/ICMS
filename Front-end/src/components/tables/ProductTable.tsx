// frontend/src/components/tables/ProductTable.tsx

// ... imports existentes ...
import React from "react";
import { Produto } from "../../api/produtos";
// Assumindo que a interface Produto está definida corretamente

// 1. ATUALIZAR INTERFACE DE PROPS
interface ProductTableProps {
  produtos: Produto[];
  // NOVAS PROPS: Funções de callback
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => Promise<void>;
}

// 2. ATUALIZAR PARÂMETROS DO COMPONENTE
const ProductTable: React.FC<ProductTableProps> = ({
  produtos,
  onEdit,
  onDelete,
}) => {
  // ... (restante do código) ...

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {/* ... (th existentes) ... */}
          <th
            style={{
              padding: "10px",
              textAlign: "center",
              borderBottom: "2px solid #ddd",
            }}
          >
            Ações
          </th>{" "}
          {/* NOVO CABEÇALHO */}
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.produto_id}>
            {/* ... (tds existentes) ... */}

            {/* NOVO: Coluna de Ações */}
            <td
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => onEdit(produto)}
                style={{
                  marginRight: "10px",
                  padding: "5px 10px",
                  backgroundColor: "orange",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(produto)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
