// frontend/src/components/forms/ProductForm.tsx

import React, { useState } from "react";
// Importa a função de cadastro que faz a chamada POST para o Backend
import { cadastrarProduto } from "../../api/produtos";

const ProductForm: React.FC = () => {
  // 1. Estado para Gerenciar os Dados do Formulário
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    unidade_medida: "",
    estoque_inicial: 0, // Campos numéricos
    preco_venda: 0,
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Função para Atualizar o Estado ao Mudar os Campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // Converte valores numéricos para float/int
      [name]:
        name === "estoque_inicial" || name === "preco_venda"
          ? parseFloat(value)
          : value,
    }));
  };

  // 3. Função para Lidar com a Submissão
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Verifica se o nome e o preço estão preenchidos (validação mínima)
      if (!formData.nome || !formData.preco_venda) {
        setMessage({
          text: "O nome e o preço de venda são obrigatórios.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      // Chamada à API (rota POST /api/produtos)
      const result = await cadastrarProduto(formData);

      // Sucesso: Limpa o formulário e exibe mensagem
      setMessage({
        text: `Produto cadastrado com sucesso! ID: ${result.produto_id}`,
        type: "success",
      });
      setFormData({
        nome: "",
        tipo: "",
        unidade_medida: "",
        estoque_inicial: 0,
        preco_venda: 0,
      });
    } catch (error: any) {
      // Erro: Exibe a mensagem de erro da API ou um erro genérico
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao cadastrar. Verifique a conexão com o Backend.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}
    >
      <h3>Cadastrar Novo Produto</h3>

      {/* Mensagem de Feedback */}
      {message && (
        <p style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campo Nome do Produto */}
        <div style={{ marginBottom: "10px" }}>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Campo Tipo */}
        <div style={{ marginBottom: "10px" }}>
          <label>Tipo:</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Selecione o Tipo</option>
            <option value="Eletrônico">Eletrônico</option>
            <option value="Vestuário">Vestuário</option>
            <option value="Serviço">Serviço</option>
          </select>
        </div>

        {/* Campo Unidade de Medida */}
        <div style={{ marginBottom: "10px" }}>
          <label>Unidade de Medida:</label>
          <input
            type="text"
            name="unidade_medida"
            value={formData.unidade_medida}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Campo Estoque Inicial */}
        <div style={{ marginBottom: "10px" }}>
          <label>Estoque Inicial:</label>
          <input
            type="number"
            name="estoque_inicial"
            value={formData.estoque_inicial}
            onChange={handleChange}
            min="0"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Campo Preço de Venda */}
        <div style={{ marginBottom: "10px" }}>
          <label>Preço de Venda (R$):</label>
          <input
            type="number"
            name="preco_venda"
            value={formData.preco_venda}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

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
          {loading ? "Cadastrando..." : "Salvar Produto"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
