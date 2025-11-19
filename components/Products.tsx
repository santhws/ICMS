import React, { useState, useEffect, useCallback } from "react";
import { Produto, ProdutoCreateData, ProdutoUpdateData } from "../types";
import {
  getProdutos,
  cadastrarProduto,
  atualizarProduto,
  desativarProduto,
} from "../services/api";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Input from "./ui/Input";

const ProductForm: React.FC<{
  product: Partial<Produto> | null;
  onSave: (data: ProdutoCreateData | ProdutoUpdateData) => void;
  onCancel: () => void;
}> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: product?.nome || "",
    tipo: product?.tipo || "",
    unidade_medida: product?.unidade_medida || "",
    preco_venda: product?.preco_venda?.toString() || "",
    estoque_atual: product?.estoque_atual?.toString() || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "nome":
        if (!value.trim()) return "O nome é obrigatório.";
        if (value.length > 100)
          return "O nome não pode exceder 100 caracteres.";
        break;
      case "tipo":
        if (!value.trim()) return "O tipo é obrigatório.";
        if (value.length > 50) return "O tipo não pode exceder 50 caracteres.";
        break;
      case "unidade_medida":
        if (!value.trim()) return "A unidade de medida é obrigatória.";
        if (value.length > 20)
          return "A unidade de medida não pode exceder 20 caracteres.";
        break;
      case "preco_venda": {
        if (!value.trim()) return "O preço é obrigatório.";
        const preco = Number(value);
        if (isNaN(preco) || preco <= 0) {
          return "O preço deve ser um número positivo.";
        }
        break;
      }
      case "estoque_atual": {
        if (!product?.produto_id) {
          // Validation only for new products
          if (!value.trim()) return "O estoque inicial é obrigatório.";
          const estoque = Number(value);
          if (isNaN(estoque) || estoque < 0 || !Number.isInteger(estoque)) {
            return "O estoque deve ser um número inteiro não-negativo.";
          }
        }
        break;
      }
      default:
        break;
    }
    return "";
  };

  const validateForm = (): boolean => {
    const fieldsToValidate = {
      nome: formData.nome,
      tipo: formData.tipo,
      unidade_medida: formData.unidade_medida,
      preco_venda: formData.preco_venda,
      // Only include estoque_atual for validation if it's a new product
      ...(!product?.produto_id && { estoque_atual: formData.estoque_atual }),
    };

    const newErrors: { [key: string]: string } = {};
    let isValid = true;
    for (const [key, value] of Object.entries(fieldsToValidate)) {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited for better user experience
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const commonData = {
        nome: formData.nome.trim(),
        tipo: formData.tipo.trim(),
        unidade_medida: formData.unidade_medida.trim(),
        preco_venda: parseFloat(formData.preco_venda),
      };
      if (product?.produto_id) {
        onSave(commonData);
      } else {
        const createData: ProdutoCreateData = {
          ...commonData,
          estoque_atual: parseInt(formData.estoque_atual, 10),
        };
        onSave(createData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Nome do Produto"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.nome}
        maxLength={100}
      />
      <Input
        label="Tipo"
        name="tipo"
        value={formData.tipo}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.tipo}
        maxLength={50}
      />
      <Input
        label="Unidade de Medida"
        name="unidade_medida"
        value={formData.unidade_medida}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.unidade_medida}
        maxLength={20}
      />
      <Input
        label="Preço de Venda"
        name="preco_venda"
        type="number"
        step="0.01"
        value={formData.preco_venda}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.preco_venda}
      />
      {!product?.produto_id && (
        <Input
          label="Estoque Inicial"
          name="estoque_atual"
          type="number"
          value={formData.estoque_atual}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.estoque_atual}
        />
      )}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {product?.produto_id ? "Salvar Alterações" : "Cadastrar Produto"}
        </Button>
      </div>
    </form>
  );
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProdutos();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar produtos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product: Produto | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (
    data: ProdutoCreateData | ProdutoUpdateData
  ) => {
    try {
      if (editingProduct && editingProduct.produto_id) {
        await atualizarProduto(
          editingProduct.produto_id,
          data as ProdutoUpdateData
        );
      } else {
        await cadastrarProduto(data as ProdutoCreateData);
      }
      handleCloseModal();
      await fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
      // Here you would show an error toast to the user
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Tem certeza que deseja desativar este produto?")) {
      try {
        await desativarProduto(id);
        await fetchProducts();
      } catch (err) {
        console.error("Failed to deactivate product:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Produtos
        </h1>
        <Button onClick={() => handleOpenModal()}>Adicionar Produto</Button>
      </div>

      <Card>
        {loading && <p>Carregando produtos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Estoque
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Preço Venda
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.produto_id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{product.produto_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {product.nome}
                    </td>
                    <td className="px-6 py-4">{product.tipo}</td>
                    <td className="px-6 py-4">
                      {product.estoque_atual} {product.unidade_medida}
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.preco_venda)}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        variant="secondary"
                        className="px-2 py-1 text-xs"
                        onClick={() => handleOpenModal(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        className="px-2 py-1 text-xs"
                        onClick={() => handleDeleteProduct(product.produto_id)}
                      >
                        Desativar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Editar Produto" : "Cadastrar Novo Produto"}
      >
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Products;
