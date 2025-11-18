// frontend/src/components/forms/ProductEditForm.tsx

import React, { useState, useEffect } from "react";
import { Produto } from "../../api/produtos"; // Tipo do produto
import { atualizarProduto, ProdutoUpdate } from "../../api/produtos";

interface ProductEditFormProps {
  produto: Produto; // O produto a ser editado (obrigatório)
  onClose: () => void; // Função para fechar o modal
  onUpdate: () => Promise<void>; // Função para recarregar a lista (no pai)
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  produto,
  onClose,
  onUpdate,
}) => {
  // Inicializa o estado com os dados atuais do produto
  const [formData, setFormData] = useState<ProdutoUpdate>({
    nome: produto.nome,
    tipo: produto.tipo,
    unidade_medida: produto.unidade_medida,
    preco_venda: produto.preco_venda,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Garante que o estado seja atualizado se o produto mudar (ex: se o modal for reutilizado)
  useEffect(() => {
    setFormData({
      nome: produto.nome,
      tipo: produto.tipo,
      unidade_medida: produto.unidade_medida,
      preco_venda: produto.preco_venda,
    });
    setMessage(null);
  }, [produto]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "preco_venda" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Chamada à API para atualização (PUT)
      await atualizarProduto(produto.produto_id, formData);

      setMessage({ text: "Produto atualizado com sucesso!", type: "success" });

      // Recarrega a lista na página principal e fecha o modal após um pequeno atraso
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Erro ao atualizar o produto.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Estilos simples para o modal (use a sua biblioteca de UI se tiver)
  const modalStyle = {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };
  const contentStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h4>Editar Produto: {produto.nome}</h4>

        {message && (
          <p style={{ color: message.type === "success" ? "green" : "red" }}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campos de Edição */}
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Preço de Venda (R$):</label>
          <input
            type="number"
            name="preco_venda"
            value={formData.preco_venda || 0}
            onChange={handleChange}
            required
            step="0.01"
            style={{ width: "100%", marginBottom: "10px" }}
          />

          {/* (Adicione Tipo e Unidade de Medida aqui, seguindo o padrão) */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 15px",
                backgroundColor: "darkgreen",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 15px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditForm;
