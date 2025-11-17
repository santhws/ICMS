// frontend/src/components/tables/ProductTable.tsx

import React from "react";
// Certifique-se de usar o caminho correto para o tipo Produto
import { Produto } from ".././api/produtos";

// 1. Defina a Interface de Props para este componente
interface ProductTableProps {
  // A propriedade 'produtos' é obrigatória e é um array de objetos do tipo Produto
  produtos: Produto[];
}

// 2. Use a interface no componente e desestruture a prop
// Agora, o TypeScript sabe que o componente aceita 'produtos'
const ProductTable: React.FC<ProductTableProps> = ({ produtos }) => {
  // Se não houver produtos, exibe uma mensagem
  if (produtos.length === 0) {
    return <p>Nenhum produto ativo encontrado.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Estoque Atual</th>
          <th>Preço de Venda</th>
          {/* <th>Ações (Editar/Excluir)</th> */}
        </tr>
      </thead>
      <tbody>
        {/* 3. Renderiza a lista de produtos */}
        {produtos.map((produto) => (
          <tr key={produto.produto_id}>
            <td>{produto.produto_id}</td>
            <td>{produto.nome}</td>
            <td>{produto.tipo}</td>
            <td>{produto.estoque_atual}</td>
            <td>R$ {produto.preco_venda.toFixed(2)}</td>
            {/* <td><button>Editar</button></td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
